import { describe, expect, it } from "vitest";
import { runBattle } from "./battle.js";
import { resolveUnit } from "./heroes.js";
import { computeScore, scoreFromResult } from "./score.js";

describe("computeScore", () => {
  it("rewards wins above draws above losses", () => {
    const win = computeScore({ outcome: "a", ticks: 100, remainingHpA: 20, startHpB: 30, remainingHpB: 0 });
    const draw = computeScore({ outcome: "draw", ticks: 100, remainingHpA: 0, startHpB: 30, remainingHpB: 0 });
    const loss = computeScore({ outcome: "b", ticks: 100, remainingHpA: 0, startHpB: 30, remainingHpB: 10 });
    expect(win).toBeGreaterThan(draw);
    expect(draw).toBeGreaterThan(loss);
  });

  it("rewards faster wins", () => {
    const fast = computeScore({ outcome: "a", ticks: 50, remainingHpA: 10, startHpB: 30, remainingHpB: 0 });
    const slow = computeScore({ outcome: "a", ticks: 500, remainingHpA: 10, startHpB: 30, remainingHpB: 0 });
    expect(fast).toBeGreaterThan(slow);
  });

  it("rewards higher remaining HP on a win", () => {
    const high = computeScore({ outcome: "a", ticks: 100, remainingHpA: 30, startHpB: 30, remainingHpB: 0 });
    const low = computeScore({ outcome: "a", ticks: 100, remainingHpA: 1, startHpB: 30, remainingHpB: 0 });
    expect(high).toBeGreaterThan(low);
  });

  it("rewards damage dealt on a loss", () => {
    const big = computeScore({ outcome: "b", ticks: 200, remainingHpA: 0, startHpB: 30, remainingHpB: 1 });
    const tiny = computeScore({ outcome: "b", ticks: 200, remainingHpA: 0, startHpB: 30, remainingHpB: 28 });
    expect(big).toBeGreaterThan(tiny);
  });

  it("never goes negative", () => {
    expect(computeScore({ outcome: "b", ticks: 5000, remainingHpA: 0, startHpB: 100, remainingHpB: 100 }))
      .toBeGreaterThanOrEqual(0);
  });

  it("scoreFromResult composes correctly", () => {
    const a = resolveUnit("archer", "warmachine");
    const b = resolveUnit("mage", "warmachine");
    const r = runBattle({ seed: "score-compose", a, b });
    const direct = computeScore({
      outcome: r.outcome,
      ticks: r.ticks,
      remainingHpA: r.remainingHpA,
      startHpB: r.startHpB,
      remainingHpB: r.remainingHpB
    });
    expect(scoreFromResult(r)).toBe(direct);
  });
});
