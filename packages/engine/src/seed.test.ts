import { describe, expect, it } from "vitest";
import { buildSeed, endOfDayUtc, msUntilEndOfDayUtc, seedDate, todaySeed, todayUtcDate } from "./seed.js";

describe("seed helpers", () => {
  it("formats today as YYYY-MM-DD UTC", () => {
    const d = new Date(Date.UTC(2026, 4, 3, 18, 30));
    expect(todayUtcDate(d)).toBe("2026-05-03");
  });

  it("buildSeed/seedDate round-trip", () => {
    expect(seedDate(buildSeed("2026-05-03"))).toBe("2026-05-03");
  });

  it("seedDate rejects malformed input", () => {
    expect(seedDate("nyrduel:not-a-date")).toBeNull();
    expect(seedDate("notnyrduel:2026-05-03")).toBeNull();
    expect(seedDate("nyrduel:")).toBeNull();
  });

  it("todaySeed uses nyrduel: prefix", () => {
    expect(todaySeed(new Date(Date.UTC(2026, 4, 3)))).toBe("nyrduel:2026-05-03");
  });

  it("endOfDayUtc returns end-of-day Z timestamp", () => {
    expect(endOfDayUtc("2026-05-03")).toBe("2026-05-03T23:59:59Z");
  });

  it("msUntilEndOfDayUtc is positive within a day", () => {
    const d = new Date(Date.UTC(2026, 4, 3, 12, 0, 0));
    const ms = msUntilEndOfDayUtc(d);
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThanOrEqual(24 * 3600 * 1000);
  });
});
