import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { todayUtcDate } from "@nyrduel/engine";
import type {
  DuelLeaderboardEntry,
  DuelLeaderboardResponse
} from "@nyrduel/protocol";
import type { Db, SubmissionRow } from "../db.js";

const Query = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  user: z.string().min(1).max(64).optional()
});

export type DuelLeaderboardDeps = {
  db: Db;
};

export function registerDuelLeaderboard(app: FastifyInstance, deps: DuelLeaderboardDeps): void {
  const topQuery = deps.db.prepare(`
    SELECT id, date, user, display_name, hero, ability, outcome, ticks, remaining_hp, score, at_ms
    FROM submissions
    WHERE date = ?
    ORDER BY score DESC, at_ms ASC
    LIMIT ?
  `);

  const youQuery = deps.db.prepare(`
    SELECT id, date, user, display_name, hero, ability, outcome, ticks, remaining_hp, score, at_ms
    FROM submissions
    WHERE date = ? AND user = ?
  `);

  const rankQuery = deps.db.prepare(
    `SELECT 1 + COUNT(*) AS rank FROM submissions WHERE date = ? AND score > ?`
  );

  const totalQuery = deps.db.prepare(
    `SELECT COUNT(*) AS total FROM submissions WHERE date = ?`
  );

  app.get("/duel/leaderboard", async (req, reply): Promise<DuelLeaderboardResponse | { v: 1; ok: false; error: string }> => {
    const parsed = Query.safeParse(req.query);
    if (!parsed.success) {
      reply.code(400);
      return { v: 1, ok: false, error: "BAD_REQUEST" };
    }
    const date = parsed.data.date ?? todayUtcDate();
    const limit = parsed.data.limit;

    const rows = topQuery.all(date, limit) as SubmissionRow[];
    const top: DuelLeaderboardEntry[] = rows.map((r, i) => ({
      rank: i + 1,
      user: r.user,
      displayName: r.display_name,
      hero: r.hero as DuelLeaderboardEntry["hero"],
      ability: r.ability as DuelLeaderboardEntry["ability"],
      outcome: r.outcome,
      ticks: r.ticks,
      score: r.score,
      atMs: r.at_ms
    }));

    const totalRow = totalQuery.get(date) as { total: number };

    let yours: DuelLeaderboardEntry | null = null;
    if (parsed.data.user) {
      const youRow = youQuery.get(date, parsed.data.user) as SubmissionRow | undefined;
      if (youRow) {
        const rankRow = rankQuery.get(date, youRow.score) as { rank: number };
        yours = {
          rank: rankRow.rank,
          user: youRow.user,
          displayName: youRow.display_name,
          hero: youRow.hero as DuelLeaderboardEntry["hero"],
          ability: youRow.ability as DuelLeaderboardEntry["ability"],
          outcome: youRow.outcome,
          ticks: youRow.ticks,
          score: youRow.score,
          atMs: youRow.at_ms
        };
      }
    }

    return {
      v: 1,
      ok: true,
      date,
      top,
      total: totalRow.total,
      yours
    };
  });
}
