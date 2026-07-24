"use client";

import { motion } from "framer-motion";

export default function AchievementBadge({ icon, unlocked, justUnlocked = false }) {
  return <motion.div aria-hidden="true" initial={justUnlocked ? { scale: 0.2, rotate: -24 } : false} animate={{ scale: unlocked ? [1, 1.1, 1] : 0.88, rotate: justUnlocked ? [0, 12, -8, 0] : 0, filter: unlocked ? "drop-shadow(0 0 16px rgba(255,215,118,.82))" : "grayscale(1) opacity(.36)" }} transition={{ duration: justUnlocked ? 0.7 : 2.4, repeat: justUnlocked ? 0 : Infinity, repeatDelay: 2 }} style={{ width: 66, height: 66, display: "grid", placeItems: "center", flex: "0 0 auto", borderRadius: "50%", border: `1px solid ${unlocked ? "rgba(255,221,135,.7)" : "rgba(200,213,239,.16)"}`, background: unlocked ? "radial-gradient(circle at 30% 25%,#fff5c7,#b87924 70%)" : "#293550", color: "#15203c", fontSize: 31 }}>{icon}</motion.div>;
}
