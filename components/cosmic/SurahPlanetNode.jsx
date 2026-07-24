"use client";

import { motion } from "framer-motion";

export default function SurahPlanetNode({ unit, progress, locked, selected, onClick }) {
  const percent = progress?.percent || 0;
  return <motion.button type="button" onClick={onClick} disabled={locked} whileHover={!locked ? { scale: 1.07, y: -5 } : {}} whileTap={!locked ? { scale: .96 } : {}} style={{ position: "relative", zIndex: 2, width: 172, minHeight: 172, padding: 14, borderRadius: "50%", border: selected ? "3px solid #e8f6ff" : "2px solid rgba(152,228,255,.52)", cursor: locked ? "not-allowed" : "pointer", color: "#fff", background: locked ? "#263240" : "radial-gradient(circle at 32% 26%,#8cefff 0 5%,#3e72d5 26%,#162a71 64%,#0a113e 100%)", opacity: locked ? .48 : 1, boxShadow: selected ? "0 0 0 8px rgba(130,236,255,.16),0 0 34px rgba(105,214,255,.84)" : "0 0 24px rgba(96,181,255,.42)", textAlign: "center" }}>
    <span style={{ position: "absolute", inset: 7, borderRadius: "inherit", border: "3px solid rgba(211,255,235,.75)", clipPath: `inset(0 ${100 - percent}% 0 0 round 50%)`, transform: "rotate(-90deg)" }} />
    <span style={{ display: "block", fontSize: 25 }} aria-hidden="true">{locked ? "LOCK" : percent === 100 ? "DONE" : "SURAH"}</span>
    <strong style={{ display: "block", marginTop: 9, fontSize: 17 }}>{unit.name}</strong>
    <small style={{ display: "block", marginTop: 5, color: "#d8f6ff" }}>{locked ? "Complete the last world" : `${percent}% learned`}</small>
  </motion.button>;
}
