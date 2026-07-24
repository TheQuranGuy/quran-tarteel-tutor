"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AyahTile({ ayah, surahId, mastered, weak }) {
  const router = useRouter();
  return <motion.button className="cd-path-ayah" type="button" onClick={() => router.push(`/cosmic/lessons/${surahId}/${ayah.number}`)} whileHover={{ x: 4, y: -2 }} whileTap={{ scale: .985 }} style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) auto", gap: 10, alignItems: "center", width: "100%", padding: 12, border: mastered ? "1px solid rgba(139,244,195,.64)" : "1px solid rgba(183,210,255,.2)", borderRadius: 15, cursor: "pointer", color: "#eaf5ff", background: mastered ? "rgba(34,139,103,.22)" : "rgba(255,255,255,.055)", textAlign: "left" }}>
    <span style={{ width: 33, height: 33, display: "grid", placeItems: "center", borderRadius: "50%", color: "#0c1a31", background: mastered ? "#9ff2ca" : "#bfc5ff", fontWeight: 950 }}>{ayah.number}</span>
    <span>{ayah.arabic ? <span dir="rtl" style={{ display: "block", fontFamily: "serif", fontSize: 22, textAlign: "right" }}>{ayah.arabic}</span> : <strong style={{ display: "block", color: "#e5efff" }}>Ayah {ayah.number}</strong>}<small style={{ color: "#bfccdf" }}>{ayah.preview ? "Tap to load the full Arabic, translation, and audio lesson." : ayah.translation}</small></span>
    <span style={{ color: weak ? "#ffd983" : mastered ? "#9ff2ca" : "#a8c7e7", fontWeight: 850 }}>{weak ? "Review" : mastered ? "Done" : "Start"}</span>
  </motion.button>;
}
