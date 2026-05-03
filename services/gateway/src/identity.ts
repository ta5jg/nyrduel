/* =============================================================================
 * User identity — opaque, stable, anon-friendly.
 *
 * Priority:
 *   1. Explicit `user` in the request (client-managed device id).
 *      Sanitized to printable ASCII, max 64 chars.
 *   2. Server-derived fallback: sha256(ip + ua).
 *
 * The fallback is intentionally weak (one user behind a NAT shares an id with
 * peers). It exists so anonymous clicks still land on the leaderboard; users
 * who care about cross-device persistence pass their own id.
 * ============================================================================= */

import { createHash } from "node:crypto";
import type { FastifyRequest } from "fastify";

const ALLOWED_USER = /^[A-Za-z0-9._:\-]{1,64}$/;
const ALLOWED_NAME = /^[\p{L}\p{N}\p{Emoji}_ .\-]{1,24}$/u;

export function deriveUserId(req: FastifyRequest, hinted?: string | null): string {
  if (hinted && ALLOWED_USER.test(hinted)) return hinted;
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.ip || "0.0.0.0";
  const ua = (req.headers["user-agent"] as string | undefined) ?? "unknown";
  const h = createHash("sha256").update(`${ip}::${ua}`).digest("hex").slice(0, 16);
  return `anon:${h}`;
}

export function sanitizeDisplayName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (trimmed.length === 0) return null;
  if (trimmed.length > 24) return null;
  if (!ALLOWED_NAME.test(trimmed)) return null;
  return trimmed;
}
