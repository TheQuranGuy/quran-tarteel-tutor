"use client";

import { motion } from "framer-motion";

export default function MascotMale({ energetic = false, compact = false }) {
  const size = compact ? 100 : 154;
  return <motion.div className="cd-mascot cd-mascot--male" aria-label="Male cosmic Sheikh guide" animate={energetic ? { y: [0, -8, 0], rotate: [0, 1, -1, 0] } : { y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: energetic ? 1 : 2.6 }} style={{ position: "relative", width: size, height: size + 18, margin: "auto", filter: "drop-shadow(0 0 20px rgba(111,231,255,.5))" }}>
    <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,236,255,.3),transparent 65%)" }} />
    <div style={{ position: "absolute", top: 23, left: "50%", width: size * .38, height: size * .38, transform: "translateX(-50%)", borderRadius: "48% 48% 45% 45%", background: "#8c624c", border: "4px solid #f8e2d0" }} />
    <div style={{ position: "absolute", top: 12, left: "50%", width: size * .46, height: size * .18, transform: "translateX(-50%)", borderRadius: "50% 50% 35% 35%", background: "#effcff" }} />
    <div style={{ position: "absolute", bottom: 4, left: "50%", width: size * .64, height: size * .62, transform: "translateX(-50%)", borderRadius: "48% 48% 20% 20%", background: "linear-gradient(145deg,#244a85,#11244e)", border: "2px solid rgba(147,236,255,.62)" }} />
    <div style={{ position: "absolute", top: size * .43, left: "50%", width: 17, height: 7, transform: "translateX(-50%)", borderBottom: "2px solid #3a1f1a", borderRadius: "50%" }} />
  </motion.div>;
}
