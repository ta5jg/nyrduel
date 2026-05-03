import { Countdown } from "./Countdown.js";

export function DailyBar({ date, prizePool }: { date: string; prizePool: number }) {
  return (
    <div className="daily-bar">
      <div>
        <span className="label">Date (UTC)</span>
        <span className="value">{date}</span>
      </div>
      <div>
        <span className="label">Next duel in</span>
        <span className="value accent"><Countdown /></span>
      </div>
      <div>
        <span className="label">Prize pool</span>
        <span className="value gold">{prizePool} USDTg</span>
      </div>
    </div>
  );
}
