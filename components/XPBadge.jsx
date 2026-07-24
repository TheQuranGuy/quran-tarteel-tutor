"use client";

import { useEffect, useState } from "react";
import { getUser } from "../lib/user";

export default function XPBadge({ compact = false, value }) {
  const [xp, setXp] = useState(value ?? 0);

  useEffect(() => {
    const sync = () => setXp(value ?? getUser().xp);
    sync();
    window.addEventListener("sheikhduo-user-changed", sync);
    window.addEventListener("sheikhduo-xp-changed", sync);
    return () => {
      window.removeEventListener("sheikhduo-user-changed", sync);
      window.removeEventListener("sheikhduo-xp-changed", sync);
    };
  }, [value]);

  return <div className={`xp-badge ${compact ? "compact" : ""}`}>+ {xp} XP</div>;
}
