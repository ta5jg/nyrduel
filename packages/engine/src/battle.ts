/* =============================================================================
 * Battle simulator — deterministic 1v1.
 *
 * Initiative model: each tick, both units gain SPD initiative. When initiative
 * reaches 100, the unit acts and pays 100. Two units may act on the same tick;
 * the higher current initiative goes first (ties → A).
 *
 * Damage = max(1, atk + jitter[-1..1] - def). Crit roll multiplies by
 * critMulPct/100 (floored, min 1). No misses in v1 — kept as an event-shape
 * concession for future ability work.
 *
 * Time-out: if both units are alive after maxTicks, higher remaining HP wins;
 * equal HP is a draw.
 * ============================================================================= */

import { makeRng, type Rng } from "./rng.js";
import type { Unit } from "./heroes.js";

export type BattleEvent =
  | {
      tick: number;
      type: "act";
      by: "a" | "b";
      hit: boolean;
      crit: boolean;
      damage: number;
      hpA: number;
      hpB: number;
    }
  | {
      tick: number;
      type: "end";
      outcome: "a" | "b" | "draw";
      hpA: number;
      hpB: number;
    };

export type BattleResult = {
  outcome: "a" | "b" | "draw";
  ticks: number;
  events: BattleEvent[];
  remainingHpA: number;
  remainingHpB: number;
  startHpA: number;
  startHpB: number;
};

export type BattleOptions = {
  seed: string;
  a: Unit;
  b: Unit;
  /** Hard cap on simulation ticks. Default 4000. */
  maxTicks?: number;
};

const DEFAULT_MAX_TICKS = 4000;

export function runBattle(opts: BattleOptions): BattleResult {
  const maxTicks = opts.maxTicks ?? DEFAULT_MAX_TICKS;
  const rng = makeRng(opts.seed, "battle");
  const { a, b } = opts;
  const startHpA = a.hp;
  const startHpB = b.hp;

  let hpA = a.hp;
  let hpB = b.hp;
  let initA = 0;
  let initB = 0;
  const events: BattleEvent[] = [];

  function pickActor(): "a" | "b" {
    if (initA >= 100 && initB >= 100) {
      if (initA > initB) return "a";
      if (initB > initA) return "b";
      // True tie — coin flip from the seeded rng. Without this, A wins every
      // mirror match because deterministic tie-breaking biases first-mover.
      return rng.chance(50) ? "a" : "b";
    }
    return initA >= 100 ? "a" : "b";
  }

  function act(by: "a" | "b", tick: number): void {
    const att = by === "a" ? a : b;
    const dfn = by === "a" ? b : a;
    const jitter = rng.range(-1, 1);
    const baseDmg = Math.max(1, att.atk + jitter - dfn.def);
    const crit = rng.chance(att.critPct);
    const damage = crit ? Math.max(1, Math.floor((baseDmg * att.critMulPct) / 100)) : baseDmg;
    if (by === "a") hpB = Math.max(0, hpB - damage);
    else hpA = Math.max(0, hpA - damage);
    events.push({ tick, type: "act", by, hit: true, crit, damage, hpA, hpB });
  }

  for (let tick = 1; tick <= maxTicks; tick++) {
    initA += a.spd;
    initB += b.spd;

    while (initA >= 100 || initB >= 100) {
      const actor = pickActor();
      act(actor, tick);
      if (actor === "a") initA -= 100;
      else initB -= 100;

      if (hpA <= 0 || hpB <= 0) {
        const outcome: "a" | "b" | "draw" =
          hpA <= 0 && hpB <= 0 ? "draw" : hpA <= 0 ? "b" : "a";
        events.push({ tick, type: "end", outcome, hpA, hpB });
        return {
          outcome,
          ticks: tick,
          events,
          remainingHpA: hpA,
          remainingHpB: hpB,
          startHpA,
          startHpB
        };
      }
    }
  }

  // Time-out — judge by remaining HP.
  const outcome: "a" | "b" | "draw" = hpA > hpB ? "a" : hpB > hpA ? "b" : "draw";
  events.push({ tick: maxTicks, type: "end", outcome, hpA, hpB });
  return {
    outcome,
    ticks: maxTicks,
    events,
    remainingHpA: hpA,
    remainingHpB: hpB,
    startHpA,
    startHpB
  };
}

/** Convenience for the common (rng, seed) split — exported for tests. */
export function _internal_makeBattleRng(seed: string): Rng {
  return makeRng(seed, "battle");
}
