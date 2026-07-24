"use client";

import { motion } from "framer-motion";

export default function SkillOverview({ branches, unlocked, total }) {
  const average = Math.round(branches.reduce((sum, branch) => sum + branch.percent, 0) / Math.max(1, branches.length));
  return <section className="cosmic-bright-card" style={{ padding: "18px clamp(18px,3vw,28px)", borderRadius: 25, display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", alignItems: "center", gap: 18 }}>
    <div style={{ width: 82, height: 82, display: "grid", placeItems: "center", borderRadius: "50%", color: "#eff8ff", background: `conic-gradient(#a9b7ff ${average * 3.6}deg,rgba(255,255,255,.1) 0)`, boxShadow: "0 0 36px rgba(161,181,255,.26)" }}><div style={{ width: 65, height: 65, display: "grid", placeItems: "center", borderRadius: "50%", background: "#111b50", fontWeight: 950 }}>{average}%</div></div>
    <div><strong style={{ display: "block", fontSize: 18 }}>Your learning constellation</strong><p style={{ margin: "5px 0 0", color: "#bfcee5", lineHeight: 1.55, fontSize: 14 }}>Unlocking is visual guidance only: your established lesson, XP, streak, and mastery rules stay exactly as they are.</p></div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18 }} style={{ padding: "10px 13px", borderRadius: 15, background: "rgba(168,240,201,.1)", border: "1px solid rgba(168,240,201,.25)", textAlign: "center" }}><strong style={{ color: "#a8f0c9", fontSize: 18 }}>{unlocked}/{total}</strong><span style={{ display: "block", color: "#bfd3e8", fontSize: 11, fontWeight: 800 }}>skills lit</span></motion.div>
  </section>;
}
