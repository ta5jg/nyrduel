import { useEffect, useState } from "react";
import { getDisplayName, setDisplayName } from "../lib/profile.js";

export function NameInput() {
  const [name, setName] = useState(() => getDisplayName());
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;
    const t = window.setTimeout(() => setDisplayName(name), 300);
    return () => window.clearTimeout(t);
  }, [name, touched]);

  return (
    <div className="card">
      <div className="card-title">Display name (optional)</div>
      <input
        type="text"
        placeholder="Anonymous"
        value={name}
        onChange={(e) => {
          setTouched(true);
          setName(e.target.value.slice(0, 24));
        }}
        maxLength={24}
        aria-label="Display name"
      />
      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
        Up to 24 characters. Skip to play as anon.
      </div>
    </div>
  );
}
