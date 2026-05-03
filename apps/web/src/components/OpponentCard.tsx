import { getAbility, getHero } from "@nyrduel/engine";
import type { AbilityId, HeroId } from "@nyrduel/protocol";
import { HERO_ART } from "../lib/assets.js";

export function OpponentCard({
  heroId,
  abilityId
}: {
  heroId: HeroId;
  abilityId: AbilityId;
}) {
  const hero = getHero(heroId);
  const ability = getAbility(abilityId);
  return (
    <div className="opponent">
      <div className="opponent-avatar">
        <img src={HERO_ART[heroId]} alt={hero.name} draggable={false} />
      </div>
      <div className="opponent-info">
        <div className="label">Today's foe</div>
        <div className="name">
          {hero.name} · {ability.name}
        </div>
        <div className="blurb">{hero.blurb}</div>
      </div>
    </div>
  );
}
