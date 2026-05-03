import type { AbilityDef, HeroDef } from "@nyrduel/protocol";

export function StatChips({ hero, ability }: { hero: HeroDef; ability?: AbilityDef }) {
  const hp = hero.hp + (ability?.bonus.hpFlat ?? 0);
  const atk = hero.atk + (ability?.bonus.atkFlat ?? 0);
  const def = hero.def + (ability?.bonus.defFlat ?? 0);
  const spd = hero.spd + (ability?.bonus.spdFlat ?? 0);
  const tweak = (cur: number, base: number) =>
    cur === base ? null : <span className="muted"> ({cur > base ? "+" : ""}{cur - base})</span>;
  return (
    <div className="stats">
      <span className="stat-chip hp">
        <span className="label">HP</span>
        {hp}
        {tweak(hp, hero.hp)}
      </span>
      <span className="stat-chip atk">
        <span className="label">ATK</span>
        {atk}
        {tweak(atk, hero.atk)}
      </span>
      <span className="stat-chip def">
        <span className="label">DEF</span>
        {def}
        {tweak(def, hero.def)}
      </span>
      <span className="stat-chip spd">
        <span className="label">SPD</span>
        {spd}
        {tweak(spd, hero.spd)}
      </span>
      {hero.critPct > 0 && (
        <span className="stat-chip crit">
          <span className="label">CRIT</span>
          {hero.critPct}%
        </span>
      )}
    </div>
  );
}
