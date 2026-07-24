"use client";

export default function ReviewProgressBar({ current, total }) {
  const value = total ? Math.round((current / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#bed0eb", fontSize: 13, fontWeight: 800 }}><span>Review progress</span><span>{current}/{total}</span></div>
      <div className="cosmic-review-progress-bar" style={{ height: 9, marginTop: 7, overflow: "hidden", borderRadius: 99, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${value}%`, height: "100%", borderRadius: "inherit", background: "linear-gradient(90deg,#ffd98b,#9ff2ca)", transition: "width .3s ease" }} /></div>
    </div>
  );
}
