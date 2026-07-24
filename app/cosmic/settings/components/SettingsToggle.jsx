"use client";

import { motion } from "framer-motion";

export default function SettingsToggle({ label, description, checked, onChange }) {
  return <label style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", cursor: "pointer" }}><span><strong style={{ display: "block", color: "#edf7ff" }}>{label}</strong>{description ? <small style={{ color: "#aebfda", lineHeight: 1.4 }}>{description}</small> : null}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} /><motion.span animate={{ background: checked ? "#82ecc7" : "rgba(255,255,255,.16)", boxShadow: checked ? "0 0 16px rgba(130,236,199,.5)" : "none" }} style={{ width: 48, height: 27, flex: "0 0 auto", display: "flex", alignItems: "center", padding: 3, borderRadius: 99, border: "1px solid rgba(207,233,255,.25)" }}><motion.i animate={{ x: checked ? 21 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ display: "block", width: 21, height: 21, borderRadius: "50%", background: "#f8feff" }} /></motion.span></label>;
}
