/* =============================================================================
 * Local profile — stable device id, display name, "already played today" cache.
 * ============================================================================= */

import type { AbilityId, HeroId } from "@nyrduel/protocol";

const K_USER = "nyrduel:user";
const K_NAME = "nyrduel:name";
const K_LAST = "nyrduel:lastResult";

export type SavedResult = {
  date: string;
  hero: HeroId;
  ability: AbilityId;
  opponent: { hero: HeroId; ability: AbilityId };
  outcome: "a" | "b" | "draw";
  ticks: number;
  remainingHpA: number;
  remainingHpB: number;
  score: number;
  rank: number;
  totalPlayers: number;
  seed: string;
};

function genId(): string {
  const buf = new Uint8Array(8);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 8; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return "dev_" + Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getUserId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(K_USER);
  if (!id) {
    id = genId();
    localStorage.setItem(K_USER, id);
  }
  return id;
}

export function getDisplayName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(K_NAME) ?? "";
}

export function setDisplayName(name: string): void {
  const trimmed = name.trim();
  if (trimmed.length === 0) localStorage.removeItem(K_NAME);
  else localStorage.setItem(K_NAME, trimmed);
}

export function getSavedResult(): SavedResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(K_LAST);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedResult;
  } catch {
    return null;
  }
}

export function setSavedResult(r: SavedResult): void {
  localStorage.setItem(K_LAST, JSON.stringify(r));
}

export function clearSavedResult(): void {
  localStorage.removeItem(K_LAST);
}
