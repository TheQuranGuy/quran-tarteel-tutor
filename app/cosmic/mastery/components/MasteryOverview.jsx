"use client";

import MasteryRing from "./MasteryRing";

export default function MasteryOverview({ total, xp, streak, surahs }) {
  return <section className="cosmic-bright-card" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 20, alignItems: "center", padding: "clamp(20px,4vw,32px)", borderRadius: 25 }}><MasteryRing value={total} size={128} label="Total" /><div><p style={{ margin: 0, color: "#ffdb8a", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>MASTERY CONSTELLATION</p><h1 style={{ margin: "7px 0", fontSize: "clamp(2.1rem,6vw,4.3rem)", letterSpacing: "-.06em", lineHeight: .95 }}>Know each ayah deeply.</h1><p style={{ margin: 0, maxWidth: 570, color: "#c4d4ea", lineHeight: 1.6 }}>Mastery is your completion score minus any active weakness penalty.</p><div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 17, color: "#eef8ff", fontWeight: 850 }}><span>{xp} XP</span><span>🔥 {streak} day streak</span><span>{surahs} surah worlds</span></div></div></section>;
}
