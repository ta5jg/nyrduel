/* =============================================================================
 * File:           packages/engine/src/aliens.ts
 * Author:         USDTG GROUP TECHNOLOGY LLC
 * Developer:      Irfan Gedik
 * Created Date:   2026-05-04
 * Last Update:    2026-05-06
 * Version:        0.3.0
 *
 * Description:
 *   Alien antagonist catalog — twelve abstract entities that rotate as the
 *   daily opponent.
 *
 *   Design rule: aliens are not creatures. Each entry below is an
 *   architectural, geometric, or phenomenological entity. Names are
 *   single-word nouns from architecture / geometry / cosmology — never
 *   species labels. Combat math is unchanged; only the identity skin is
 *   non-biological so the game cannot be read as evoking Earth life.
 *
 * License:
 *   Proprietary. All rights reserved. See LICENSE in the repository root.
 * ============================================================================= */

import {
  ALIEN_BOSS_IDS,
  type AlienBossDef,
  type AlienBossId
} from "@nyrduel/protocol";
import type { Unit } from "./heroes.js";

export const ALIEN_BOSSES: readonly AlienBossDef[] = [
  {
    id: "lattice",
    name: "Lattice",
    blurb: "Self-assembling tessellation cluster. Many planes, brittle facets.",
    hp: 22,
    atk: 9,
    def: 1,
    spd: 13,
    critPct: 12,
    critMulPct: 160
  },
  {
    id: "crown",
    name: "Crown",
    blurb: "Singularity ringed by orbital arcs. Hurls collapsed mass at range.",
    hp: 26,
    atk: 11,
    def: 1,
    spd: 10,
    critPct: 8,
    critMulPct: 175
  },
  {
    id: "choir",
    name: "Choir",
    blurb: "Group of resonant monoliths. Strikes by harmonic concussion.",
    hp: 38,
    atk: 8,
    def: 3,
    spd: 9,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "citadel",
    name: "Citadel",
    blurb: "Towering geometric fortress. Earth-shaking footfall, slow advance.",
    hp: 50,
    atk: 7,
    def: 4,
    spd: 7,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "seam",
    name: "Seam",
    blurb: "Vertical tear in space. Phases between strikes, hard to read.",
    hp: 24,
    atk: 9,
    def: 2,
    spd: 12,
    critPct: 15,
    critMulPct: 165
  },
  {
    id: "vault",
    name: "Vault",
    blurb: "Sealed prismatic gem fortress. Reflects and resists.",
    hp: 32,
    atk: 7,
    def: 4,
    spd: 10,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "gate",
    name: "Gate",
    blurb: "Circular event horizon. One pulse from it carries planet-weight.",
    hp: 28,
    atk: 12,
    def: 1,
    spd: 9,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "pillar",
    name: "Pillar",
    blurb: "Rigid lightning column on stilts. Faster than it has any right to be.",
    hp: 18,
    atk: 8,
    def: 1,
    spd: 16,
    critPct: 5,
    critMulPct: 160
  },
  {
    id: "veil",
    name: "Veil",
    blurb: "Refraction cloud. Hard to hit, harder to harm.",
    hp: 26,
    atk: 6,
    def: 5,
    spd: 11,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "mark",
    name: "Mark",
    blurb: "Fractal recursion sigil. Each strike rings through dimensions.",
    hp: 28,
    atk: 9,
    def: 2,
    spd: 11,
    critPct: 8,
    critMulPct: 160
  },
  {
    id: "spoke",
    name: "Spoke",
    blurb: "Radial pulse engine. Slow rotations, devastating reach.",
    hp: 36,
    atk: 10,
    def: 2,
    spd: 8,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "continent",
    name: "Continent",
    blurb: "Planetary-scale glyph formation. Slow as continents, weighty as one.",
    hp: 55,
    atk: 6,
    def: 4,
    spd: 6,
    critPct: 0,
    critMulPct: 150
  }
];

const ALIEN_BY_ID = new Map<AlienBossId, AlienBossDef>(ALIEN_BOSSES.map((b) => [b.id, b]));

export function isAlienBossId(value: string): value is AlienBossId {
  return (ALIEN_BOSS_IDS as readonly string[]).includes(value);
}

export function getAlienBoss(id: AlienBossId): AlienBossDef {
  const a = ALIEN_BY_ID.get(id);
  if (!a) throw new Error(`unknown alien boss id: ${id}`);
  return a;
}

/** Resolve an alien entity id into a battle-engine Unit. */
export function resolveAlienUnit(id: AlienBossId): Unit {
  const b = getAlienBoss(id);
  return {
    hp: b.hp,
    atk: b.atk,
    def: b.def,
    spd: b.spd,
    critPct: b.critPct,
    critMulPct: b.critMulPct
  };
}
