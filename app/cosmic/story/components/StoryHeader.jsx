"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function Stat({ value, label, tint }) {
  return <div style={{ minWidth: 82, padding: "10px 12px", border: "1px solid rgba(196,220,255,.17)", borderRadius: 16, background: "rgba(8,14,45,.44)" }}>
    <strong style={{ display: "block", color: tint, fontSize: 18 }}>{value}</strong>
    <span style={{ color: "#b7c9e5", fontSize: 11, fontWeight: 800 }}>{label}</span>
  </div>;
}

export default function StoryHeader({ completedChapters, xp, streak, dailyGoal }) {
  return <header className="cd-story-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
    <div style={{ maxWidth: 650 }}>
      <p style={{ margin: 0, color: "#bfc7ff", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC STORY MODE</p>
      <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(2.8rem,7vw,5.7rem)", lineHeight: 0.92, letterSpacing: "-.07em" }}>Read the Qur&apos;an as a living constellation.</h1>
      <p style={{ margin: 0, color: "#c7d5ea", lineHeight: 1.65 }}>Every surah is a chapter. Every ayah is a memory fragment waiting to be restored through calm, steady practice.</p>
    </div>
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }} style={{ display: "grid", gap: 11, justifyItems: "end" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <Stat value={completedChapters} label="chapters complete" tint="#9df2d2" />
        <Stat value={xp} label="total XP" tint="#ffe39a" />
        <Stat value={`${streak}d`} label="streak" tint="#ffb8d9" />
        <Stat value={`${dailyGoal} XP`} label="daily goal" tint="#a9cfff" />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <Link href="/cosmic/skill-tree" className="cosmic-button cosmic-button--outline">Skill tree</Link>
        <Link href="/cosmic/path" className="cosmic-button cosmic-button--mint">Learning path</Link>
      </div>
    </motion.div>
  </header>;
}
