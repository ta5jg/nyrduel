import { useEffect, useState } from "react";
import type { DuelLeaderboardEntry, DuelLeaderboardResponse } from "@nyrduel/protocol";
import { api } from "../lib/api.js";
import { formatTicks } from "../lib/format.js";

const RANK_CLASS = (rank: number): string =>
  rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";

export function Leaderboard({ user }: { user: string }) {
  const [data, setData] = useState<DuelLeaderboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .leaderboard({ user, limit: 100 })
      .then((res) => {
        if (alive) setData(res);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  if (error) return <div className="error-box">Could not load leaderboard: {error}</div>;
  if (!data) {
    return (
      <div className="card center">
        <span className="spinner" /> Loading leaderboard…
      </div>
    );
  }

  return (
    <div className="card">
      <div className="row spread" style={{ marginBottom: 10 }}>
        <div className="card-title" style={{ margin: 0 }}>
          Leaderboard
        </div>
        <div className="muted" style={{ fontSize: 12 }}>
          {data.total} {data.total === 1 ? "player" : "players"} today
        </div>
      </div>

      {data.top.length === 0 ? (
        <div className="muted center" style={{ padding: 20 }}>
          Be the first to duel today.
        </div>
      ) : (
        <div className="leaderboard-list">
          {data.top.map((row) => (
            <Row key={row.user} entry={row} isYou={row.user === user} />
          ))}
        </div>
      )}

      {data.yours && !data.top.some((r) => r.user === user) && (
        <>
          <div className="divider" />
          <Row entry={data.yours} isYou />
        </>
      )}
    </div>
  );
}

function Row({ entry, isYou }: { entry: DuelLeaderboardEntry; isYou: boolean }) {
  const name = entry.displayName ?? (isYou ? "You" : "anon");
  return (
    <div className={`lb-row ${isYou ? "you" : ""}`}>
      <span className={`rank ${RANK_CLASS(entry.rank)}`}>#{entry.rank}</span>
      <div className="who">
        <span className="name">
          {name}
          {isYou && <span className="muted"> · you</span>}
        </span>
        <span className="pick">
          {entry.hero} · {entry.ability} · {entry.outcome.toUpperCase()} · {formatTicks(entry.ticks)}
        </span>
      </div>
      <span className="score">{entry.score}</span>
    </div>
  );
}
