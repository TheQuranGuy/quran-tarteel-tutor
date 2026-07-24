"use client";

import { motion } from "framer-motion";

export default function GalaxyTooltip({ item, position }) { if (!item) return null; return <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} style={{ pointerEvents: "none", position: "fixed", zIndex: 20, left: position?.x || 16, top: position?.y || 96, maxWidth: 230, padding: "10px 12px", border: "1px solid rgba(184,219,255,.25)", borderRadius: 12, color: "#eff8ff", background: "rgba(6,13,41,.92)", boxShadow: "0 12px 30px rgba(0,0,0,.35)" }}><strong>{item.name}</strong><small style={{ display: "block", marginTop: 4, color: "#b8c9e5" }}>{item.detail}</small></motion.div>; }
