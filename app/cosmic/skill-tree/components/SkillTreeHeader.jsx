"use client";

import Link from "next/link";

export default function SkillTreeHeader({ xp, streak }) {
  return <header style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
    <div style={{ maxWidth: 650 }}>
      <p style={{ margin: 0, color: "#bfc7ff", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC SKILL TREE</p>
      <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(2.8rem,7vw,5.7rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Grow the skills behind every ayah.</h1>
      <p style={{ margin: 0, color: "#c7d5ea", lineHeight: 1.65 }}>This is an activity-informed learning map. It reads your existing lessons, listening, mastery, and review signals without changing them.</p>
    </div>
    <div style={{ display: "grid", gap: 9, justifyItems: "end" }}>
      <div style={{ display: "flex", gap: 8 }}><span style={{ padding: "9px 12px", border: "1px solid rgba(193,217,255,.18)", borderRadius: 14, background: "rgba(11,18,52,.58)", color: "#ffe29a", fontWeight: 900 }}>{xp} XP</span><span style={{ padding: "9px 12px", border: "1px solid rgba(193,217,255,.18)", borderRadius: 14, background: "rgba(11,18,52,.58)", color: "#ffbdd5", fontWeight: 900 }}>{streak}d streak</span></div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}><Link className="cosmic-button cosmic-button--outline" href="/cosmic/story">Story mode</Link><Link className="cosmic-button cosmic-button--mint" href="/cosmic/path">Learning path</Link></div>
    </div>
  </header>;
}
