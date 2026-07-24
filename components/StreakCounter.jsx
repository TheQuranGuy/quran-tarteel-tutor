"use client";

import { useEffect, useState } from "react";
import { getUser } from "../lib/user";

export default function StreakCounter({ compact = false }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const sync = () => setCurrent(getUser().streak);
    sync();
    window.addEventListener("sheikhduo-user-changed", sync);
    return () => window.removeEventListener("sheikhduo-user-changed", sync);
  }, []);

  return <div className={`streak-badge ${compact ? "compact" : ""}`}>{current} day streak</div>;
}
