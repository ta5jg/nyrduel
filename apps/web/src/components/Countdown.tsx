import { useEffect, useState } from "react";
import { msUntilEndOfDayUtc } from "@nyrduel/engine";
import { formatCountdown } from "../lib/format.js";

export function Countdown() {
  const [ms, setMs] = useState(() => msUntilEndOfDayUtc());
  useEffect(() => {
    const t = window.setInterval(() => setMs(msUntilEndOfDayUtc()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return <span>{formatCountdown(ms)}</span>;
}
