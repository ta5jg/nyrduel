/* =============================================================================
 * Daily AI picker — deterministic from the seed.
 *
 * Identical seed → identical opponent. The gateway derives the AI here on
 * /duel/today, the client renders it, and on /duel/submit the gateway
 * re-derives it (instead of trusting the client) to compose the matchup.
 * ============================================================================= */

import { ABILITY_IDS, HERO_IDS, type AbilityId, type HeroId } from "@nyrduel/protocol";
import { makeRng } from "./rng.js";

export function pickAi(seed: string): { hero: HeroId; ability: AbilityId } {
  const rng = makeRng(seed, "ai");
  const hero = HERO_IDS[rng.int(HERO_IDS.length)];
  const ability = ABILITY_IDS[rng.int(ABILITY_IDS.length)];
  if (!hero || !ability) throw new Error("ai pool empty");
  return { hero, ability };
}
