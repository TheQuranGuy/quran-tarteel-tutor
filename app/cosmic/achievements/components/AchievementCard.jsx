"use client";

import { motion } from "framer-motion";
import AchievementBadge from "./AchievementBadge";
import AchievementProgress from "./AchievementProgress";

export default function AchievementCard({ achievement, onOpen }) {
  const { unlocked, icon, name, description, value, target, xp, justUnlocked } = achievement;
  return <motion.button type="button" className="cosmic-v2-card" onClick={() => onOpen(achievement)} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.985 }} style={{ display: "grid", gridTemplateColumns: "66px minmax(0,1fr)", gap: 15, width: "100%", padding: 16, textAlign: "left", cursor: "pointer", borderRadius: 20, border: `1px solid ${unlocked ? "rgba(255,219,126,.38)" : "rgba(173,201,247,.13)"}`, color: "#eff7ff", background: unlocked ? "linear-gradient(135deg,rgba(178,123,37,.22),rgba(72,44,126,.16))" : "rgba(255,255,255,.045)" }}>
    <AchievementBadge icon={icon} unlocked={unlocked} justUnlocked={justUnlocked} />
    <span style={{ display: "grid", gap: 7, minWidth: 0 }}><span style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}><strong style={{ fontSize: 17 }}>{name}</strong><small style={{ color: unlocked ? "#ffe392" : "#9baecf", fontWeight: 900 }}>+{xp} XP</small></span><span style={{ color: "#bed0e9", lineHeight: 1.45, fontSize: 14 }}>{description}</span><AchievementProgress value={value} target={target} unlocked={unlocked} /></span>
  </motion.button>;
}
