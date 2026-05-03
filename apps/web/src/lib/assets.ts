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
  soldier: "/heroes/soldier.png",
  brute: "/heroes/brute.png",
  archer: "/heroes/archer.png",
  rogue: "/heroes/rogue.png",
  mage: "/heroes/mage.png",
  paladin: "/heroes/paladin.png"
};

export const ARENAS = [
  "/arenas/forest.jpg",
  "/arenas/peaks.jpg",
  "/arenas/grove.jpg",
  "/arenas/storm.jpg",
  "/arenas/colosseum.jpg"
] as const;

export const ARENA_NAMES: Record<string, string> = {
  "/arenas/forest.jpg": "Sunlit Glade",
  "/arenas/peaks.jpg": "Twilight Peaks",
  "/arenas/grove.jpg": "Moonlit Grove",
  "/arenas/storm.jpg": "Storm Coast",
  "/arenas/colosseum.jpg": "Old Colosseum"
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
