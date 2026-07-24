"use client";

import { motion } from "framer-motion";

export default function ChallengeLeaderboard({ entries, username = "You" }) {
  const sorted = [...entries].sort((left, right) => right.score - left.score || right.accuracy - left.accuracy).slice(0, 8);
  return <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 250, damping: 24 }} className="cosmic-bright-card cosmic-leaderboard" style={{ padding: "clamp(18px,4vw,30px)", borderRadius: 24 }}>
    <p className="cosmic-review-label" style={{ margin: 0, color: "#ffd98b", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>TODAY&apos;S COSMIC BOARD</p>
    <h2 style={{ margin: "6px 0 18px", fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>Challenge leaderboard</h2>
    <div style={{ display: "grid", gap: 8 }}>{sorted.map((entry, index) => <div className={`cosmic-leaderboard-row ${entry.name === username ? "is-you" : ""}`} key={`${entry.name}-${entry.score}-${index}`} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 13, background: entry.name === username ? "rgba(107,225,184,.16)" : "rgba(255,255,255,.055)", border: entry.name === username ? "1px solid rgba(140,246,202,.35)" : "1px solid transparent" }}><strong style={{ color: index < 3 ? "#ffdb82" : "#b9c8e4" }}>#{index + 1}</strong><span style={{ color: "#f2f8ff", fontWeight: 800 }}>{entry.name}</span><span style={{ color: "#a9f4cb", fontWeight: 900 }}>{entry.score}/{entry.total} · +{entry.xp} XP</span></div>)}</div>
    <p style={{ margin: "16px 0 0", color: "#9fb2d3", fontSize: 12, lineHeight: 1.5 }}>This device&apos;s daily board resets at local midnight. Connect a backend later to share rankings across learners.</p>
  </motion.section>;
}
