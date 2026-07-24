"use client";

export default function QuestProgress({ value, target, complete }) {
  const percent = Math.min(100, Math.round((value / target) * 100));
  return <div style={{ display: "grid", gap: 7 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "#b9cae4", fontSize: 12, fontWeight: 800 }}><span>{complete ? "Quest ready" : `${Math.max(0, target - value)} remaining`}</span><span>{Math.min(value, target)}/{target}</span></div><div style={{ height: 8, borderRadius: 99, overflow: "hidden", background: "rgba(255,255,255,.1)" }}><div style={{ height: "100%", width: `${percent}%`, borderRadius: "inherit", background: complete ? "linear-gradient(90deg,#ffda76,#fff0b1)" : "linear-gradient(90deg,#7be2ff,#8b91ff)", transition: "width .32s ease" }} /></div></div>;
}
