/* =============================================================================
 * Wordle-style share card. The grid is built from the battle's HP-loss curve:
 * each row corresponds to a damage event; squares show who got hit.
 *
 * Squares:
 *   🟦 = your hit (you damaged the foe)
 *   🟥 = foe's hit (foe damaged you)
 *   ⭐ = critical strike
 *   🏆 / 💀 / 🤝 = final outcome marker
 * ============================================================================= */

import { useState } from "react";
import {
  resolveUnit,
  resolveAlienUnit,
  runBattle,
  getHero,
  getAbility,
  getAlienBoss
} from "@nyrduel/engine";
import type { AbilityId, AlienBossId, HeroId } from "@nyrduel/protocol";

type Props = {
  date: string;
  seed: string;
  player: { hero: HeroId; ability: AbilityId };
  opponent: { alienBossId: AlienBossId };
  outcome: "a" | "b" | "draw";
  score: number;
  rank: number;
  totalPlayers: number;
};

export function buildShareText(opts: Props): string {
  const a = resolveUnit(opts.player.hero, opts.player.ability);
  const b = resolveAlienUnit(opts.opponent.alienBossId);
  const result = runBattle({ seed: opts.seed, a, b });

  const grid = result.events
    .filter((ev) => ev.type === "act")
    .map((ev) => {
      if (ev.type !== "act") return "";
      const sq = ev.by === "a" ? "🟦" : "🟪";
      return ev.crit ? `${sq}⭐` : sq;
    })
    .join("");

  const outcomeMark = opts.outcome === "a" ? "🏆" : opts.outcome === "b" ? "💀" : "🤝";
  const outcomeWord = opts.outcome === "a" ? "Repelled" : opts.outcome === "b" ? "Overrun" : "Held";

  const youHero = getHero(opts.player.hero).name;
  const youAb = getAbility(opts.player.ability).name;
  const foe = getAlienBoss(opts.opponent.alienBossId).name;

  return [
    `Nyrduel ${opts.date}`,
    `${outcomeMark} ${outcomeWord} the ${foe}`,
    `${opts.score} pts · #${opts.rank}/${opts.totalPlayers}`,
    `${youHero} + ${youAb}`,
    grid || "(no contact)",
    "https://github.com/ta5jg/nyrduel"
  ].join("\n");
}

export function ShareCard(props: Props) {
  const text = buildShareText(props);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      // User cancelled share or clipboard denied — silent.
    }
  };

  return (
    <div>
      <div className="share-card">{text}</div>
      <div className="row" style={{ justifyContent: "center" }}>
        <button type="button" className="btn btn-accent" onClick={copy}>
          {copied ? "Copied!" : "Share result"}
        </button>
      </div>
    </div>
  );
}
