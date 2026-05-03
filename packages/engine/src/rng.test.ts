import { describe, expect, it } from "vitest";
import { fnv1a32, makeRng, mulberry32 } from "./rng.js";

describe("fnv1a32", () => {
  it("is deterministic", () => {
    expect(fnv1a32("nyrduel:2026-05-03")).toBe(fnv1a32("nyrduel:2026-05-03"));
  });

  it("differs for different inputs", () => {
    expect(fnv1a32("a")).not.toBe(fnv1a32("b"));
  });

  it("returns a 32-bit unsigned integer", () => {
    const h = fnv1a32("hello world");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(2 ** 32);
    expect(Number.isInteger(h)).toBe(true);
  });
});

describe("mulberry32", () => {
  it("produces the same stream for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 1000; i++) expect(a()).toBe(b());
  });

  it("produces different streams for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    let differs = false;
    for (let i = 0; i < 10; i++) if (a() !== b()) differs = true;
    expect(differs).toBe(true);
  });

  it("stays in [0, 1)", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 10000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("makeRng", () => {
  it("is reproducible across instances with the same seed", () => {
    const r1 = makeRng("nyrduel:2026-05-03", "battle");
    const r2 = makeRng("nyrduel:2026-05-03", "battle");
    for (let i = 0; i < 100; i++) {
      expect(r1.next()).toBe(r2.next());
      expect(r1.int(1000)).toBe(r2.int(1000));
      expect(r1.range(-5, 5)).toBe(r2.range(-5, 5));
      expect(r1.chance(50)).toBe(r2.chance(50));
    }
  });

  it("different salts diverge from the same seed", () => {
    const a = makeRng("seed", "battle");
    const b = makeRng("seed", "ai");
    let diff = false;
    for (let i = 0; i < 10; i++) if (a.next() !== b.next()) diff = true;
    expect(diff).toBe(true);
  });

  it("chance(0) is always false; chance(100) is always true", () => {
    const r = makeRng("x");
    for (let i = 0; i < 100; i++) {
      expect(r.chance(0)).toBe(false);
      expect(r.chance(100)).toBe(true);
    }
  });

  it("int(n) stays in [0, n)", () => {
    const r = makeRng("y");
    for (let i = 0; i < 10000; i++) {
      const v = r.int(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("range(min, max) stays in bounds inclusive", () => {
    const r = makeRng("z");
    for (let i = 0; i < 10000; i++) {
      const v = r.range(-3, 3);
      expect(v).toBeGreaterThanOrEqual(-3);
      expect(v).toBeLessThanOrEqual(3);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});
