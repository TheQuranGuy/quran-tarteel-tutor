"use client";

export default function ChallengeProgress({ current, total, correct, xp }) {
  const percent = total ? Math.round(((current - 1) / total) * 100) : 0;
  return <div style={{ display: "grid", gap: 7, minWidth: 180 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 14, color: "#c7d6ec", fontSize: 13, fontWeight: 800 }}><span>Question {current}/{total}</span><span>{correct} correct · +{xp} XP</span></div><div className="cosmic-challenge-progress-bar" style={{ height: 8, overflow: "hidden", borderRadius: 99, background: "rgba(255,255,255,.11)" }}><div style={{ height: "100%", width: `${percent}%`, borderRadius: "inherit", background: "linear-gradient(90deg,#72dfff,#9cf3c8)", transition: "width .3s ease" }} /></div></div>;
}
