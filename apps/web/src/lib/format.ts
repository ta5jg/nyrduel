export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Ticks → seconds for display. The engine is unitless; we treat 10 ticks as ~1s. */
export function formatTicks(t: number): string {
  return `${(t / 10).toFixed(1)}s`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatRank(rank: number, total: number): string {
  if (total <= 0) return `#${rank}`;
  const pct = Math.round(((total - rank + 1) / total) * 100);
  return `#${rank} of ${total} · top ${100 - pct + 1}%`;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}
