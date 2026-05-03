/* =============================================================================
 * Score formula.
 *
 * Win:   1000 + remainingHp + clamp(300 - ticks/2, 0..300)
 * Draw:  400
 * Loss:  100 + clamp(damageDealt/2, 0..100)
 *
 * Loser still gets a partial-credit floor — keeps engagement up on hard days.
 * Bounds: max ~ 1000 + 50 + 300 = 1350. The protocol caps at 1_000_000 (paranoia).
 * ============================================================================= */

import type { BattleResult } from "./battle.js";

export type ScoreInput = {
  outcome: BattleResult["outcome"];
  ticks: number;
  remainingHpA: number;
  startHpB: number;
  remainingHpB: number;
};

export function computeScore(input: ScoreInput): number {
  const { outcome, ticks, remainingHpA, startHpB, remainingHpB } = input;
  if (outcome === "a") {
    const speedBonus = Math.max(0, Math.min(300, 300 - Math.floor(ticks / 2)));
    return 1000 + Math.max(0, Math.floor(remainingHpA)) + speedBonus;
  }
  if (outcome === "draw") return 400;
  // loss: scaled damage dealt
  const dmgDealt = Math.max(0, startHpB - remainingHpB);
  return 100 + Math.min(100, Math.floor(dmgDealt / 2));
}

export function scoreFromResult(r: BattleResult): number {
  return computeScore({
    outcome: r.outcome,
    ticks: r.ticks,
    remainingHpA: r.remainingHpA,
    startHpB: r.startHpB,
    remainingHpB: r.remainingHpB
  });
}
