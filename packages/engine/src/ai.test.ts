/* =============================================================================
 * File:           packages/engine/src/ai.test.ts
 * Author:         USDTG GROUP TECHNOLOGY LLC
 * Developer:      Irfan Gedik
 * Created Date:   2026-05-03
 * Last Update:    2026-05-04
 * Version:        0.2.0
 * ============================================================================= */

import { describe, expect, it } from "vitest";
import { ALIEN_BOSS_IDS } from "@nyrduel/protocol";
import { pickAi } from "./ai.js";

describe("pickAi (alien boss roster)", () => {
  it("is deterministic for the same seed", () => {
    expect(pickAi("nyrduel:2026-05-03")).toEqual(pickAi("nyrduel:2026-05-03"));
  });

  it("returns a valid alien boss id", () => {
    for (let i = 0; i < 50; i++) {
      const r = pickAi(`s:${i}`);
      expect(ALIEN_BOSS_IDS).toContain(r.alienBossId);
    }
  });

  it("covers the full roster over many seeds", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      seen.add(pickAi(`pool:${i}`).alienBossId);
    }
    expect(seen.size).toBe(ALIEN_BOSS_IDS.length);
  });
});
