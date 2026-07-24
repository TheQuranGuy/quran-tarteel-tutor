"use client";

export default function DailyGoalBar({ user }) {
  const goal = user?.dailyGoal || 10;
  const value = user?.dailyXp || 0;
  const percent = Math.min(100, Math.round((value / goal) * 100));
  return <div style={{ minWidth: 190 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10, color: "#d7e7df", fontSize: 13, fontWeight: 800 }}><span>Daily goal</span><span>{value}/{goal} XP</span></div><div style={{ height: 9, marginTop: 8, overflow: "hidden", borderRadius: 99, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${percent}%`, height: "100%", borderRadius: "inherit", background: "linear-gradient(90deg,#67e8f9,#a7f3d0)" }} /></div>{percent >= 100 ? <small style={{ display: "block", marginTop: 6, color: "#a7f3d0", fontWeight: 800 }}>Goal complete!</small> : null}</div>;
}
