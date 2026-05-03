/* =============================================================================
 * File:           services/gateway/src/routes/signup.ts
 * Author:         USDTG GROUP TECHNOLOGY LLC
 * Developer:      Irfan Gedik
 * Created Date:   2026-05-03
 * Last Update:    2026-05-03
 * Version:        0.1.0
 *
 * Description:
 *   POST /signup — collects launch-invite emails for nyrvexa.com (and any
 *   other USDTG site that shares this gateway). Writes to the same SQLite
 *   file as the duel data; one row per email; idempotent on duplicate.
 *
 * License:
 *   Proprietary. All rights reserved. See LICENSE in the repository root.
 * ============================================================================= */

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Db } from "../db.js";

const Body = z
  .object({
    v: z.literal(1),
    email: z.string().email().max(254),
    source: z.string().min(1).max(64).optional()
  })
  .strict();

const SCHEMA = `
CREATE TABLE IF NOT EXISTS signups (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  email   TEXT NOT NULL UNIQUE,
  source  TEXT,
  at_ms   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_signups_at_ms ON signups(at_ms DESC);
`;

export type SignupDeps = { db: Db };

export function registerSignup(app: FastifyInstance, deps: SignupDeps): void {
  deps.db.exec(SCHEMA);

  const upsert = deps.db.prepare(`
    INSERT INTO signups (email, source, at_ms)
    VALUES (?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET source = excluded.source, at_ms = excluded.at_ms
  `);

  app.post("/signup", async (req, reply) => {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { v: 1, ok: false, error: "BAD_REQUEST", message: parsed.error.issues[0]?.message };
    }
    const email = parsed.data.email.trim().toLowerCase();
    upsert.run(email, parsed.data.source ?? "unknown", Date.now());
    return { v: 1, ok: true };
  });
}
