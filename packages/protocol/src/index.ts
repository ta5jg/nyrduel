/* =============================================================================
 * File:           packages/protocol/src/index.ts
 * Author:         USDTG GROUP TECHNOLOGY LLC
 * Developer:      Irfan Gedik
 * Created Date:   2026-05-04
 * Last Update:    2026-05-04
 * Version:        0.2.0
 *
 * Description:
 *   @nyrduel/protocol — wire contracts between web and gateway.
 *
 *   v0.2 design pivot: combat is human-versus-alien only. The player still
 *   picks from six human hero archetypes plus an ability augment; the
 *   opponent is now one of twelve alien bosses on a deterministic daily
 *   rotation. Combat math is unchanged — only the foe's identity shifts.
 *
 *   Versioning: every payload carries a literal `v: 1`. Bump the literal
 *   when making a breaking change so old clients fail fast instead of
 *   silently misinterpreting fields.
 *
 * License:
 *   Proprietary. All rights reserved. See LICENSE in the repository root.
 * ============================================================================= */

export const PROTOCOL_VERSION = 1 as const;

// ---------------------------------------------------------------------------
// Player side — six human hero archetypes, four ability augments.
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
// Alien antagonist roster — twelve abstract entities in daily rotation.
//
// Design rule (see feedback_aliens_non_biological.md): aliens are *not*
// creatures. They are architecture, geometry, energy, or phenomena. Every
// id below is a noun drawn from those domains — never a species name. The
// goal is strategic challenge through unfamiliar geometry, not biological
// horror.
//
// Aliens have built-in kits (no ability augments), so the opponent payload
// is leaner than the player's: just the entity id.
// ---------------------------------------------------------------------------

export const ALIEN_BOSS_IDS = [
  "lattice",
  "crown",
  "choir",
  "citadel",
  "seam",
  "vault",
  "gate",
  "pillar",
  "veil",
  "mark",
  "spoke",
  "continent"
] as const;
export type AlienBossId = (typeof ALIEN_BOSS_IDS)[number];

export type AlienBossDef = {
  id: AlienBossId;
  name: string;
  blurb: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  critPct: number;
  critMulPct: number;
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
  opponent: { alienBossId: AlienBossId };
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
  /** Which alien the player faced (echoed for share-card / leaderboard context). */
  alienBossId: AlienBossId;
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
  user: string;
  displayName: string | null;
  hero: HeroId;
  ability: AbilityId;
  outcome: "a" | "b" | "draw";
  ticks: number;
  score: number;
  atMs: number;
};

export type DuelLeaderboardResponse = {
  v: 1;
  ok: true;
  date: string;
  top: DuelLeaderboardEntry[];
  total: number;
  yours?: DuelLeaderboardEntry | null;
};

// ---------------------------------------------------------------------------
// /duel/streak/:user
// ---------------------------------------------------------------------------

export type DuelStreakResponse = {
  v: 1;
  ok: true;
  user: string;
  current: number;
  longest: number;
  daysPlayed: number;
};

// ---------------------------------------------------------------------------
// Generic error envelope
// ---------------------------------------------------------------------------

export type ApiError = {
  v: 1;
  ok: false;
  error: string;
  message?: string;
};
