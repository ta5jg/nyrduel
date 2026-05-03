/* =============================================================================
 * Env loader. Reads from .env (via dotenv) once, validates with zod, freezes.
 *
 * Don't import process.env elsewhere in the gateway — go through readEnv() so
 * a missing/invalid value fails at startup instead of at first request.
 * ============================================================================= */

import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(8788),
  HOST: z.string().default("0.0.0.0"),
  DB_PATH: z.string().default("./data/nyrduel.sqlite"),
  CORS_ORIGIN: z.string().default("*"),
  PRIZE_POOL_USDTG: z.coerce.number().int().min(0).default(100),
  /** Comma-separated list of trusted proxy CIDRs for X-Forwarded-For. Empty = trust loopback only. */
  TRUST_PROXY: z.string().default(""),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development")
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

export function readEnv(): Env {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`invalid environment: ${issues}`);
  }
  cached = Object.freeze(parsed.data);
  return cached;
}
