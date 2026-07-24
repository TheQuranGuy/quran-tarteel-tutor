"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function StoryLorePanel({ chapter, progress, accent }) {
  const nextAyah = Math.min(chapter.ayahCount, Math.max(1, progress.complete + 1));
  return <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 }} className="cosmic-bright-card cd-story-lore" style={{ padding: 20, borderRadius: 25, display: "grid", gap: 14 }}>
    <div style={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 16, color: "#071126", background: accent, boxShadow: `0 0 26px ${accent}66` }}>*</div>
    <div>
      <p style={{ margin: 0, color: accent, fontWeight: 900, fontSize: 12, letterSpacing: ".13em" }}>CHAPTER NOTE</p>
      <h3 style={{ margin: "7px 0", fontSize: 23 }}>A world shaped by {chapter.theme.toLowerCase()}.</h3>
      <p style={{ margin: 0, color: "#c4d3e8", lineHeight: 1.65, fontSize: 14 }}>Move through this chapter one ayah at a time. The lesson route remains the source of practice, audio, meaning, and memorisation work.</p>
    </div>
    <div style={{ padding: 14, borderRadius: 17, background: "rgba(255,255,255,.055)", border: "1px solid rgba(195,219,255,.14)" }}>
      <strong style={{ color: "#ecf5ff", fontSize: 13 }}>Your next fragment</strong>
      <p style={{ margin: "5px 0 0", color: "#b8cae3", fontSize: 13 }}>Ayah {nextAyah} is ready when you are.</p>
    </div>
    <div style={{ display: "grid", gap: 8 }}>
      <Link href={`/cosmic/lessons/${chapter.id}/${nextAyah}`} className="cosmic-button cosmic-button--mint" style={{ textAlign: "center" }}>Continue chapter</Link>
      <Link href="/cosmic/review" className="cosmic-button cosmic-button--outline" style={{ textAlign: "center" }}>Review memory fragments</Link>
    </div>
  </motion.aside>;
}
