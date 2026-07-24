"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import WorldGlyph from "./WorldGlyph";
import WorldStatus from "./WorldStatus";

export default function WorldPanel({ world }) {
  const reduceMotion = useReducedMotion();

  return <AnimatePresence mode="wait">
    <motion.aside
      key={world.id}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="cd-world-panel"
      style={{ display: "grid", alignContent: "space-between", gap: 24, minHeight: 344, padding: "clamp(21px,4vw,32px)", border: `1px solid ${world.accent}55`, borderRadius: 28, background: `radial-gradient(circle at 86% 4%,${world.glow},transparent 34%),rgba(10,16,51,.8)`, boxShadow: `0 22px 60px ${world.glow}26` }}
    >
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}><span style={{ display: "grid", width: 54, height: 54, placeItems: "center", borderRadius: 18, background: `${world.accent}15`, border: `1px solid ${world.accent}44` }}><WorldGlyph kind={world.icon} color={world.accent} /></span><span style={{ color: world.accent, fontSize: 12, fontWeight: 900, letterSpacing: ".12em" }}>SELECTED WORLD</span></div>
        <div><h2 style={{ margin: 0, fontSize: "clamp(1.6rem,4vw,2.45rem)", letterSpacing: "-.045em" }}>{world.name}</h2><p style={{ margin: "10px 0 0", color: "#c1d2e8", lineHeight: 1.6 }}>{world.description}</p></div>
      </div>
      <div style={{ display: "grid", gap: 15 }}>
        <WorldStatus label={world.metricLabel} value={world.metricValue} progress={world.progress} accent={world.accent} />
        <Link href={world.href} className="cosmic-button" style={{ justifySelf: "start", color: "#10203a", background: `linear-gradient(135deg,${world.accent},#f6df98)`, textDecoration: "none", boxShadow: `0 14px 30px ${world.glow}` }}>Enter {world.name}</Link>
      </div>
    </motion.aside>
  </AnimatePresence>;
}
