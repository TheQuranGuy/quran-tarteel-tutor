"use client";

import { motion, useReducedMotion } from "framer-motion";
import WorldNode from "./WorldNode";

export default function WorldMap({ worlds, selectedId, onSelect }) {
  const reduceMotion = useReducedMotion();

  return <section aria-label="Cosmic worlds map" className="cd-world-map" style={{ position: "relative", minHeight: 420, overflow: "hidden", borderRadius: 30, border: "1px solid rgba(169,219,255,.19)", background: "radial-gradient(circle at 50% 50%,rgba(137,115,255,.2),transparent 24%),radial-gradient(circle at 16% 14%,rgba(88,220,255,.13),transparent 24%),rgba(6,11,37,.64)", boxShadow: "inset 0 0 80px rgba(75,106,255,.08),0 26px 66px rgba(0,0,0,.26)" }}>
    <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", width: "76%", aspectRatio: "1", left: "12%", top: "8%", borderRadius: "50%", border: "1px solid rgba(159,211,255,.16)", boxShadow: "0 0 45px rgba(117,142,255,.12)" }} />
    <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 78, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", width: "48%", aspectRatio: "1", left: "26%", top: "22%", borderRadius: "50%", border: "1px dashed rgba(245,211,134,.28)" }} />
    <div aria-hidden="true" style={{ position: "absolute", width: 86, aspectRatio: "1", left: "calc(50% - 43px)", top: "calc(50% - 43px)", borderRadius: "50%", background: "radial-gradient(circle at 35% 32%,#fff7c1 0 6%,#f0b557 24%,#9952c8 58%,rgba(52,37,117,.3) 72%)", boxShadow: "0 0 48px rgba(244,182,91,.74),0 0 110px rgba(127,91,255,.38)" }} />
    <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(3,minmax(118px,1fr))", alignItems: "center", minHeight: 420, gap: "clamp(14px,3vw,38px)", padding: "clamp(30px,6vw,55px) clamp(16px,5vw,64px)" }}>
      {worlds.map((world) => <WorldNode key={world.id} world={world} active={selectedId === world.id} onSelect={onSelect} />)}
    </div>
  </section>;
}
