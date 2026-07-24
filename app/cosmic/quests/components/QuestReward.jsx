"use client";

import { motion } from "framer-motion";

export default function QuestReward({ xp, cosmetic, claimed = false }) {
  return <motion.div animate={claimed ? { scale: [1, 1.07, 1], boxShadow: "0 0 22px rgba(255,213,109,.5)" } : { boxShadow: "0 0 0 rgba(255,213,109,0)" }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderRadius: 12, color: "#ffe7a0", background: "rgba(207,153,48,.13)", border: "1px solid rgba(255,217,125,.2)", fontSize: 12, fontWeight: 850 }}><span>✦ +{xp} XP</span><span style={{ color: "#c5d8ed" }}>·</span><span>{cosmetic}</span></motion.div>;
}
