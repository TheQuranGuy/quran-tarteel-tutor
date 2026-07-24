"use client";

export default function LockedUnit({ unit }) {
  return <div className="cd-path-locked" title="Complete previous surah to unlock" style={{ width: 230, padding: 20, border: "1px solid rgba(194,211,237,.14)", borderRadius: 24, color: "#8391ad", background: "rgba(16,23,52,.62)", textAlign: "center", opacity: .62 }}><div style={{ width: 58, height: 58, display: "grid", placeItems: "center", margin: "0 auto 10px", borderRadius: "50%", background: "#303a54", fontWeight: 950 }}>LOCK</div><strong>{unit.name}</strong><small style={{ display: "block", marginTop: 7 }}>Complete previous surah to unlock</small></div>;
}
