/* =============================================================================
 * Static asset map — kept out of @nyrduel/engine on purpose (the engine is
 * pure logic; pixels live in the web app). When real art ships, swap the URLs
 * here without touching engine or protocol.
 *
 * SVG placeholders are intentionally silhouettes so the artwork upgrade is
 * obvious; whatever you drop in /public/heroes/{id}.{svg,png,webp} will
 * replace them. Do not bake hero metadata (stats) here — that's engine's job.
 * ============================================================================= */

import type { HeroId } from "@nyrduel/protocol";

export const HERO_ART: Record<HeroId, string> = {
  soldier: "/heroes/soldier.svg",
  brute: "/heroes/brute.svg",
  archer: "/heroes/archer.svg",
  rogue: "/heroes/rogue.svg",
  mage: "/heroes/mage.svg",
  paladin: "/heroes/paladin.svg"
};

export const ARENAS = [
  "/arenas/forest.svg",
  "/arenas/peaks.svg",
  "/arenas/grove.svg",
  "/arenas/storm.svg",
  "/arenas/colosseum.svg"
] as const;

export const ARENA_NAMES: Record<string, string> = {
  "/arenas/forest.svg": "Sunlit Glade",
  "/arenas/peaks.svg": "Twilight Peaks",
  "/arenas/grove.svg": "Moonlit Grove",
  "/arenas/storm.svg": "Storm Coast",
  "/arenas/colosseum.svg": "Old Colosseum"
};

/** Pick today's arena from the seed so the world sees the same backdrop. */
export function arenaForSeed(seed: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = (h >>> 0) % ARENAS.length;
  return ARENAS[idx]!;
}
