"use client";

import { motion } from "framer-motion";

export default function MascotMale({ mood = "calm" }) {
  const energetic = mood === "energetic";

  return (
    <motion.div
      aria-label="Male cosmic Sheikh guide"
      animate={{ y: energetic ? [0, -8, 0] : [0, -3, 0], scale: energetic ? [1, 1.04, 1] : 1 }}
      transition={{ duration: energetic ? 1.2 : 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "grid", placeItems: "center", minHeight: 280 }}
    >
      <div style={{ position: "relative", width: 220, height: 260 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(121,229,170,.24), transparent 68%)", filter: "blur(6px)" }} />
        <div style={{ position: "absolute", left: 57, top: 18, width: 106, height: 106, borderRadius: "50%", background: "linear-gradient(145deg,#fff9d8,#c89f72)", boxShadow: "0 0 34px rgba(255,244,178,.42)" }} />
        <div style={{ position: "absolute", left: 46, top: 18, width: 128, height: 46, borderRadius: "50% 50% 38% 38%", background: "#f7fbff", boxShadow: "0 0 24px rgba(255,255,255,.42)" }} />
        <div style={{ position: "absolute", left: 75, top: 54, width: 70, height: 26, borderRadius: 999, background: "rgba(66,51,42,.22)" }} />
        <div style={{ position: "absolute", left: 72, top: 62, width: 10, height: 10, borderRadius: "50%", background: "#24342d" }} />
        <div style={{ position: "absolute", right: 72, top: 62, width: 10, height: 10, borderRadius: "50%", background: "#24342d" }} />
        <div style={{ position: "absolute", left: 70, top: 118, width: 82, height: 118, borderRadius: "44px 44px 28px 28px", background: "linear-gradient(180deg,#eafff4,#3f8d74)", boxShadow: "inset 0 0 24px rgba(255,255,255,.25), 0 0 32px rgba(121,229,170,.32)" }} />
        <div style={{ position: "absolute", left: 58, top: 118, width: 106, height: 128, borderRadius: "54px 54px 34px 34px", border: "2px solid rgba(255,255,255,.28)" }} />
        {energetic && <motion.div style={{ position: "absolute", left: 30, top: 20, right: 30, bottom: 8, border: "2px solid rgba(255,243,156,.7)", borderRadius: "50%" }} animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1.3] }} transition={{ duration: 1.1, repeat: Infinity }} />}
      </div>
    </motion.div>
  );
}
