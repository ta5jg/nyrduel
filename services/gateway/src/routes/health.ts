import type { FastifyInstance } from "fastify";

export function registerHealth(app: FastifyInstance): void {
  app.get("/health", async () => ({ ok: true, name: "nyrduel-gateway", time: new Date().toISOString() }));
}
