import { getAbility, getHero } from "@nyrduel/engine";
import type { AbilityId, HeroId } from "@nyrduel/protocol";

const FOE_EMOJI: Record<HeroId, string> = {
  soldier: "🛡️",
  brute: "💪",
  archer: "🏹",
  rogue: "🗡️",
  mage: "🔮",
  paladin: "⚔️"
};

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
      <div className="opponent-avatar">{FOE_EMOJI[heroId]}</div>
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
