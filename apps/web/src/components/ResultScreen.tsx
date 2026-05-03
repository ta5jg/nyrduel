import { getAbility, getHero } from "@nyrduel/engine";
import type { AbilityId, HeroId } from "@nyrduel/protocol";
import { Countdown } from "./Countdown.js";
import { Leaderboard } from "./Leaderboard.js";
import { ShareCard } from "./ShareCard.js";
import { formatRank, formatTicks } from "../lib/format.js";

type Props = {
  date: string;
  seed: string;
  player: { hero: HeroId; ability: AbilityId };
  opponent: { hero: HeroId; ability: AbilityId };
  outcome: "a" | "b" | "draw";
  ticks: number;
  remainingHpA: number;
  remainingHpB: number;
  score: number;
  rank: number;
  totalPlayers: number;
  user: string;
};

export function ResultScreen(p: Props) {
  const headline =
    p.outcome === "a" ? "Victory" : p.outcome === "draw" ? "Draw" : "Defeat";
  const isLoss = p.outcome === "b";

  const youHero = getHero(p.player.hero);
  const youAb = getAbility(p.player.ability);
  const foeHero = getHero(p.opponent.hero);
  const foeAb = getAbility(p.opponent.ability);

  return (
    <>
      <div className="result">
        <h1 className={`result-headline ${isLoss ? "loss" : ""}`}>{headline}</h1>
        <div className="result-score">{p.score}</div>
        <div className="result-meta">
          {formatRank(p.rank, p.totalPlayers)} · {formatTicks(p.ticks)} ·{" "}
          HP {p.remainingHpA}/{p.remainingHpB}
        </div>

        <div className="row wrap" style={{ justifyContent: "center", gap: 10, marginTop: 12 }}>
          <div className="row" style={{ gap: 4, fontSize: 13 }}>
            <span className="muted">You:</span>
            <strong>
              {youHero.name} · {youAb.name}
            </strong>
          </div>
          <span className="muted">vs</span>
          <div className="row" style={{ gap: 4, fontSize: 13 }}>
            <span className="muted">Foe:</span>
            <strong>
              {foeHero.name} · {foeAb.name}
            </strong>
          </div>
        </div>

        <ShareCard
          date={p.date}
          seed={p.seed}
          player={p.player}
          opponent={p.opponent}
          outcome={p.outcome}
          score={p.score}
          rank={p.rank}
          totalPlayers={p.totalPlayers}
        />

        <div className="result-meta">
          Next duel in <strong><Countdown /></strong>
        </div>
      </div>

      <Leaderboard user={p.user} />
    </>
  );
}
