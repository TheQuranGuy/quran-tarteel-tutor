"use client";

import { motion } from "framer-motion";
import AudioPlayer from "./AudioPlayer";

export default function AyahTile({ ayah, mastered = false, onOpen }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      style={{
        display: "grid",
        gap: 10,
        padding: 14,
        border: mastered ? "1px solid rgba(121,229,170,.55)" : "1px solid rgba(189,242,208,.16)",
        borderRadius: 14,
        background: mastered ? "rgba(121,229,170,.12)" : "rgba(255,255,255,.05)",
      }}
    >
      <button type="button" onClick={onOpen} style={{ border: 0, padding: 0, color: "inherit", background: "transparent", textAlign: "left", cursor: "pointer" }}>
        <strong>Ayah {ayah.number}</strong>
        <p style={{ margin: "8px 0", fontSize: 28, lineHeight: 1.7, direction: "rtl", textAlign: "right", fontFamily: "Times New Roman, serif" }}>{ayah.arabic}</p>
        <p style={{ margin: 0, color: "#b2c6ba", lineHeight: 1.5 }}>{ayah.translation}</p>
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <AudioPlayer ayah={ayah} />
        <span style={{ color: mastered ? "#79e5aa" : "#fff39c", fontWeight: 900 }}>{mastered ? "Mastered" : "10 XP"}</span>
      </div>
    </motion.div>
  );
}
