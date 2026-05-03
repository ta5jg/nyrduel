/* =============================================================================
 * POST /duel/submit — server-authoritative scoring.
 *
 * Flow:
 *   1. Parse body (zod). Reject malformed inputs.
 *   2. Confirm seed matches today's UTC seed (±1 day grace for timezone edge).
 *   3. Resolve player + AI units from id catalog.
 *   4. Re-run the deterministic battle locally.
 *   5. Compute score from the battle result.
 *   6. Upsert into submissions (replace if score improved).
 *   7. Return outcome, score, rank.
 *
 * The client's reported result is never trusted — only the ids and the seed.
 * ============================================================================= */

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  isAbilityId,
  isHeroId,
  pickAi,
  resolveUnit,
  runBattle,
  scoreFromResult,
  seedDate,
  todayUtcDate
} from "@nyrduel/engine";
import {
  ABILITY_IDS,
  HERO_IDS,
  type DuelSubmitResponse
} from "@nyrduel/protocol";
import type { Db } from "../db.js";
import { deriveUserId, sanitizeDisplayName } from "../identity.js";

const Body = z
  .object({
    v: z.literal(1),
    seed: z.string().min(1).max(64),
    player: z.object({
      hero: z.enum(HERO_IDS),
      ability: z.enum(ABILITY_IDS)
    }),
    user: z.union([z.string(), z.null()]).optional(),
    displayName: z.union([z.string(), z.null()]).optional()
  })
  .strict();

export type DuelSubmitDeps = {
  db: Db;
};

export function registerDuelSubmit(app: FastifyInstance, deps: DuelSubmitDeps): void {
  const insertOrReplace = deps.db.prepare(`
    INSERT INTO submissions (date, user, display_name, hero, ability, outcome, ticks, remaining_hp, score, at_ms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date, user) DO UPDATE SET
      display_name = excluded.display_name,
      hero         = excluded.hero,
      ability      = excluded.ability,
      outcome      = excluded.outcome,
      ticks        = excluded.ticks,
      remaining_hp = excluded.remaining_hp,
      score        = excluded.score,
      at_ms        = excluded.at_ms
    WHERE submissions.score < excluded.score
  `);

  const findExisting = deps.db.prepare(
    `SELECT score FROM submissions WHERE date = ? AND user = ?`
  );

  const rankQuery = deps.db.prepare(
    `SELECT 1 + COUNT(*) AS rank FROM submissions WHERE date = ? AND score > ?`
  );

  const totalQuery = deps.db.prepare(
    `SELECT COUNT(*) AS total FROM submissions WHERE date = ?`
  );

  app.post("/duel/submit", async (req, reply): Promise<DuelSubmitResponse> => {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { v: 1, ok: false, error: "BAD_REQUEST", message: parsed.error.issues[0]?.message };
    }
    const body = parsed.data;

    const date = seedDate(body.seed);
    if (!date) {
      reply.code(400);
      return { v: 1, ok: false, error: "BAD_REQUEST", message: "invalid seed format" };
    }

    const today = todayUtcDate();
    const acceptableYesterday = (() => {
      const d = new Date(`${today}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() - 1);
      return d.toISOString().slice(0, 10);
    })();
    if (date !== today && date !== acceptableYesterday) {
      reply.code(400);
      return { v: 1, ok: false, error: "WRONG_SEED", message: "submissions accepted for today only" };
    }

    if (!isHeroId(body.player.hero) || !isAbilityId(body.player.ability)) {
      reply.code(400);
      return { v: 1, ok: false, error: "BAD_REQUEST", message: "unknown hero/ability" };
    }

    const opponent = pickAi(body.seed);
    const playerUnit = resolveUnit(body.player.hero, body.player.ability);
    const aiUnit = resolveUnit(opponent.hero, opponent.ability);

    const result = runBattle({ seed: body.seed, a: playerUnit, b: aiUnit });
    const score = scoreFromResult(result);

    const userId = deriveUserId(req, body.user ?? null);
    const displayName = sanitizeDisplayName(body.displayName);
    const atMs = Date.now();

    const existing = findExisting.get(date, userId) as { score: number } | undefined;
    const improvedToday = !existing || score > existing.score;

    if (improvedToday || !existing) {
      insertOrReplace.run(
        date,
        userId,
        displayName,
        body.player.hero,
        body.player.ability,
        result.outcome,
        result.ticks,
        result.remainingHpA,
        score,
        atMs
      );
    }

    const persistedScore = improvedToday ? score : (existing?.score ?? score);
    const rankRow = rankQuery.get(date, persistedScore) as { rank: number };
    const totalRow = totalQuery.get(date) as { total: number };

    return {
      v: 1,
      ok: true,
      outcome: result.outcome,
      ticks: result.ticks,
      remainingHpA: result.remainingHpA,
      remainingHpB: result.remainingHpB,
      score,
      rank: rankRow.rank,
      totalPlayers: totalRow.total,
      improvedToday
    };
  });
}
