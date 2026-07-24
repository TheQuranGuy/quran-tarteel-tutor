"use client";

import { motion } from "framer-motion";

export default function TutorMessage({ message, children }) {
  const tutor = message.role === "tutor";
  return <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} style={{ display: "grid", gridTemplateColumns: tutor ? "38px minmax(0,1fr)" : "minmax(0,1fr)", gap: 9, justifyItems: tutor ? "start" : "end" }}><span aria-hidden="true" className="cosmic-tutor-avatar" style={{ display: tutor ? "grid" : "none", width: 38, height: 38, placeItems: "center", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff2b4,#7857cb)", boxShadow: "0 0 16px rgba(188,157,255,.55)" }}>🧕</span><div className={`cosmic-tutor-message ${tutor ? "" : "is-user"}`} style={{ maxWidth: "min(600px,100%)", padding: "12px 14px", borderRadius: tutor ? "16px 16px 16px 4px" : "16px 16px 4px 16px", color: "#edf7ff", background: tutor ? "rgba(130,106,233,.18)" : "rgba(75,193,161,.17)", border: `1px solid ${tutor ? "rgba(190,167,255,.28)" : "rgba(145,239,201,.24)"}`, lineHeight: 1.58 }}><p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.text}</p>{children ? <div style={{ marginTop: 12 }}>{children}</div> : null}</div></motion.article>;
}
