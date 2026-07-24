"use client";

import { motion } from "framer-motion";

export default function SkillNode({ label, threshold, unlocked, color, index }) {
  return <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .08 + index * .045 }} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 34 }}>
    <span aria-hidden="true" style={{ position: "relative", zIndex: 1, display: "grid", width: 22, height: 22, placeItems: "center", borderRadius: "50%", color: unlocked ? "#071126" : "#8da0c1", background: unlocked ? color : "#1b2754", border: `1px solid ${unlocked ? color : "rgba(195,216,255,.25)"}`, boxShadow: unlocked ? `0 0 15px ${color}80` : "none", fontSize: 11, fontWeight: 950 }}>{unlocked ? "*" : "-"}</span>
    <span style={{ color: unlocked ? "#ecf5ff" : "#8191b4", fontSize: 13, fontWeight: unlocked ? 850 : 700 }}>{label} <small style={{ color: unlocked ? color : "#7585a7", fontWeight: 800 }}>({threshold}%)</small></span>
  </motion.div>;
}
