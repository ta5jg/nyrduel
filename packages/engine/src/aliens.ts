/* =============================================================================
 * File:           packages/engine/src/aliens.ts
 * Author:         USDTG GROUP TECHNOLOGY LLC
 * Developer:      Irfan Gedik
 * Created Date:   2026-05-04
 * Last Update:    2026-05-04
 * Version:        0.2.0
 *
 * Description:
 *   Alien antagonist catalog — twelve boss-class creatures that rotate as
 *   the daily opponent. Stats are balanced in roughly the same envelope as
 *   the player hero set so a well-built loadout can win, but each boss has
 *   a distinct flavour and threat profile.
 *
 *   Combat is human-versus-alien only. Aliens are the sole antagonist class
 *   in Nyrduel — there is no human-versus-human mode.
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
    id: "skitterqueen",
    name: "Skitterqueen",
    blurb: "Crystal-thoraxed swarmer matriarch. Strikes fast, breaks easily.",
    hp: 22,
    atk: 9,
    def: 1,
    spd: 13,
    critPct: 12,
    critMulPct: 160
  },
  {
    id: "voidking",
    name: "Voidking",
    blurb: "Tendril-crowned caster. Hurls singularities at range.",
    hp: 26,
    atk: 11,
    def: 1,
    spd: 10,
    critPct: 8,
    critMulPct: 175
  },
  {
    id: "hivelord",
    name: "Hivelord",
    blurb: "Eight-limbed scything chitin colossus. Slow and unrelenting.",
    hp: 38,
    atk: 8,
    def: 3,
    spd: 9,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "glyphtitan",
    name: "Glyphtitan",
    blurb: "Six-trunked stone-mass with shifting glyphs. Earth-shaking presence.",
    hp: 50,
    atk: 7,
    def: 4,
    spd: 7,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "riftherald",
    name: "Riftherald",
    blurb: "Folded-space figure haloed in starlight. Phases between strikes.",
    hp: 24,
    atk: 9,
    def: 2,
    spd: 12,
    critPct: 15,
    critMulPct: 165
  },
  {
    id: "crystallarch",
    name: "Crystallarch",
    blurb: "Prism-bodied obelisk-being. Reflects damage; hard to crack.",
    hp: 32,
    atk: 7,
    def: 4,
    spd: 10,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "nullmaw",
    name: "Nullmaw",
    blurb: "Twelve-petaled circular maw. One bite carries planet-weight.",
    hp: 28,
    atk: 12,
    def: 1,
    spd: 9,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "stormwalker",
    name: "Stormwalker",
    blurb: "Lightning-cored alien on crystal stilts. Faster than thought.",
    hp: 18,
    atk: 8,
    def: 1,
    spd: 16,
    critPct: 5,
    critMulPct: 160
  },
  {
    id: "mistshaper",
    name: "Mistshaper",
    blurb: "Vapor-bodied haunter. Hard to hit, harder to harm.",
    hp: 26,
    atk: 6,
    def: 5,
    spd: 11,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "echobreed",
    name: "Echobreed",
    blurb: "Three-shadow phaser. Each strike rings through dimensions.",
    hp: 28,
    atk: 9,
    def: 2,
    spd: 11,
    critPct: 8,
    critMulPct: 160
  },
  {
    id: "tidegrasp",
    name: "Tidegrasp",
    blurb: "Tendril-fan drifter. Slow but devastating reach.",
    hp: 36,
    atk: 10,
    def: 2,
    spd: 8,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "worldscar",
    name: "Worldscar",
    blurb: "Mountain-sized ancient. Five tower-eyes; slow as continents.",
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

/** Resolve an alien boss id into a battle-engine Unit. */
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
