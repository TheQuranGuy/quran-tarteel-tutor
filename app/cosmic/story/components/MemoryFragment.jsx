"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MemoryFragment({ ayah, index, accent, mastered, weak, reduceMotion }) {
  const state = mastered ? "Restored" : weak ? "Needs review" : "Ready";
  const stateColor = mastered ? "#9df2d2" : weak ? "#ffbdd5" : "#bbcdf0";
  return <motion.div className="cd-story-fragment"
    initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 14 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.035, .45), type: "spring", stiffness: 260, damping: 22 }}
    style={{ position: "relative", zIndex: 1 }}
  >
    <Link
      href={`/cosmic/lessons/${ayah.surahId}/${ayah.number}`}
      style={{
        display: "grid",
        minHeight: 118,
        alignContent: "space-between",
        padding: 13,
        borderRadius: 18,
        textDecoration: "none",
        color: "#f2f7ff",
        border: `1px solid ${mastered ? accent : "rgba(193,218,255,.18)"}`,
        background: mastered ? `linear-gradient(145deg,${accent}22,rgba(14,21,61,.88))` : "rgba(8,15,47,.72)",
        boxShadow: mastered ? `0 0 25px ${accent}22` : "0 10px 24px rgba(0,0,0,.14)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}><span style={{ color: accent, fontSize: 11, fontWeight: 900, letterSpacing: ".1em" }}>FRAGMENT {ayah.number}</span><span style={{ width: 9, height: 9, borderRadius: 99, background: stateColor, boxShadow: `0 0 11px ${stateColor}` }} /></span>
      <strong style={{ fontSize: 15 }}>Ayah {ayah.number}</strong>
      <span style={{ color: stateColor, fontSize: 11, fontWeight: 800 }}>{state}</span>
    </Link>
  </motion.div>;
}
