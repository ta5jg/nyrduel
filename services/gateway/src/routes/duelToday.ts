import type { FastifyInstance } from "fastify";
import { endOfDayUtc, pickAi, todaySeed, todayUtcDate } from "@nyrduel/engine";
import type { DuelTodayResponse } from "@nyrduel/protocol";

export type DuelTodayDeps = {
  prizePoolUsdtg: number;
};

export function registerDuelToday(app: FastifyInstance, deps: DuelTodayDeps): void {
  app.get("/duel/today", async (): Promise<DuelTodayResponse> => {
    const date = todayUtcDate();
    const seed = todaySeed();
    const opponent = pickAi(seed);
    return {
      v: 1,
      ok: true,
      date,
      seed,
      endsAtUtc: endOfDayUtc(date),
      opponent,
      prizePoolUsdtg: deps.prizePoolUsdtg
    };
  });
}
