"use client";

import { motion } from "framer-motion";

const COLORS = ["#87efd0", "#aab9ff", "#ffbdcf", "#ffe29b", "#88d5ff"];

export default function StoryChapterCard({ chapter, index, progress, selected, onClick }) {
  const accent = COLORS[index % COLORS.length];
  const percent = progress?.percent || 0;
  return <motion.button className="cd-story-chapter-card"
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    whileHover={{ y: -4, scale: 1.015 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    style={{
      flex: "0 0 168px",
      minHeight: 112,
      padding: 13,
      textAlign: "left",
      scrollSnapAlign: "start",
      cursor: "pointer",
      border: selected ? `1px solid ${accent}` : "1px solid rgba(188,215,255,.16)",
      borderRadius: 18,
      color: "#eef6ff",
      background: selected ? `linear-gradient(145deg,${accent}29,rgba(14,21,61,.9))` : "rgba(11,18,52,.56)",
      boxShadow: selected ? `0 0 0 3px ${accent}12, 0 15px 30px ${accent}18` : "none",
    }}
  >
    <span style={{ display: "block", color: accent, fontSize: 11, fontWeight: 900, letterSpacing: ".1em" }}>CHAPTER {chapter.id}</span>
    <strong style={{ display: "block", margin: "5px 0", fontSize: 15 }}>{chapter.name}</strong>
    <span style={{ display: "block", minHeight: 28, color: "#b9cae4", fontSize: 11, lineHeight: 1.3 }}>{chapter.theme}</span>
    <span style={{ display: "block", height: 4, marginTop: 9, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,.12)" }}><span style={{ display: "block", width: `${percent}%`, height: "100%", borderRadius: 999, background: accent }} /></span>
  </motion.button>;
}
