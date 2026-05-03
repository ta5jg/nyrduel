/* =============================================================================
 * Cinematic battle playback.
 *
 * The engine is invoked once on mount to produce the full event timeline; we
 * then schedule UI updates one event per ~220ms. The simulation itself is
 * deterministic — we're only animating the events, not generating them — which
 * keeps the playback in lockstep with the gateway's authoritative rerun.
 * ============================================================================= */

import { useEffect, useReducer, useRef } from "react";
import {
  getAbility,
  getHero,
  resolveUnit,
  runBattle
} from "@nyrduel/engine";
import type { AbilityId, HeroId } from "@nyrduel/protocol";

const TICK_MS = 220;
const FLASH_MS = 160;

export type CompletedBattle = {
  outcome: "a" | "b" | "draw";
  ticks: number;
  remainingHpA: number;
  remainingHpB: number;
};

type LogEntry = { id: number; text: string; cls: string };

type State = {
  hpA: number;
  hpB: number;
  maxA: number;
  maxB: number;
  acting: "a" | "b" | null;
  hitting: "a" | "b" | null;
  crit: boolean;
  popup: { side: "a" | "b"; dmg: number; crit: boolean } | null;
  log: LogEntry[];
};

type Action =
  | { kind: "init"; maxA: number; maxB: number }
  | { kind: "act"; by: "a" | "b"; hpA: number; hpB: number; damage: number; crit: boolean; logText: string }
  | { kind: "clear-flash" }
  | { kind: "end"; hpA: number; hpB: number };

let logSeq = 0;

function reducer(s: State, a: Action): State {
  switch (a.kind) {
    case "init":
      return { ...s, hpA: a.maxA, hpB: a.maxB, maxA: a.maxA, maxB: a.maxB, log: [] };
    case "act": {
      const target = a.by === "a" ? "b" : "a";
      return {
        ...s,
        hpA: a.hpA,
        hpB: a.hpB,
        acting: a.by,
        hitting: target,
        crit: a.crit,
        popup: { side: target, dmg: a.damage, crit: a.crit },
        log: [...s.log, { id: ++logSeq, text: a.logText, cls: a.crit ? "crit" : a.by === "a" ? "you" : "foe" }].slice(-40)
      };
    }
    case "clear-flash":
      return { ...s, acting: null, hitting: null, crit: false, popup: null };
    case "end":
      return { ...s, hpA: a.hpA, hpB: a.hpB, acting: null, hitting: null, popup: null };
  }
}

const INITIAL: State = {
  hpA: 1,
  hpB: 1,
  maxA: 1,
  maxB: 1,
  acting: null,
  hitting: null,
  crit: false,
  popup: null,
  log: []
};

export function BattleStage({
  seed,
  player,
  opponent,
  onComplete
}: {
  seed: string;
  player: { hero: HeroId; ability: AbilityId };
  opponent: { hero: HeroId; ability: AbilityId };
  onComplete: (r: CompletedBattle) => void;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const a = resolveUnit(player.hero, player.ability);
    const b = resolveUnit(opponent.hero, opponent.ability);
    dispatch({ kind: "init", maxA: a.hp, maxB: b.hp });

    const result = runBattle({ seed, a, b });
    const youName = getHero(player.hero).name;
    const foeName = getHero(opponent.hero).name;

    let cancelled = false;
    let i = 0;
    const timers: number[] = [];

    function step(): void {
      if (cancelled) return;
      const ev = result.events[i++];
      if (!ev) return;
      if (ev.type === "act") {
        const text =
          `${ev.by === "a" ? youName : foeName} hits ${ev.by === "a" ? foeName : youName} ` +
          `for ${ev.damage}${ev.crit ? " · CRIT" : ""}`;
        dispatch({ kind: "act", by: ev.by, hpA: ev.hpA, hpB: ev.hpB, damage: ev.damage, crit: ev.crit, logText: text });
        timers.push(window.setTimeout(() => dispatch({ kind: "clear-flash" }), FLASH_MS));
        timers.push(window.setTimeout(step, TICK_MS));
      } else {
        dispatch({ kind: "end", hpA: ev.hpA, hpB: ev.hpB });
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              onCompleteRef.current({
                outcome: ev.outcome,
                ticks: ev.tick,
                remainingHpA: ev.hpA,
                remainingHpB: ev.hpB
              });
            }
          }, 600)
        );
      }
    }

    timers.push(window.setTimeout(step, 500));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [seed, player.hero, player.ability, opponent.hero, opponent.ability]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.log]);

  const youHero = getHero(player.hero);
  const youAb = getAbility(player.ability);
  const foeHero = getHero(opponent.hero);
  const foeAb = getAbility(opponent.ability);

  return (
    <div className="battle">
      <div className="battle-row you">
        <div
          className={[
            "combatant",
            state.acting === "a" ? "acting" : "",
            state.hitting === "a" ? (state.crit ? "crit-hit" : "hit") : ""
          ].join(" ")}
        >
          <div className="name">
            <span>You · {youHero.name}</span>
            <span className="ability">{youAb.name}</span>
          </div>
          <div className="hpbar">
            <div className="hpbar-fill" style={{ width: `${(state.hpA / state.maxA) * 100}%` }} />
            <div className="hpbar-label">
              {state.hpA} / {state.maxA}
            </div>
          </div>
          {state.popup?.side === "a" && (
            <div className={`dmg-popup ${state.popup.crit ? "crit" : ""}`}>-{state.popup.dmg}</div>
          )}
        </div>
      </div>

      <div className="battle-vs">VS</div>

      <div className="battle-row foe">
        <div
          className={[
            "combatant",
            state.acting === "b" ? "acting" : "",
            state.hitting === "b" ? (state.crit ? "crit-hit" : "hit") : ""
          ].join(" ")}
        >
          <div className="name">
            <span>Foe · {foeHero.name}</span>
            <span className="ability">{foeAb.name}</span>
          </div>
          <div className="hpbar foe">
            <div className="hpbar-fill" style={{ width: `${(state.hpB / state.maxB) * 100}%` }} />
            <div className="hpbar-label">
              {state.hpB} / {state.maxB}
            </div>
          </div>
          {state.popup?.side === "b" && (
            <div className={`dmg-popup ${state.popup.crit ? "crit" : ""}`}>-{state.popup.dmg}</div>
          )}
        </div>
      </div>

      <div className="battle-log" ref={logRef}>
        {state.log.length === 0 && <div className="entry muted">Combat begins…</div>}
        {state.log.map((l) => (
          <div key={l.id} className={`entry ${l.cls}`}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
