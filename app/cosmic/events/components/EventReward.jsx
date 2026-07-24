"use client";

import { motion } from "framer-motion";

export default function EventReward({ xp, cosmetic, claimed = false }) {
  return <motion.div animate={claimed ? { scale: [1, 1.07, 1], filter: "drop-shadow(0 0 14px #ffe08a)" } : { scale: 1 }} style={{ display: "flex", gap: 8, alignItems: "center", padding: "9px 11px", borderRadius: 12, color: "#ffe69a", background: "rgba(220,166,57,.14)", border: "1px solid rgba(255,223,137,.25)", fontSize: 12, fontWeight: 900 }}><span>✦ +{xp} XP</span><span style={{ color: "#b9cae2" }}>·</span><span>{cosmetic}</span></motion.div>;
}
