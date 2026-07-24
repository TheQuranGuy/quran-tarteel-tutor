"use client";

import MasteryRing from "./MasteryRing";

export default function MasteryAyahCard({ ayah, mastery, weak, mastered }) {
  return <article className="cosmic-v2-card" style={{ display: "grid", gridTemplateColumns: "54px minmax(0,1fr)", gap: 13, alignItems: "center", padding: 13, borderRadius: 16, border: `1px solid ${weak ? "rgba(255,145,157,.35)" : "rgba(176,210,250,.16)"}`, background: weak ? "rgba(177,58,81,.12)" : "rgba(255,255,255,.045)" }}><MasteryRing value={mastery} size={54} label="" /><div><strong style={{ color: "#f2f8ff" }}>Ayah {ayah.number}</strong><p style={{ margin: "4px 0", color: "#b7c8e2", fontSize: 13, lineHeight: 1.45 }}>{ayah.translation}</p><small style={{ color: weak ? "#ffb4bd" : mastered ? "#a9f3ca" : "#9bb3d4", fontWeight: 800 }}>{weak ? "Needs review" : mastered ? "Mastered" : "Not yet mastered"}</small></div></article>;
}
