"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChallengeSummary({ result, streak, onLeaderboard }) {
  const router = useRouter();
  const accuracy = result.total ? Math.round((result.score / result.total) * 100) : 0;

  return <motion.section initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 250, damping: 24 }} className="cosmic-bright-card cosmic-challenge-card" style={{ padding: "clamp(24px,6vw,48px)", borderRadius: 28, textAlign: "center" }}>
    <div aria-hidden="true" style={{ fontSize: 64, filter: "drop-shadow(0 0 24px #ffc76f)" }}>{accuracy >= 80 ? "✦" : "☾"}</div>
    <p className="cosmic-review-label" style={{ margin: "6px 0", color: "#ffd98b", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC TRIAL COMPLETE</p>
    <h1 style={{ margin: "0 0 8px", fontSize: "clamp(2.3rem,7vw,4.6rem)", letterSpacing: "-.06em" }}>{result.timedOut ? "Time slipped away." : "Your result is in."}</h1>
    <p style={{ margin: "0 0 24px", color: "#c7d6ec" }}>Every attempt strengthens your memory orbit.</p>
    <div className="cosmic-challenge-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginBottom: 26 }}>
      {[{ label: "Correct", value: `${result.score}/${result.total}` }, { label: "Accuracy", value: `${accuracy}%` }, { label: "XP gained", value: `+${result.xp}` }].map((item) => <div key={item.label} style={{ padding: "14px 8px", borderRadius: 15, background: "rgba(255,255,255,.07)" }}><strong style={{ display: "block", fontSize: 20, color: "#f5fbff" }}>{item.value}</strong><span style={{ color: "#b8c9e4", fontSize: 12 }}>{item.label}</span></div>)}
    </div>
    <p style={{ margin: "0 0 22px", color: "#ffdc88", fontWeight: 800 }}>🔥 Your current streak: {streak} days</p>
    <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}><button type="button" onClick={onLeaderboard} className="cosmic-button cosmic-button--outline">View leaderboard</button><button type="button" onClick={() => router.push("/cosmic/path")} className="cosmic-button">Return to path</button></div>
  </motion.section>;
}
