import { describe, expect, it } from "vitest";
import { runBattle } from "./battle.js";
import { resolveUnit } from "./heroes.js";

describe("runBattle", () => {
  it("is deterministic for the same seed and units", () => {
    const a = resolveUnit("soldier", "warmachine");
    const b = resolveUnit("brute", "bulwark");
    const r1 = runBattle({ seed: "test:1", a, b });
    const r2 = runBattle({ seed: "test:1", a, b });
    expect(r1.outcome).toBe(r2.outcome);
    expect(r1.ticks).toBe(r2.ticks);
    expect(r1.remainingHpA).toBe(r2.remainingHpA);
    expect(r1.remainingHpB).toBe(r2.remainingHpB);
    expect(r1.events.length).toBe(r2.events.length);
  });

  it("differs for different seeds (most of the time)", () => {
    // Drawn-out matchup with lots of jitter rolls — variance must show.
    const a = resolveUnit("brute", "warmachine");
    const b = resolveUnit("paladin", "bulwark");
    const seeds = Array.from({ length: 50 }, (_, i) => `vary:${i}`);
    const results = seeds.map((s) => runBattle({ seed: s, a, b }));
    const unique = new Set(results.map((r) => `${r.outcome}:${r.ticks}:${r.remainingHpA}`));
    expect(unique.size).toBeGreaterThanOrEqual(3);
  });

  it("ends with a terminal end event", () => {
    const a = resolveUnit("mage", "warmachine");
    const b = resolveUnit("soldier", "heartsteel");
    const r = runBattle({ seed: "term", a, b });
    const last = r.events[r.events.length - 1];
    expect(last?.type).toBe("end");
  });

  it("resolves before maxTicks for typical matchups", () => {
    const a = resolveUnit("archer", "warmachine");
    const b = resolveUnit("mage", "tempo");
    const r = runBattle({ seed: "fast", a, b, maxTicks: 1000 });
    expect(r.ticks).toBeLessThan(1000);
  });

  it("respects maxTicks (forces draw or HP-based win)", () => {
    const a = resolveUnit("paladin", "bulwark");
    const b = resolveUnit("paladin", "bulwark");
    const r = runBattle({ seed: "tank-mirror", a, b, maxTicks: 5 });
    expect(r.ticks).toBe(5);
    expect(["a", "b", "draw"]).toContain(r.outcome);
  });

  it("never produces negative HP in events", () => {
    const a = resolveUnit("rogue", "warmachine");
    const b = resolveUnit("mage", "warmachine");
    const r = runBattle({ seed: "never-neg", a, b });
    for (const ev of r.events) {
      expect(ev.hpA).toBeGreaterThanOrEqual(0);
      expect(ev.hpB).toBeGreaterThanOrEqual(0);
    }
  });

  it("damage is at least 1 (no zero-damage hits)", () => {
    const a = resolveUnit("brute", "warmachine");
    const b = resolveUnit("paladin", "bulwark");
    const r = runBattle({ seed: "min-dmg", a, b });
    for (const ev of r.events) {
      if (ev.type === "act") expect(ev.damage).toBeGreaterThanOrEqual(1);
    }
  });

  it("rough fairness: a hero never loses 0% across many seeds", () => {
    // Mirror match → outcomes split, no single side dominates.
    const u = resolveUnit("soldier", "warmachine");
    let aWins = 0;
    let bWins = 0;
    for (let i = 0; i < 200; i++) {
      const r = runBattle({ seed: `fair:${i}`, a: u, b: u });
      if (r.outcome === "a") aWins++;
      else if (r.outcome === "b") bWins++;
    }
    expect(aWins).toBeGreaterThan(20);
    expect(bWins).toBeGreaterThan(20);
  });
});
