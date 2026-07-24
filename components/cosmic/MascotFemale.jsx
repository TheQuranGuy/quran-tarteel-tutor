"use client";

import { motion } from "framer-motion";

export default function MascotFemale({ energetic = false, compact = false }) {
  const size = compact ? 100 : 154;
  return <motion.div className="cd-mascot cd-mascot--female" aria-label="Female cosmic Sheikh guide" animate={energetic ? { y: [0, -8, 0], rotate: [0, -1, 1, 0] } : { y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: energetic ? 1 : 2.6 }} style={{ position: "relative", width: size, height: size + 18, margin: "auto", filter: "drop-shadow(0 0 20px rgba(211,145,255,.5))" }}>
    <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "radial-gradient(circle,rgba(219,146,255,.34),transparent 65%)" }} />
    <div style={{ position: "absolute", top: 20, left: "50%", width: size * .45, height: size * .49, transform: "translateX(-50%)", borderRadius: "52% 52% 44% 44%", background: "#6a3d88", border: "3px solid #e8cbff" }} />
    <div style={{ position: "absolute", top: 43, left: "50%", width: size * .3, height: size * .31, transform: "translateX(-50%)", borderRadius: "48%", background: "#9b705d" }} />
    <div style={{ position: "absolute", bottom: 4, left: "50%", width: size * .64, height: size * .62, transform: "translateX(-50%)", borderRadius: "48% 48% 20% 20%", background: "linear-gradient(145deg,#6d2a83,#21103d)", border: "2px solid rgba(237,190,255,.7)" }} />
    <div style={{ position: "absolute", top: size * .46, left: "50%", width: 17, height: 7, transform: "translateX(-50%)", borderBottom: "2px solid #3a1f1a", borderRadius: "50%" }} />
  </motion.div>;
}
