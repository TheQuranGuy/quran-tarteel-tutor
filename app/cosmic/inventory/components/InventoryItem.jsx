"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function InventoryItem({ item }) {
  const reduceMotion = useReducedMotion();
  const status = item.equipped ? "Equipped" : item.count ? `${item.count} held` : "Collected";

  return <motion.article className="cosmic-v2-card" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={reduceMotion ? undefined : { y: -4, scale: 1.008 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} style={{ display: "grid", gridTemplateColumns: "70px minmax(0,1fr)", gap: 14, minWidth: 0, padding: 16, borderRadius: 22, border: `1px solid ${item.equipped ? `${item.accent}80` : "rgba(179,212,251,.17)"}`, background: item.equipped ? `radial-gradient(circle at 85% 8%,${item.accent}24,transparent 31%),rgba(21,27,68,.86)` : "rgba(255,255,255,.045)", boxShadow: item.equipped ? `0 0 28px ${item.accent}27` : "none" }}>
    <div aria-hidden="true" style={{ display: "grid", width: 70, aspectRatio: "1", placeItems: "center", borderRadius: 20, overflow: "hidden", color: "#f7fbff", background: item.art, border: `1px solid ${item.accent}66`, boxShadow: `inset 0 0 18px ${item.accent}33` }}><span style={{ fontSize: 25, fontWeight: 950 }}>{item.mark}</span></div>
    <div style={{ display: "grid", alignContent: "space-between", gap: 11, minWidth: 0 }}><div><div style={{ display: "flex", gap: 8, alignItems: "start", justifyContent: "space-between" }}><h3 style={{ minWidth: 0, margin: 0, color: "#f0f8ff", fontSize: 17, overflowWrap: "anywhere" }}>{item.name}</h3><span style={{ flex: "0 0 auto", color: item.equipped ? "#a9f1cd" : item.accent, fontSize: 11, fontWeight: 900 }}>{status}</span></div><p style={{ margin: "6px 0 0", color: "#b6c7df", fontSize: 13, lineHeight: 1.45 }}>{item.description}</p></div><div style={{ display: "flex", justifyContent: "space-between", gap: 10, color: "#92a6c5", fontSize: 11, fontWeight: 850, letterSpacing: ".075em" }}><span>{item.category.toUpperCase()}</span><span>{item.source}</span></div></div>
  </motion.article>;
}
