import { ABILITIES, getHero } from "@nyrduel/engine";
import type { AbilityId, HeroId } from "@nyrduel/protocol";

function bonusLabel(b: { hpFlat?: number; atkFlat?: number; defFlat?: number; spdFlat?: number }): string {
  const parts: string[] = [];
  if (b.hpFlat) parts.push(`${b.hpFlat > 0 ? "+" : ""}${b.hpFlat} HP`);
  if (b.atkFlat) parts.push(`${b.atkFlat > 0 ? "+" : ""}${b.atkFlat} ATK`);
  if (b.defFlat) parts.push(`${b.defFlat > 0 ? "+" : ""}${b.defFlat} DEF`);
  if (b.spdFlat) parts.push(`${b.spdFlat > 0 ? "+" : ""}${b.spdFlat} SPD`);
  return parts.join(" · ");
}

export function AbilityPicker({
  heroId,
  value,
  onChange
}: {
  heroId: HeroId | null;
  value: AbilityId | null;
  onChange: (id: AbilityId) => void;
}) {
  const hero = heroId ? getHero(heroId) : null;
  return (
    <div className="card">
      <div className="card-title">2 · Pick an ability</div>
      <div className="pick-grid abilities">
        {ABILITIES.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`pick-card ${value === a.id ? "selected" : ""}`}
            onClick={() => onChange(a.id)}
            aria-pressed={value === a.id}
            disabled={!hero}
          >
            <div className="name">{a.name}</div>
            <div className="blurb">{a.blurb}</div>
            <div className="stats">
              <span className="stat-chip">{bonusLabel(a.bonus)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
