/* =============================================================================
 * @nyrduel/protocol — wire contracts between web and gateway.
 *
 * Versioning: every payload carries a literal `v: 1`. Bump the literal when
 * making a breaking change so old clients fail fast instead of silently
 * misinterpreting fields.
 * ============================================================================= */

export const PROTOCOL_VERSION = 1 as const;

// ---------------------------------------------------------------------------
// Hero + ability identifiers
// ---------------------------------------------------------------------------

export const HERO_IDS = ["soldier", "brute", "archer", "rogue", "mage", "paladin"] as const;
export type HeroId = (typeof HERO_IDS)[number];

export const ABILITY_IDS = ["warmachine", "bulwark", "tempo", "heartsteel"] as const;
export type AbilityId = (typeof ABILITY_IDS)[number];

export type HeroDef = {
  id: HeroId;
  name: string;
  blurb: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  critPct: number;
  critMulPct: number;
};

export type AbilityDef = {
  id: AbilityId;
  name: string;
  blurb: string;
  bonus: { hpFlat?: number; atkFlat?: number; defFlat?: number; spdFlat?: number };
};

// ---------------------------------------------------------------------------
// /duel/today
// ---------------------------------------------------------------------------

export type DuelTodayResponse = {
  v: 1;
  ok: true;
  date: string;          // YYYY-MM-DD UTC
  seed: string;          // nyrduel:<date>
  endsAtUtc: string;     // ISO8601, when today's seed rolls over
  opponent: { hero: HeroId; ability: AbilityId };
  prizePoolUsdtg: number;
};

// ---------------------------------------------------------------------------
// /duel/submit
// ---------------------------------------------------------------------------

export type DuelSubmitRequest = {
  v: 1;
  seed: string;
  player: { hero: HeroId; ability: AbilityId };
  /** Optional stable user identity. If omitted, server assigns based on IP+device. */
  user?: string | null;
  /** Optional display name shown on leaderboard. Trimmed/sanitized server-side. */
  displayName?: string | null;
};

export type DuelSubmitResponseOk = {
  v: 1;
  ok: true;
  outcome: "a" | "b" | "draw";
  ticks: number;
  remainingHpA: number;
  remainingHpB: number;
  score: number;
  rank: number;        // your position on today's leaderboard, 1-based
  totalPlayers: number;
  improvedToday: boolean;  // true if this submission beat your previous score
};

export type DuelSubmitResponseErr = {
  v: 1;
  ok: false;
  error: "BAD_REQUEST" | "WRONG_SEED" | "RATE_LIMITED" | "INTERNAL";
  message?: string;
};

export type DuelSubmitResponse = DuelSubmitResponseOk | DuelSubmitResponseErr;

// ---------------------------------------------------------------------------
// /duel/leaderboard
// ---------------------------------------------------------------------------

export type DuelLeaderboardEntry = {
  rank: number;
  user: string;             // opaque, server-assigned id
  displayName: string | null;
  hero: HeroId;
  ability: AbilityId;
  outcome: "a" | "b" | "draw";
  ticks: number;
  score: number;
  atMs: number;             // when submitted (UTC ms)
};

export type DuelLeaderboardResponse = {
  v: 1;
  ok: true;
  date: string;
  top: DuelLeaderboardEntry[];
  total: number;            // total submissions today
  yours?: DuelLeaderboardEntry | null;
};

// ---------------------------------------------------------------------------
// /duel/streak/:user
// ---------------------------------------------------------------------------

export type DuelStreakResponse = {
  v: 1;
  ok: true;
  user: string;
  current: number;          // consecutive UTC days played up to today
  longest: number;
  daysPlayed: number;       // total distinct UTC days played, all-time
};

// ---------------------------------------------------------------------------
// Generic error envelope (for routes that don't have a typed shape yet)
// ---------------------------------------------------------------------------

export type ApiError = {
  v: 1;
  ok: false;
  error: string;
  message?: string;
};
