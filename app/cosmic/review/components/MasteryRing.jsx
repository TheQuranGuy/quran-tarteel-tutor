"use client";

export default function MasteryRing({ value = 0 }) {
  return <div className="cosmic-mastery-ring" aria-label={`${value}% mastery`} style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: "50%", background: `conic-gradient(#58cc02 ${value * 3.6}deg, #dfe7f0 0)` }}><span style={{ width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: "50%", color: "#eaf5ff", background: "#111a3e", fontSize: 10, fontWeight: 950 }}>{value}%</span></div>;
}
