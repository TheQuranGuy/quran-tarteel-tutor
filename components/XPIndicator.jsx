"use client";

import { useXp } from "../context/XPContext";

export default function XPIndicator() {
  const { xp } = useXp();
  return <div className="xp-badge compact" aria-label={`${xp} experience points`}>✦ {xp} XP</div>;
}
