"use client";

export default function AchievementProgress({ value, target, unlocked }) {
  const percent = Math.min(100, Math.round((value / target) * 100));
  const remaining = Math.max(0, target - value);
  return <div style={{ display: "grid", gap: 7 }}><div style={{ height: 8, overflow: "hidden", borderRadius: 99, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${percent}%`, height: "100%", borderRadius: "inherit", background: unlocked ? "linear-gradient(90deg,#ffd56b,#fff0ac)" : "linear-gradient(90deg,#73dcff,#997dff)", transition: "width .35s ease" }} /></div><small style={{ color: unlocked ? "#ffebb2" : "#aec1df" }}>{unlocked ? "Complete" : `${remaining} remaining`} · {Math.min(value, target)}/{target}</small></div>;
}
