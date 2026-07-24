"use client";

export default function EventProgress({ value, target, complete }) {
  const percent = Math.min(100, Math.round((value / target) * 100));
  return <div style={{ display: "grid", gap: 7 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "#c1d1e8", fontSize: 12, fontWeight: 800 }}><span>{complete ? "Ready to unlock" : `${Math.max(0, target - value)} remaining`}</span><span>{Math.min(value, target)}/{target}</span></div><div style={{ height: 8, borderRadius: 99, overflow: "hidden", background: "rgba(255,255,255,.11)" }}><div style={{ width: `${percent}%`, height: "100%", borderRadius: "inherit", background: complete ? "linear-gradient(90deg,#ffe078,#fff2b1)" : "linear-gradient(90deg,#79e6ff,#aa92ff)", transition: "width .3s ease" }} /></div></div>;
}
