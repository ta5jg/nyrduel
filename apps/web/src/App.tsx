/* =============================================================================
 * Nyrduel app shell.
 *
 * Phase machine: loading → pre-duel → battle → post-duel.
 * "Already played today" is detected via localStorage and jumps directly to
 * post-duel using the saved result. The gateway is the source of truth for
 * leaderboard placement; the saved result is just a UI convenience.
 * ============================================================================= */

import { useCallback, useEffect, useState } from "react";
import { todayUtcDate } from "@nyrduel/engine";
import type { AbilityId, DuelTodayResponse, HeroId } from "@nyrduel/protocol";
import { Brand } from "./components/Brand.js";
import { DailyBar } from "./components/DailyBar.js";
import { OpponentCard } from "./components/OpponentCard.js";
import { HeroPicker } from "./components/HeroPicker.js";
import { AbilityPicker } from "./components/AbilityPicker.js";
import { NameInput } from "./components/NameInput.js";
import { BattleStage, type CompletedBattle } from "./components/BattleStage.js";
import { ResultScreen } from "./components/ResultScreen.js";
import { api, ApiError } from "./lib/api.js";
import {
  clearSavedResult,
  getDisplayName,
  getSavedResult,
  getUserId,
  setSavedResult,
  type SavedResult
} from "./lib/profile.js";

type Phase = "loading" | "pre" | "battle" | "post";

export function App() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [today, setToday] = useState<DuelTodayResponse | null>(null);
  const [hero, setHero] = useState<HeroId | null>(null);
  const [ability, setAbility] = useState<AbilityId | null>(null);
  const [saved, setSaved] = useState<SavedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  // Initial load.
  useEffect(() => {
    let alive = true;
    api
      .today()
      .then((res) => {
        if (!alive) return;
        setToday(res);
        const stored = getSavedResult();
        if (stored && stored.date === res.date) {
          setSaved(stored);
          setPhase("post");
        } else {
          if (stored && stored.date !== res.date) clearSavedResult();
          setPhase("pre");
        }
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  const onPlayAgain = useCallback(() => {
    clearSavedResult();
    setSaved(null);
    setHero(null);
    setAbility(null);
    setSubmitErr(null);
    setPhase("pre");
  }, []);

  const onBattleComplete = useCallback(
    async (r: CompletedBattle) => {
      if (!today || !hero || !ability) return;
      setSubmitting(true);
      setSubmitErr(null);
      try {
        const res = await api.submit({
          v: 1,
          seed: today.seed,
          player: { hero, ability },
          user: getUserId(),
          displayName: getDisplayName() || null
        });
        if (!res.ok) {
          setSubmitErr(res.error);
          return;
        }
        const saved: SavedResult = {
          date: today.date,
          hero,
          ability,
          opponent: today.opponent,
          outcome: r.outcome,
          ticks: r.ticks,
          remainingHpA: r.remainingHpA,
          remainingHpB: r.remainingHpB,
          score: res.score,
          rank: res.rank,
          totalPlayers: res.totalPlayers,
          seed: today.seed
        };
        setSavedResult(saved);
        setSaved(saved);
        setPhase("post");
      } catch (e) {
        const err = e as ApiError;
        setSubmitErr(err.message ?? "submit failed");
      } finally {
        setSubmitting(false);
      }
    },
    [today, hero, ability]
  );

  return (
    <div className="app">
      <Brand />

      {phase !== "loading" && today && <DailyBar date={today.date} prizePool={today.prizePoolUsdtg} />}

      {phase === "loading" && (
        <div className="card center" style={{ padding: 36 }}>
          {error ? (
            <div className="error-box">{error}</div>
          ) : (
            <>
              <span className="spinner" /> Loading today's duel…
            </>
          )}
        </div>
      )}

      {phase === "pre" && today && (
        <>
          <OpponentCard alienBossId={today.opponent.alienBossId} />
          <HeroPicker value={hero} onChange={setHero} />
          <AbilityPicker heroId={hero} value={ability} onChange={setAbility} />
          <NameInput />
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!hero || !ability}
            onClick={() => setPhase("battle")}
          >
            {hero && ability ? "Duel!" : "Pick hero + ability"}
          </button>
          {submitErr && <div className="error-box">Submit error: {submitErr}</div>}
        </>
      )}

      {phase === "battle" && today && hero && ability && (
        <>
          <BattleStage
            seed={today.seed}
            player={{ hero, ability }}
            opponent={today.opponent}
            onComplete={onBattleComplete}
          />
          {submitting && (
            <div className="card center" style={{ padding: 14 }}>
              <span className="spinner" /> Submitting score…
            </div>
          )}
          {submitErr && (
            <div className="error-box">
              Submit failed: {submitErr}.{" "}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onBattleComplete({
                  outcome: saved?.outcome ?? "draw",
                  ticks: saved?.ticks ?? 0,
                  remainingHpA: saved?.remainingHpA ?? 0,
                  remainingHpB: saved?.remainingHpB ?? 0
                })}
              >
                Retry
              </button>
            </div>
          )}
        </>
      )}

      {phase === "post" && saved && today && (
        <ResultScreen
          date={saved.date}
          seed={saved.seed}
          player={{ hero: saved.hero, ability: saved.ability }}
          opponent={saved.opponent}
          outcome={saved.outcome}
          ticks={saved.ticks}
          remainingHpA={saved.remainingHpA}
          remainingHpB={saved.remainingHpB}
          score={saved.score}
          rank={saved.rank}
          totalPlayers={saved.totalPlayers}
          user={getUserId()}
          onPlayAgain={onPlayAgain}
        />
      )}

      <div className="footer">
        Made with care · {todayUtcDate()} UTC ·{" "}
        <a href="https://github.com/ta5jg/nyrduel" target="_blank" rel="noreferrer">
          source
        </a>
      </div>
    </div>
  );
}
