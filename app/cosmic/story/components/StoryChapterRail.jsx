"use client";

import { motion, useReducedMotion } from "framer-motion";
import StoryChapterCard from "./StoryChapterCard";

export default function StoryChapterRail({ chapters, selectedId, progressByChapter, onSelect }) {
  const reduceMotion = useReducedMotion();
  return <section aria-label="Cosmic chapters" className="cosmic-bright-card cd-story-rail" style={{ padding: 12, borderRadius: 23, overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "2px 6px 11px" }}>
      <strong style={{ fontSize: 14, color: "#eaf4ff" }}>Choose a chapter</strong>
      <span style={{ color: "#aebfdc", fontSize: 12 }}>114 Surah worlds</span>
    </div>
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ display: "flex", gap: 10, overflowX: "auto", padding: "2px 4px 10px", scrollSnapType: "x proximity" }}
    >
      {chapters.map((chapter, index) => <StoryChapterCard key={chapter.id} chapter={chapter} index={index} selected={chapter.id === selectedId} progress={progressByChapter.get(chapter.id)} onClick={() => onSelect(chapter.id)} />)}
    </motion.div>
  </section>;
}
