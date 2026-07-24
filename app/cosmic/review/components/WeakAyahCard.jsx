"use client";

import MasteryRing from "./MasteryRing";

export default function WeakAyahCard({ ayah, mastered }) {
  return (
    <div className="cosmic-weak-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 13, border: "1px solid rgba(255,211,129,.28)", borderRadius: 16, color: "#edf6ff", background: "rgba(119,84,31,.16)" }}>
      <MasteryRing value={mastered ? 100 : 0} />
      <div style={{ flex: 1 }}><strong>Ayah {ayah.number}</strong><span dir="rtl" style={{ display: "block", marginTop: 4, fontFamily: "serif", fontSize: 21, textAlign: "right" }}>{ayah.arabic}</span><small style={{ color: "#d4c6a8" }}>Needs a gentle review</small></div>
    </div>
  );
}
