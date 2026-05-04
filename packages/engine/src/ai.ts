/* =============================================================================
 * File:           packages/engine/src/ai.ts
 * Author:         USDTG GROUP TECHNOLOGY LLC
 * Developer:      Irfan Gedik
 * Created Date:   2026-05-03
 * Last Update:    2026-05-04
 * Version:        0.2.0
 *
 * Description:
 *   Daily opponent picker — deterministic from the seed.
 *
 *   v0.2: opponent is now one of twelve alien bosses (no human heroes as
 *   antagonists). Same seed → same boss; every player worldwide faces the
 *   same alien on a given UTC day.
 *
 * License:
 *   Proprietary. All rights reserved. See LICENSE in the repository root.
 * ============================================================================= */

import { ALIEN_BOSS_IDS, type AlienBossId } from "@nyrduel/protocol";
import { makeRng } from "./rng.js";

/** Pick today's alien boss deterministically from the daily seed. */
export function pickAi(seed: string): { alienBossId: AlienBossId } {
  const rng = makeRng(seed, "ai");
  const bossId = ALIEN_BOSS_IDS[rng.int(ALIEN_BOSS_IDS.length)];
  if (!bossId) throw new Error("alien boss roster empty");
  return { alienBossId: bossId };
}
