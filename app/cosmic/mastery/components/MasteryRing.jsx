"use client";

import { motion } from "framer-motion";

export default function MasteryRing({ value, size = 92, label = "Mastery" }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value || 0)));
  const glow = safeValue >= 100 ? "rgba(255,219,116,.8)" : safeValue >= 60 ? "rgba(117,232,199,.55)" : "rgba(118,181,255,.38)";
  return <motion.div animate={{ boxShadow: `0 0 ${safeValue >= 100 ? 24 : 15}px ${glow}` }} style={{ width: size, height: size, display: "grid", placeItems: "center", flex: "0 0 auto", borderRadius: "50%", background: `conic-gradient(${safeValue >= 100 ? "#ffdb79" : "#86e7cd"} ${safeValue * 3.6}deg, rgba(255,255,255,.1) 0deg)`, padding: 5 }}><div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", borderRadius: "50%", color: "#eff8ff", textAlign: "center", background: "#101b3e" }}><strong style={{ fontSize: Math.max(16, size * .23) }}>{safeValue}%</strong><small style={{ color: "#adc1df", fontSize: Math.max(9, size * .1) }}>{label}</small></div></motion.div>;
}
