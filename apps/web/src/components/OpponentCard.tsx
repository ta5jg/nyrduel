import { getAlienBoss } from "@nyrduel/engine";
import type { AlienBossId } from "@nyrduel/protocol";
import { ALIEN_BOSS_ART } from "../lib/assets.js";

export function OpponentCard({ alienBossId }: { alienBossId: AlienBossId }) {
  const boss = getAlienBoss(alienBossId);
  return (
    <div className="opponent">
      <div className="opponent-avatar">
        <img src={ALIEN_BOSS_ART[alienBossId]} alt={boss.name} draggable={false} />
      </div>
      <div className="opponent-info">
        <div className="label">Today's alien threat</div>
        <div className="name">{boss.name}</div>
        <div className="blurb">{boss.blurb}</div>
      </div>
    </div>
  );
}
