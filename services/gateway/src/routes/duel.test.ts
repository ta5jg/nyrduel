/* =============================================================================
 * Integration tests — boot the gateway against an in-memory SQLite db and
 * exercise the duel routes via Fastify's `inject`.
 * ============================================================================= */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Fastify, { type FastifyInstance } from "fastify";
import { todaySeed, todayUtcDate } from "@nyrduel/engine";
import type { DuelLeaderboardResponse, DuelSubmitResponse, DuelTodayResponse } from "@nyrduel/protocol";
import { openDb, type Db } from "../db.js";
import { registerDuelToday } from "./duelToday.js";
import { registerDuelSubmit } from "./duelSubmit.js";
import { registerDuelLeaderboard } from "./duelLeaderboard.js";
import { registerDuelStreak } from "./duelStreak.js";

let app: FastifyInstance;
let db: Db;

beforeEach(async () => {
  db = openDb(":memory:");
  app = Fastify({ logger: false });
  registerDuelToday(app, { prizePoolUsdtg: 100 });
  registerDuelSubmit(app, { db });
  registerDuelLeaderboard(app, { db });
  registerDuelStreak(app, { db });
  await app.ready();
});

afterEach(async () => {
  await app.close();
  db.close();
});

describe("GET /duel/today", () => {
  it("returns today's seed and AI matchup", async () => {
    const res = await app.inject({ method: "GET", url: "/duel/today" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as DuelTodayResponse;
    expect(body.ok).toBe(true);
    expect(body.seed).toBe(todaySeed());
    expect(body.date).toBe(todayUtcDate());
    expect(body.opponent.alienBossId).toBeTypeOf("string");
    expect(body.prizePoolUsdtg).toBe(100);
  });
});

describe("POST /duel/submit", () => {
  it("accepts a valid submission and returns server-computed score", async () => {
    const seed = todaySeed();
    const res = await app.inject({
      method: "POST",
      url: "/duel/submit",
      payload: {
        v: 1,
        seed,
        player: { hero: "soldier", ability: "warmachine" },
        user: "test-user-1",
        displayName: "Tester"
      }
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as DuelSubmitResponse;
    if (!body.ok) throw new Error(`expected ok: ${JSON.stringify(body)}`);
    expect(body.score).toBeGreaterThan(0);
    expect(body.rank).toBe(1);
    expect(body.totalPlayers).toBe(1);
    expect(body.improvedToday).toBe(true);
  });

  it("rejects malformed body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/duel/submit",
      payload: { v: 1, seed: todaySeed(), player: { hero: "wizardking", ability: "warmachine" } }
    });
    expect(res.statusCode).toBe(400);
  });

  it("rejects wrong-format seed", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/duel/submit",
      payload: { v: 1, seed: "wrong:seed", player: { hero: "soldier", ability: "warmachine" } }
    });
    expect(res.statusCode).toBe(400);
  });

  it("only replaces a user's row when score improves", async () => {
    const seed = todaySeed();
    const submit = (hero: string, ability: string) =>
      app.inject({
        method: "POST",
        url: "/duel/submit",
        payload: { v: 1, seed, player: { hero, ability }, user: "userX" }
      });

    const r1 = await submit("rogue", "warmachine");
    const r2 = await submit("brute", "bulwark");
    const b1 = r1.json() as DuelSubmitResponse;
    const b2 = r2.json() as DuelSubmitResponse;
    if (!b1.ok || !b2.ok) throw new Error("expected both ok");
    const bestScore = Math.max(b1.score, b2.score);

    const lb = await app.inject({ method: "GET", url: "/duel/leaderboard?user=userX" });
    const lbBody = lb.json() as DuelLeaderboardResponse;
    expect(lbBody.yours?.score).toBe(bestScore);
  });

  it("ranks two users correctly", async () => {
    const seed = todaySeed();
    await app.inject({
      method: "POST",
      url: "/duel/submit",
      payload: { v: 1, seed, player: { hero: "rogue", ability: "warmachine" }, user: "alice" }
    });
    await app.inject({
      method: "POST",
      url: "/duel/submit",
      payload: { v: 1, seed, player: { hero: "soldier", ability: "bulwark" }, user: "bob" }
    });
    const lb = await app.inject({ method: "GET", url: "/duel/leaderboard" });
    const body = lb.json() as DuelLeaderboardResponse;
    expect(body.total).toBe(2);
    expect(body.top.length).toBe(2);
    expect(body.top[0]!.score).toBeGreaterThanOrEqual(body.top[1]!.score);
  });
});

describe("GET /duel/leaderboard", () => {
  it("is empty when nobody has played", async () => {
    const res = await app.inject({ method: "GET", url: "/duel/leaderboard" });
    const body = res.json() as DuelLeaderboardResponse;
    expect(body.top).toEqual([]);
    expect(body.total).toBe(0);
  });
});

describe("GET /duel/streak/:user", () => {
  it("reports zero streak for an unknown user", async () => {
    const res = await app.inject({ method: "GET", url: "/duel/streak/nobody" });
    const body = res.json() as { current: number; longest: number; daysPlayed: number };
    expect(body.current).toBe(0);
    expect(body.longest).toBe(0);
    expect(body.daysPlayed).toBe(0);
  });

  it("reports current streak after submission", async () => {
    const seed = todaySeed();
    await app.inject({
      method: "POST",
      url: "/duel/submit",
      payload: { v: 1, seed, player: { hero: "archer", ability: "tempo" }, user: "streaker" }
    });
    const res = await app.inject({ method: "GET", url: "/duel/streak/streaker" });
    const body = res.json() as { current: number; longest: number; daysPlayed: number };
    expect(body.current).toBeGreaterThanOrEqual(1);
    expect(body.daysPlayed).toBe(1);
  });
});
