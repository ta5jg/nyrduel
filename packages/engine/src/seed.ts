/* =============================================================================
 * Daily seed helpers.
 *
 * Truth source: UTC. Every player worldwide gets the same daily seed and the
 * same opponent until midnight UTC. Local timezones only affect when *you*
 * see the new seed appear — they never affect what the seed is.
 * ============================================================================= */

const SEED_PREFIX = "nyrduel";

export function todayUtcDate(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function buildSeed(date: string): string {
  return `${SEED_PREFIX}:${date}`;
}

export function todaySeed(now: Date = new Date()): string {
  return buildSeed(todayUtcDate(now));
}

export function seedDate(seed: string): string | null {
  if (!seed.startsWith(`${SEED_PREFIX}:`)) return null;
  const date = seed.slice(SEED_PREFIX.length + 1);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

export function endOfDayUtc(date: string = todayUtcDate()): string {
  return `${date}T23:59:59Z`;
}

export function msUntilEndOfDayUtc(now: Date = new Date()): number {
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return Math.max(0, tomorrow.getTime() - now.getTime());
}
