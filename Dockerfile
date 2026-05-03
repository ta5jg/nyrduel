# syntax=docker/dockerfile:1.7
# Multi-stage build: install deps → build all → produce a slim runtime image
# that serves the compiled gateway. The gateway also serves the web bundle
# from /app/web/dist via @fastify/static (configured in src/index.ts).

FROM node:22.16-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY tsconfig.base.json ./
COPY packages ./packages
COPY services ./services
COPY apps ./apps
RUN pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm -r build

FROM node:22.16-alpine AS runtime
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8787
ENV HOST=0.0.0.0
ENV DB_PATH=/app/data/nyrduel.sqlite
COPY --from=build /app/services/gateway/dist ./services/gateway/dist
COPY --from=build /app/services/gateway/package.json ./services/gateway/
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/packages ./packages
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/gateway/node_modules ./services/gateway/node_modules
RUN mkdir -p /app/data
EXPOSE 8787
WORKDIR /app/services/gateway
CMD ["node", "dist/index.js"]
