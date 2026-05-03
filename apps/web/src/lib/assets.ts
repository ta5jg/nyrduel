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

/**
 * Natural facing direction of each hero in the source PNG. Hand-tagged
 * because the art comes from generative tools (DALL-E etc.) and each
 * character lands with its own orientation. The arena uses this to decide
 * whether to flip the sprite so both fighters face each other.
 *
 * - "right"  → the character looks toward the viewer's right
 * - "left"   → the character looks toward the viewer's left
 * - "center" → the character looks at the camera; never mirrored
 *
 * Convention in arena layout: player is on the left, foe is on the right.
 * The arena flips a sprite when its natural facing is *away* from the
 * opponent's slot.
 */
export type Facing = "left" | "right" | "center";

export const HERO_FACING: Record<HeroId, Facing> = {
  soldier: "left",
  brute: "left",
  archer: "right",
  rogue: "left",
  mage: "left",
  paladin: "center"
};

/** Returns true if the sprite should be CSS-mirrored to face inward. */
export function shouldMirrorHero(heroId: HeroId, side: "a" | "b"): boolean {
  const facing = HERO_FACING[heroId];
  if (facing === "center") return false;
  const want = side === "a" ? "right" : "left";
  return facing !== want;
}

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
