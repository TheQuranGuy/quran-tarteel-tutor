"use client";

import { motion } from "framer-motion";

export default function StoryProgress({ chapter, progress, accent }) {
  return <header className="cd-story-progress" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
    <div>
      <p style={{ margin: 0, color: accent, fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>CHAPTER {chapter.id}</p>
      <h2 style={{ margin: "6px 0", fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-.055em", lineHeight: .98 }}>{chapter.name}</h2>
      <p style={{ margin: 0, color: "#bdcee7", lineHeight: 1.55 }}>{chapter.theme}</p>
    </div>
    <div style={{ minWidth: 145, padding: "12px 14px", borderRadius: 16, border: `1px solid ${accent}55`, background: `${accent}12` }}>
      <strong style={{ display: "block", color: accent, fontSize: 23 }}>{progress.percent}%</strong>
      <span style={{ color: "#c0d0e8", fontSize: 12 }}>{progress.complete} of {progress.total} fragments restored</span>
      <span style={{ display: "block", height: 5, overflow: "hidden", borderRadius: 99, marginTop: 9, background: "rgba(255,255,255,.13)" }}><motion.i initial={{ width: 0 }} animate={{ width: `${progress.percent}%` }} transition={{ duration: .55 }} style={{ display: "block", height: "100%", borderRadius: 99, background: accent }} /></span>
    </div>
  </header>;
}
