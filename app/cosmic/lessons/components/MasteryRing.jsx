"use client";

export default function MasteryRing({ value = 0 }) {
  return (
    <div className="cosmic-mastery-ring" aria-label={`${value}% mastery`} style={{ width: 52, height: 52, display: "grid", placeItems: "center", borderRadius: "50%", background: `conic-gradient(#58cc02 ${value * 3.6}deg,#dfe7f0 0)`, boxShadow: value >= 100 ? "0 0 18px #9ff2ca" : "none" }}>
      <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: "50%", background: "#101a3e", color: "#eaf5ff", fontSize: 11, fontWeight: 950 }}>{value}%</span>
    </div>
  );
}
