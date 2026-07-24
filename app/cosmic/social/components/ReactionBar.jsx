"use client";

import { motion } from "framer-motion";

const reactions = [["like", "👍"], ["star", "✦"], ["heart", "💜"]];
export default function ReactionBar({ values = {}, selected = [], onReact }) {
  return <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{reactions.map(([id, icon]) => <motion.button type="button" key={id} whileTap={{ scale: 1.22 }} onClick={() => onReact(id)} style={{ border: `1px solid ${selected.includes(id) ? "#ffe188" : "rgba(174,205,246,.17)"}`, borderRadius: 99, padding: "6px 9px", cursor: "pointer", color: selected.includes(id) ? "#ffebaa" : "#c0d0e8", background: selected.includes(id) ? "rgba(222,166,56,.17)" : "rgba(255,255,255,.045)", fontWeight: 850 }}>{icon} {values[id] || 0}</motion.button>)}</div>;
}
