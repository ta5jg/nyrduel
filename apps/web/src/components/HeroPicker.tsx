import { HEROES } from "@nyrduel/engine";
import type { HeroId } from "@nyrduel/protocol";
import { StatChips } from "./StatChips.js";

export function HeroPicker({
  value,
  onChange
}: {
  value: HeroId | null;
  onChange: (id: HeroId) => void;
}) {
  return (
    <div className="card">
      <div className="card-title">1 · Pick your hero</div>
      <div className="pick-grid heroes">
        {HEROES.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`pick-card ${value === h.id ? "selected" : ""}`}
            onClick={() => onChange(h.id)}
            aria-pressed={value === h.id}
          >
            <div className="name">{h.name}</div>
            <div className="blurb">{h.blurb}</div>
            <StatChips hero={h} />
          </button>
        ))}
      </div>
    </div>
  );
}
