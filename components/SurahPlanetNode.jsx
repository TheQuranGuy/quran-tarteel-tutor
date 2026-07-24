"use client";

import { motion } from "framer-motion";

export default function SurahPlanetNode({ surah, progress = 0, locked = false, completed = false, selected = false, onClick }) {
  const ring = `conic-gradient(#79e5aa ${progress}%, rgba(255,255,255,.12) ${progress}% 100%)`;

  return (
    <motion.button
      type="button"
      disabled={locked}
      onClick={onClick}
      whileHover={!locked ? { scale: 1.08, y: -6 } : undefined}
      whileTap={!locked ? { scale: 0.96 } : undefined}
      animate={{ y: [0, -5, 0], boxShadow: completed ? ["0 0 18px rgba(121,229,170,.35)", "0 0 34px rgba(121,229,170,.58)", "0 0 18px rgba(121,229,170,.35)"] : "0 0 20px rgba(121,229,170,.22)" }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, boxShadow: { duration: 2.2, repeat: Infinity } }}
      style={{
        position: "relative",
        width: 148,
        minHeight: 148,
        border: selected ? "2px solid #fff39c" : "1px solid rgba(189,242,208,.22)",
        borderRadius: "50%",
        color: locked ? "rgba(244,249,245,.45)" : "#f4f9f5",
        background: locked ? "rgba(255,255,255,.04)" : ring,
        padding: 8,
        cursor: locked ? "not-allowed" : "pointer",
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: "100%", height: 130, borderRadius: "50%", background: completed ? "radial-gradient(circle,#fff39c,#42bc83 58%,#143f35)" : "radial-gradient(circle,#d8fff0,#3f8dd9 58%,#1d2461)" }}>
        <strong>{surah.name}</strong>
        <small>Surah {surah.id}</small>
      </span>
    </motion.button>
  );
}
