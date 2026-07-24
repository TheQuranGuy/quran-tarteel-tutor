"use client";

export default function AchievementCategory({ label, active, onClick }) {
  return <button type="button" onClick={onClick} style={{ flex: "0 0 auto", padding: "9px 13px", border: `1px solid ${active ? "#9cecff" : "rgba(172,202,246,.18)"}`, borderRadius: 99, cursor: "pointer", color: active ? "#08172e" : "#c3d3eb", background: active ? "#9cecff" : "rgba(255,255,255,.05)", fontWeight: 850 }}>{label}</button>;
}
