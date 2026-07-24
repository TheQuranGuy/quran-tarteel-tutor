"use client";

import { motion } from "framer-motion";

export default function MascotFemale({ mood = "calm" }) {
  const energetic = mood === "energetic";

  return (
    <motion.div
      aria-label="Female cosmic Sheikh guide"
      animate={{ y: energetic ? [0, -8, 0] : [0, -3, 0], scale: energetic ? [1, 1.04, 1] : 1 }}
      transition={{ duration: energetic ? 1.2 : 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "grid", placeItems: "center", minHeight: 280 }}
    >
      <div style={{ position: "relative", width: 220, height: 260 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(183,151,255,.25), transparent 68%)", filter: "blur(6px)" }} />
        <div style={{ position: "absolute", left: 54, top: 14, width: 112, height: 136, borderRadius: "60px 60px 46px 46px", background: "linear-gradient(180deg,#d9c8ff,#5f4aa8)", boxShadow: "0 0 34px rgba(183,151,255,.4)" }} />
        <div style={{ position: "absolute", left: 75, top: 44, width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(145deg,#fff3d2,#cfa077)" }} />
        <div style={{ position: "absolute", left: 82, top: 70, width: 9, height: 9, borderRadius: "50%", background: "#26352f" }} />
        <div style={{ position: "absolute", right: 82, top: 70, width: 9, height: 9, borderRadius: "50%", background: "#26352f" }} />
        <div style={{ position: "absolute", left: 94, top: 93, width: 32, height: 8, borderRadius: 999, background: "rgba(38,53,47,.22)" }} />
        <div style={{ position: "absolute", left: 58, top: 124, width: 104, height: 122, borderRadius: "52px 52px 30px 30px", background: "linear-gradient(180deg,#f5efff,#6a56c9)", boxShadow: "inset 0 0 24px rgba(255,255,255,.25), 0 0 32px rgba(183,151,255,.32)" }} />
        <div style={{ position: "absolute", left: 66, top: 134, width: 88, height: 98, borderRadius: "44px 44px 28px 28px", border: "2px solid rgba(255,255,255,.24)" }} />
        {energetic && <motion.div style={{ position: "absolute", left: 28, top: 18, right: 28, bottom: 8, border: "2px solid rgba(255,243,156,.72)", borderRadius: "50%" }} animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1.3] }} transition={{ duration: 1.1, repeat: Infinity }} />}
      </div>
    </motion.div>
  );
}
