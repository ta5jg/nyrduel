/* =============================================================================
 * Seeded RNG — deterministic across platforms.
 *
 * Pipeline: seed string → FNV-1a 32-bit hash → mulberry32 PRNG.
 * Both functions are well-known, integer-only, and produce identical output on
 * Node, browsers, and any V8/JSC engine — which is the whole point: the same
 * seed must yield the same battle whether the simulation runs on the gateway
 * for scoring or on the client for cinematic playback.
 * ============================================================================= */

export type Rng = {
  /** Uniform [0, 1). */
  next(): number;
  /** Integer in [0, max). max must be > 0. */
  int(max: number): number;
  /** Integer in [min, max] inclusive. */
  range(min: number, max: number): number;
  /** True with probability pct/100. pct may exceed 100 (clamped) or be 0. */
  chance(pct: number): boolean;
};

export function fnv1a32(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed: string, salt: string = ""): Rng {
  const hash = fnv1a32(salt.length > 0 ? `${seed}:${salt}` : seed);
  const next = mulberry32(hash);
  return {
    next,
    int(max) {
      return Math.floor(next() * max);
    },
    range(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    chance(pct) {
      if (pct <= 0) return false;
      if (pct >= 100) return true;
      return next() * 100 < pct;
    }
  };
}
