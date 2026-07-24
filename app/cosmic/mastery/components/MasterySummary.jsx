"use client";

import { useRouter } from "next/navigation";
import MasteryRing from "./MasteryRing";

export default function MasterySummary({ result, streak, onBack }) {
  const router = useRouter();
  return <section className="cosmic-bright-card" style={{ padding: "clamp(24px,6vw,48px)", borderRadius: 28, textAlign: "center" }}><div style={{ display: "flex", justifyContent: "center", gap: 22, alignItems: "center", marginBottom: 22 }}><MasteryRing value={result.before} size={90} label="Before" /><span style={{ color: "#ffde8b", fontSize: 30 }}>→</span><MasteryRing value={result.after} size={112} label="After" /></div><p style={{ margin: 0, color: "#ffdb8b", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>MASTERY TEST COMPLETE</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.2rem,7vw,4.5rem)", letterSpacing: "-.06em" }}>Your constellation changed.</h1><p style={{ color: "#c5d5eb", lineHeight: 1.6 }}>You answered {result.correct}/{result.total} correctly and gained +{result.xp} XP for newly mastered ayahs.</p><p style={{ color: "#ffdc8c", fontWeight: 850 }}>🔥 Current streak: {streak} days</p><div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 24 }}><button type="button" onClick={onBack} className="cosmic-button cosmic-button--outline">Back to mastery</button><button type="button" onClick={() => router.push("/cosmic/path")} className="cosmic-button">Return to path</button></div></section>;
}
