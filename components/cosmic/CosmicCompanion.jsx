"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { COSMIC_OS_EMPTY_ANALYTICS, COSMIC_OS_EVENT, deriveCompanionMessage, getCosmicAnalytics, getCosmicOSInsight } from "../../lib/cosmic-os";
import MascotFemale from "./MascotFemale";
import MascotMale from "./MascotMale";
import { useCosmicUser } from "./useCosmicUser";

const ACCENTS = {
  review: { main: "#c9a8ff", soft: "rgba(201,168,255,.22)" },
  lesson: { main: "#8debd1", soft: "rgba(141,235,209,.22)" },
  mastery: { main: "#9ecbff", soft: "rgba(158,203,255,.22)" },
  challenge: { main: "#ffd981", soft: "rgba(255,217,129,.22)" },
};

export default function CosmicCompanion({ user: userProp, insight: insightProp, compact = false, showAction = true, className = "" }) {
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

  const insight = useMemo(() => insightProp || getCosmicOSInsight(user, analytics), [analytics, insightProp, user]);
  const companion = useMemo(() => deriveCompanionMessage(user, insight), [insight, user]);
  const recommendation = insight.recommendation;
  const colors = ACCENTS[recommendation?.kind] || ACCENTS.lesson;
  const Mascot = user?.cosmicGuide === "female" ? MascotFemale : MascotMale;
  const energetic = companion.mood === "celebrate" || companion.mood === "curious";

  return <motion.aside className={`${className} cd-companion`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={compact ? undefined : { y: -3 }} transition={{ type: "spring", stiffness: 180, damping: 19 }} aria-label="Cosmic companion recommendation" style={{ position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: compact ? "72px minmax(0,1fr)" : "112px minmax(0,1fr)", gap: compact ? 10 : 16, alignItems: "center", padding: compact ? 12 : 18, border: `1px solid ${colors.main}55`, borderRadius: compact ? 20 : 26, color: "#eff7ff", background: `radial-gradient(circle at 0% 10%,${colors.soft},transparent 40%),linear-gradient(140deg,rgba(19,30,78,.94),rgba(10,14,47,.9))`, boxShadow: `0 18px 46px ${colors.soft}` }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: "auto -12% -85% auto", width: 180, height: 180, borderRadius: "50%", border: `1px solid ${colors.main}44`, boxShadow: `0 0 35px ${colors.soft}` }} />
    <div style={{ position: "relative", zIndex: 1, transform: compact ? "scale(.72)" : undefined, transformOrigin: "center" }}><Mascot compact={compact} energetic={energetic} /></div>
    <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, color: colors.main, fontSize: 11, fontWeight: 950, letterSpacing: ".13em" }}>{companion.eyebrow}</p>
      <h2 style={{ margin: "5px 0 6px", fontSize: compact ? 16 : 21, lineHeight: 1.12 }}>{companion.title}</h2>
      {!compact ? <p style={{ margin: 0, color: "#c6d5ed", fontSize: 14, lineHeight: 1.52 }}>{companion.message}</p> : null}
      {showAction && recommendation?.href ? <Link href={recommendation.href} style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: compact ? 8 : 13, padding: compact ? "7px 10px" : "9px 12px", borderRadius: 12, color: "#081329", background: colors.main, textDecoration: "none", fontSize: compact ? 12 : 13, fontWeight: 950, boxShadow: `0 8px 20px ${colors.soft}` }}>{recommendation.actionLabel}<span aria-hidden="true">&rarr;</span></Link> : null}
    </div>
  </motion.aside>;
}
