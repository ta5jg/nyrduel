import { describe, expect, it } from "vitest";
import { ABILITY_IDS, HERO_IDS } from "@nyrduel/protocol";
import { pickAi } from "./ai.js";

describe("pickAi", () => {
  it("is deterministic for the same seed", () => {
    expect(pickAi("nyrduel:2026-05-03")).toEqual(pickAi("nyrduel:2026-05-03"));
  });

  it("returns valid ids", () => {
    for (let i = 0; i < 50; i++) {
      const r = pickAi(`s:${i}`);
      expect(HERO_IDS).toContain(r.hero);
      expect(ABILITY_IDS).toContain(r.ability);
    }
  });

  it("covers the pool over many seeds", () => {
    const heroes = new Set<string>();
    const abilities = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const r = pickAi(`pool:${i}`);
      heroes.add(r.hero);
      abilities.add(r.ability);
    }
    expect(heroes.size).toBe(HERO_IDS.length);
    expect(abilities.size).toBe(ABILITY_IDS.length);
  });
});
