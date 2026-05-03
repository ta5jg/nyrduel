/* =============================================================================
 * Thin fetch wrappers for the gateway. Throws on non-2xx; otherwise returns
 * typed JSON. Vite proxies /duel/* and /health to the gateway in dev (see
 * vite.config.ts), so paths stay relative.
 * ============================================================================= */

import type {
  DuelLeaderboardResponse,
  DuelStreakResponse,
  DuelSubmitRequest,
  DuelSubmitResponse,
  DuelTodayResponse
} from "@nyrduel/protocol";

class ApiError extends Error {
  constructor(public status: number, public code: string, message?: string) {
    super(message ?? code);
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: "application/json" } });
  if (!res.ok) throw new ApiError(res.status, "HTTP", `${path} ${res.status}`);
  return (await res.json()) as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await res.json().catch(() => null)) as T | { error?: string; message?: string } | null;
  if (!res.ok) {
    const code = (data && typeof data === "object" && "error" in data && data.error) || "HTTP";
    const msg = (data && typeof data === "object" && "message" in data && data.message) || undefined;
    throw new ApiError(res.status, String(code), msg);
  }
  return data as T;
}

export const api = {
  today: () => get<DuelTodayResponse>("/duel/today"),
  submit: (body: DuelSubmitRequest) => post<DuelSubmitResponse>("/duel/submit", body),
  leaderboard: (params: { user?: string; limit?: number; date?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.user) q.set("user", params.user);
    if (params.limit) q.set("limit", String(params.limit));
    if (params.date) q.set("date", params.date);
    const qs = q.toString();
    return get<DuelLeaderboardResponse>(`/duel/leaderboard${qs ? `?${qs}` : ""}`);
  },
  streak: (user: string) => get<DuelStreakResponse>(`/duel/streak/${encodeURIComponent(user)}`)
};

export { ApiError };
