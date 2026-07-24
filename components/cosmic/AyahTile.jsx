"use client";

import { motion } from "framer-motion";

export default function AyahTile({ ayah, mastered, onOpen }) {
  return <motion.button type="button" onClick={onOpen} whileHover={{ x: 5 }} whileTap={{ scale: .99 }} style={{ width: "100%", padding: 15, display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, alignItems: "center", border: "1px solid rgba(163,230,255,.22)", borderRadius: 15, color: "#edf8ff", background: mastered ? "rgba(58,170,117,.16)" : "rgba(7,20,52,.68)", textAlign: "left", cursor: "pointer" }}>
    <span style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: "50%", background: mastered ? "#55bd82" : "#28416f", fontWeight: 900 }}>{mastered ? "OK" : ayah.number}</span>
    <span><span dir="rtl" style={{ display: "block", fontFamily: "serif", fontSize: 24, textAlign: "right" }}>{ayah.arabic}</span><small style={{ display: "block", marginTop: 6, color: "#b7cce0" }}>{ayah.translation}</small></span>
    <span style={{ color: "#9ff4c5", fontWeight: 900 }}>{mastered ? "Mastered" : "Start"}</span>
  </motion.button>;
}
