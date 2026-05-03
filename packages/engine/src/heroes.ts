/* =============================================================================
 * Hero + ability catalog — canonical, server-authoritative.
 *
 * Both web and gateway resolve hero/ability by id through these tables. The
 * engine never trusts external stat blocks: the client posts ids, the server
 * looks up the stats here and re-runs the battle for scoring.
 * ============================================================================= */

import {
  ABILITY_IDS,
  HERO_IDS,
  type AbilityDef,
  type AbilityId,
  type HeroDef,
  type HeroId
} from "@nyrduel/protocol";

export const HEROES: readonly HeroDef[] = [
  {
    id: "soldier",
    name: "Soldier",
    blurb: "Balanced frontline. Reliable, no surprises.",
    hp: 30,
    atk: 8,
    def: 2,
    spd: 10,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "brute",
    name: "Brute",
    blurb: "Heavy bruiser. Hits late, lasts long.",
    hp: 42,
    atk: 7,
    def: 3,
    spd: 8,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "archer",
    name: "Archer",
    blurb: "Fast crit-leaning sniper. Glassy.",
    hp: 18,
    atk: 10,
    def: 1,
    spd: 12,
    critPct: 8,
    critMulPct: 175
  },
  {
    id: "rogue",
    name: "Rogue",
    blurb: "Glass cannon with vicious crits.",
    hp: 20,
    atk: 9,
    def: 1,
    spd: 14,
    critPct: 18,
    critMulPct: 165
  },
  {
    id: "mage",
    name: "Mage",
    blurb: "Hard hitter. One mistake away from dust.",
    hp: 16,
    atk: 11,
    def: 0,
    spd: 11,
    critPct: 0,
    critMulPct: 150
  },
  {
    id: "paladin",
    name: "Paladin",
    blurb: "Self-anchored. Even tempo, hard to break.",
    hp: 34,
    atk: 8,
    def: 3,
    spd: 10,
    critPct: 0,
    critMulPct: 150
  }
];

export const ABILITIES: readonly AbilityDef[] = [
  {
    id: "warmachine",
    name: "War Machine",
    blurb: "+ATK. Faster clears, glassier defense.",
    bonus: { atkFlat: 2 }
  },
  {
    id: "bulwark",
    name: "Bulwark",
    blurb: "+HP +DEF. Soak hits, win the long game.",
    bonus: { hpFlat: 4, defFlat: 1 }
  },
  {
    id: "tempo",
    name: "Tempo",
    blurb: "+SPD. Act more often than your foe.",
    bonus: { spdFlat: 3 }
  },
  {
    id: "heartsteel",
    name: "Heartsteel",
    blurb: "+HP. The brute-force survivor.",
    bonus: { hpFlat: 8 }
  }
];

const HERO_BY_ID = new Map<HeroId, HeroDef>(HEROES.map((h) => [h.id, h]));
const ABILITY_BY_ID = new Map<AbilityId, AbilityDef>(ABILITIES.map((a) => [a.id, a]));

export function isHeroId(value: string): value is HeroId {
  return (HERO_IDS as readonly string[]).includes(value);
}

export function isAbilityId(value: string): value is AbilityId {
  return (ABILITY_IDS as readonly string[]).includes(value);
}

export function getHero(id: HeroId): HeroDef {
  const h = HERO_BY_ID.get(id);
  if (!h) throw new Error(`unknown hero id: ${id}`);
  return h;
}

export function getAbility(id: AbilityId): AbilityDef {
  const a = ABILITY_BY_ID.get(id);
  if (!a) throw new Error(`unknown ability id: ${id}`);
  return a;
}

/** Resolve hero+ability ids into a concrete unit stat block. */
export function resolveUnit(heroId: HeroId, abilityId: AbilityId): Unit {
  const hero = getHero(heroId);
  const ab = getAbility(abilityId);
  return {
    hp: Math.max(1, hero.hp + (ab.bonus.hpFlat ?? 0)),
    atk: Math.max(0, hero.atk + (ab.bonus.atkFlat ?? 0)),
    def: Math.max(0, hero.def + (ab.bonus.defFlat ?? 0)),
    spd: Math.max(1, hero.spd + (ab.bonus.spdFlat ?? 0)),
    critPct: hero.critPct,
    critMulPct: hero.critMulPct
  };
}

export type Unit = {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  critPct: number;
  critMulPct: number;
};
