/* =============================================================================
 * BattleArena — cinematic 1v1 playback against a Ghibli-inspired backdrop.
 *
 * The engine produces the full deterministic event timeline on mount; we
 * animate one event per ~220ms. Sprites flash/shake/glow via CSS classes
 * driven from reducer state. Background is selected per-seed so today's
 * arena is the same for everyone.
 * ============================================================================= */

import { useEffect, useReducer, useRef } from "react";
import {
  getAbility,
  getHero,
  resolveUnit,
  runBattle
} from "@nyrduel/engine";
import type { AbilityId, HeroId } from "@nyrduel/protocol";
import { ARENA_NAMES, HERO_ART, arenaForSeed, shouldMirrorHero } from "../lib/assets.js";

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
  popup: { side: "a" | "b"; dmg: number; crit: boolean; nonce: number } | null;
  log: LogEntry[];
};

type Action =
  | { kind: "init"; maxA: number; maxB: number }
  | { kind: "act"; by: "a" | "b"; hpA: number; hpB: number; damage: number; crit: boolean; logText: string }
  | { kind: "clear-flash" }
  | { kind: "end"; hpA: number; hpB: number };

let logSeq = 0;
let popupSeq = 0;

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
        popup: { side: target, dmg: a.damage, crit: a.crit, nonce: ++popupSeq },
        log: [...s.log, { id: ++logSeq, text: a.logText, cls: a.crit ? "crit" : a.by === "a" ? "you" : "foe" }].slice(-40)
      };
    }
    case "clear-flash":
      return { ...s, acting: null, hitting: null, crit: false };
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

type FighterSide = "a" | "b";

function Fighter({
  side,
  hp,
  max,
  heroId,
  abilityId,
  acting,
  hit,
  crit,
  popup
}: {
  side: FighterSide;
  hp: number;
  max: number;
  heroId: HeroId;
  abilityId: AbilityId;
  acting: boolean;
  hit: boolean;
  crit: boolean;
  popup: { dmg: number; crit: boolean; nonce: number } | null;
}) {
  const hero = getHero(heroId);
  const ability = getAbility(abilityId);
  const sideClass = side === "a" ? "you" : "foe";
  const fxClass = acting ? "acting" : hit ? (crit ? "crit-hit" : "hit") : "";
  const pct = Math.max(0, Math.min(100, (hp / Math.max(1, max)) * 100));
  return (
    <div className={`arena-fighter ${sideClass} ${fxClass}`}>
      <div className="fighter-card">
        <div className="fighter-name">
          {hero.name}
          <span> · {ability.name}</span>
        </div>
        <div className="fighter-hpbar">
          <div className="fighter-hpbar-fill" style={{ width: `${pct}%` }} />
          <div className="fighter-hpbar-label">
            {hp}/{max}
          </div>
        </div>
      </div>
      <div className="fighter-art">
        <img
          src={HERO_ART[heroId]}
          alt={hero.name}
          draggable={false}
          style={shouldMirrorHero(heroId, side) ? { transform: "scaleX(-1)" } : undefined}
        />
        {popup && (
          <div key={popup.nonce} className={`dmg-float ${popup.crit ? "crit" : ""}`}>
            -{popup.dmg}
            {popup.crit && <span className="crit-tag">CRIT!</span>}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const arenaUrl = arenaForSeed(seed);
  const arenaName = ARENA_NAMES[arenaUrl] ?? "Arena";

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
          }, 700)
        );
      }
    }

    timers.push(window.setTimeout(step, 600));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [seed, player.hero, player.ability, opponent.hero, opponent.ability]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.log]);

  return (
    <>
      <div
        className="arena"
        style={{ backgroundImage: `url(${arenaUrl})` }}
        aria-label={`Arena: ${arenaName}`}
      >
        <div className="arena-clouds" aria-hidden />
        <div className="arena-floor" aria-hidden />
        <div className="arena-name">{arenaName}</div>

        <Fighter
          side="a"
          hp={state.hpA}
          max={state.maxA}
          heroId={player.hero}
          abilityId={player.ability}
          acting={state.acting === "a"}
          hit={state.hitting === "a"}
          crit={state.crit}
          popup={state.popup?.side === "a" ? state.popup : null}
        />

        <Fighter
          side="b"
          hp={state.hpB}
          max={state.maxB}
          heroId={opponent.hero}
          abilityId={opponent.ability}
          acting={state.acting === "b"}
          hit={state.hitting === "b"}
          crit={state.crit}
          popup={state.popup?.side === "b" ? state.popup : null}
        />
      </div>

      <div className="battle-log" ref={logRef}>
        {state.log.length === 0 && <div className="entry muted">Combat begins…</div>}
        {state.log.map((l) => (
          <div key={l.id} className={`entry ${l.cls}`}>
            {l.text}
          </div>
        ))}
      </div>
    </>
  );
}
