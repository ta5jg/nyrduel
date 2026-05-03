import type { FastifyInstance } from "fastify";
import { todayUtcDate } from "@nyrduel/engine";
import type { DuelStreakResponse } from "@nyrduel/protocol";
import type { Db } from "../db.js";

export type DuelStreakDeps = {
  db: Db;
};

export function registerDuelStreak(app: FastifyInstance, deps: DuelStreakDeps): void {
  const datesQuery = deps.db.prepare(
    `SELECT DISTINCT date FROM submissions WHERE user = ? ORDER BY date DESC`
  );

  app.get<{ Params: { user: string } }>(
    "/duel/streak/:user",
    async (req): Promise<DuelStreakResponse> => {
      const userId = req.params.user;
      const dates = (datesQuery.all(userId) as { date: string }[]).map((r) => r.date);

      const today = todayUtcDate();
      let current = 0;
      const cursor = new Date(`${today}T00:00:00Z`);
      let started = false;
      const set = new Set(dates);
      for (let i = 0; i < dates.length + 2; i++) {
        const d = cursor.toISOString().slice(0, 10);
        if (set.has(d)) {
          current++;
          started = true;
        } else {
          if (started) break;
          if (i > 0) break;
        }
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }

      let longest = 0;
      let run = 0;
      let prev: string | null = null;
      for (const d of [...dates].reverse()) {
        if (prev === null) {
          run = 1;
        } else {
          const prevDate = new Date(`${prev}T00:00:00Z`);
          prevDate.setUTCDate(prevDate.getUTCDate() + 1);
          const next = prevDate.toISOString().slice(0, 10);
          run = next === d ? run + 1 : 1;
        }
        if (run > longest) longest = run;
        prev = d;
      }

      return {
        v: 1,
        ok: true,
        user: userId,
        current,
        longest,
        daysPlayed: dates.length
      };
    }
  );
}
