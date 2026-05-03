/* =============================================================================
 * Nyrduel gateway — entry point.
 *
 * Boot order: env → db → fastify (cors, rate-limit) → routes → listen.
 * One instance, one SQLite file. No background jobs, no queues. Routes are
 * intentionally synchronous (better-sqlite3) — this keeps the surface tiny
 * and makes failure modes obvious.
 * ============================================================================= */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import staticPlugin from "@fastify/static";
import { readEnv } from "./env.js";
import { openDb } from "./db.js";
import { registerHealth } from "./routes/health.js";
import { registerDuelToday } from "./routes/duelToday.js";
import { registerDuelSubmit } from "./routes/duelSubmit.js";
import { registerDuelLeaderboard } from "./routes/duelLeaderboard.js";
import { registerDuelStreak } from "./routes/duelStreak.js";

async function main(): Promise<void> {
  const env = readEnv();
  const db = openDb(env.DB_PATH);

  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true, singleLine: true } }
          : undefined
    },
    trustProxy: env.TRUST_PROXY.length > 0 ? env.TRUST_PROXY.split(",").map((s) => s.trim()) : false
  });

  await app.register(cors, {
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    methods: ["GET", "POST"]
  });

  await app.register(rateLimit, {
    max: 60,
    timeWindow: "1 minute",
    allowList: () => env.NODE_ENV === "test"
  });

  registerHealth(app);
  registerDuelToday(app, { prizePoolUsdtg: env.PRIZE_POOL_USDTG });
  registerDuelSubmit(app, { db });
  registerDuelLeaderboard(app, { db });
  registerDuelStreak(app, { db });

  // Static web bundle (production). Serves /apps/web/dist relative to the
  // gateway's working directory; falls back to index.html for SPA routes.
  const webDist = resolve(process.cwd(), "../../apps/web/dist");
  if (env.NODE_ENV === "production" && existsSync(webDist)) {
    await app.register(staticPlugin, {
      root: webDist,
      prefix: "/",
      decorateReply: false
    });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith("/duel") || req.url.startsWith("/health")) {
        reply.code(404).send({ error: "not found" });
        return;
      }
      reply.type("text/html").sendFile("index.html");
    });
  }

  app.addHook("onClose", async () => {
    db.close();
  });

  process.on("SIGTERM", () => void app.close());
  process.on("SIGINT", () => void app.close());

  await app.listen({ host: env.HOST, port: env.PORT });
  app.log.info({ host: env.HOST, port: env.PORT }, "nyrduel gateway up");
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
