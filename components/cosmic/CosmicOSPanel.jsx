"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COSMIC_OS_EMPTY_ANALYTICS, COSMIC_OS_EVENT, getCosmicAnalytics, getCosmicOSInsight } from "../../lib/cosmic-os";
import { useCosmicUser } from "./useCosmicUser";
import CosmicCompanion from "./CosmicCompanion";

function meter(value, color) {
  return <div className="cd-meter" style={{ height: 7, overflow: "hidden", borderRadius: 99, background: "rgba(225,239,255,.12)" }}><div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", borderRadius: "inherit", background: color, boxShadow: `0 0 12px ${color}` }} /></div>;
}

export default function CosmicOSPanel({ user: userProp, compact = false, className = "" }) {
  const storedUser = useCosmicUser();
  const user = userProp || storedUser;
  const [analytics, setAnalytics] = useState(COSMIC_OS_EMPTY_ANALYTICS);

  useEffect(() => {
    const refresh = () => setAnalytics(getCosmicAnalytics());
    refresh();
    window.addEventListener(COSMIC_OS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(COSMIC_OS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const insight = useMemo(() => getCosmicOSInsight(user, analytics), [analytics, user]);
  const { difficulty, gaps, reviewQueue, recommendation } = insight;
  const goal = Math.max(1, Number(user?.dailyGoal) || 10);
  const dailyProgress = Math.round(Math.min(100, ((Number(user?.dailyXp) || 0) / goal) * 100));

  return <section className={`${className} cd-os-panel`} aria-label="Cosmic Learning OS" style={{ display: "grid", gap: 13, padding: compact ? 13 : 18, border: "1px solid rgba(166,207,255,.22)", borderRadius: compact ? 22 : 28, color: "#edf6ff", background: "linear-gradient(145deg,rgba(13,23,66,.88),rgba(7,10,35,.94))", boxShadow: "0 22px 60px rgba(0,0,0,.3)" }}>
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><div><p style={{ margin: 0, color: "#9ecbff", fontSize: 11, fontWeight: 950, letterSpacing: ".13em" }}>COSMIC LEARNING OS</p><h2 style={{ margin: "5px 0 0", fontSize: compact ? 17 : 21 }}>Your adaptive orbit</h2></div><span style={{ padding: "7px 9px", border: `1px solid ${difficulty.color}66`, borderRadius: 99, color: difficulty.color, fontSize: 11, fontWeight: 900 }}>{difficulty.level}</span></header>
    <CosmicCompanion user={user} insight={insight} compact={compact} />
    {!compact ? <><div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}><div style={{ padding: 12, borderRadius: 16, background: "rgba(255,255,255,.045)" }}><small style={{ color: "#b5c8e8" }}>Mastery</small><strong style={{ display: "block", margin: "3px 0 8px", fontSize: 21 }}>{gaps.masteryPercent}%</strong>{meter(gaps.masteryPercent, "#8debd1")}</div><div style={{ padding: 12, borderRadius: 16, background: "rgba(255,255,255,.045)" }}><small style={{ color: "#b5c8e8" }}>Today's goal</small><strong style={{ display: "block", margin: "3px 0 8px", fontSize: 21 }}>{user?.dailyXp || 0}/{goal} XP</strong>{meter(dailyProgress, "#ffd981")}</div></div><div style={{ padding: 12, borderRadius: 16, background: "rgba(255,255,255,.045)" }}><small style={{ display: "block", color: "#b5c8e8" }}>WHY THIS NEXT STEP</small><p style={{ margin: "5px 0 0", color: "#d7e4f7", fontSize: 13, lineHeight: 1.45 }}>{recommendation.reason}</p><p style={{ margin: "7px 0 0", color: difficulty.color, fontSize: 12 }}>{difficulty.transparentReason}</p></div><footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}><span style={{ color: "#b5c8e8", fontSize: 12 }}>{reviewQueue.length ? `${reviewQueue.length} review signal${reviewQueue.length === 1 ? "" : "s"}` : `${gaps.weakAyahs} weak ayahs tracked`}</span><Link href="/cosmic/path" style={{ color: "#bceaff", fontSize: 12, fontWeight: 900, textDecoration: "none" }}>View path &rarr;</Link></footer></> : null}
  </section>;
}
