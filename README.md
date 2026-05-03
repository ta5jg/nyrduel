# Nyrduel

> Daily Duel — a Wordle-style 60-second 1v1 dueling game.
>
> Everyone faces the same AI today. Pick a hero, pick an ability, watch the duel play out. Best score wins. Comes back tomorrow with a new opponent.

## Highlights

- **One match per day, same opponent for the world** — deterministic daily seed.
- **Six heroes × four abilities** — 24 combinations, every choice meaningful.
- **Cinematic playback** — server simulates instantly; the client animates the result.
- **Server-authoritative scoring** — gateway re-runs the simulation, so leaderboards can't be spoofed.
- **Anonymous-first** — play instantly with a device-id; sign in only if you want streaks across devices.
- **Mobile-first responsive** — designed for phones, scales to desktop.

## Layout

```
nyrduel/
├── apps/web              # React 19 + Vite frontend
├── services/gateway      # Fastify + SQLite backend (leaderboard, anti-cheat)
├── packages/engine       # Pure deterministic battle simulator
└── packages/protocol     # Shared TypeScript contracts between web and gateway
```

## Quick start

```bash
pnpm install
pnpm dev          # runs web (http://localhost:5174) + gateway (http://localhost:8788)
```

Or run them individually:

```bash
pnpm dev:web
pnpm dev:gateway
```

## Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `pnpm dev`        | Run web + gateway together                |
| `pnpm build`      | Build all workspaces                      |
| `pnpm test`       | Run all unit tests (Vitest)               |
| `pnpm typecheck`  | TypeScript typecheck across all packages  |
| `pnpm lint`       | ESLint across all packages                |
| `pnpm format`     | Prettier write                            |

## Game design

A duel is a single 1v1 fight between your unit and today's AI unit. You pick a **hero** (base stats and identity) and an **ability** (a stat tweak). The simulator runs a deterministic turn-based battle and produces a result.

**Score** rewards three things: winning, finishing fast, and keeping HP. The exact formula is in `packages/engine/src/score.ts`.

**Daily seed** = `nyrduel:YYYY-MM-DD` (UTC). Today's AI hero+ability is picked deterministically from this seed, so every player worldwide gets the same opponent until midnight UTC.

## Architecture

### Anti-cheat

The gateway never trusts the client's reported score. On `/duel/submit`, it:

1. Receives the player's chosen hero+ability and the seed.
2. Re-runs the simulation server-side using the same engine package the client uses.
3. Computes the score from the result.
4. Stores the server-computed score on the leaderboard.

The client's "result screen" is a visualization, not a source of truth.

### Determinism

The engine is fully deterministic given a seed. Same seed + same picks = same battle, every time, on any machine. This is what lets us re-simulate server-side without storing replays.

### Persistence

SQLite via `better-sqlite3`. One file, no service to run. Schema in `services/gateway/src/db.ts`.

## Roadmap

- [ ] v0.1 — core duel + leaderboard (this milestone)
- [ ] v0.2 — Telegram WebApp integration
- [ ] v0.3 — daily streaks, weekly tournaments
- [ ] v0.4 — USDTg prize pool integration (TronLink)
- [ ] v0.5 — PvP async (face yesterday's top scorer)

## License

MIT — see [LICENSE](LICENSE).
