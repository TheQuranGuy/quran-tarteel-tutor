"use client";

import { motion } from "framer-motion";
import MasteryRing from "./MasteryRing";

export default function MasterySurahCard({ unit, stats, onSelect }) {
  return <motion.article whileHover={{ y: -4, scale: 1.01 }} className="cosmic-bright-card" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 15, alignItems: "center", padding: 16, borderRadius: 20 }}><MasteryRing value={stats.mastery} size={74} label="Mastery" /><div style={{ minWidth: 0 }}><p style={{ margin: 0, color: "#ffdc8b", fontSize: 12, fontWeight: 900 }}>SURAH {unit.id}</p><h2 style={{ margin: "4px 0", fontSize: 21 }}>{unit.name}</h2><p style={{ margin: "0 0 12px", color: "#b7c9e3", fontSize: 13 }}>{stats.completed}/{stats.total} complete · {stats.weak} weak</p><button type="button" onClick={onSelect} className="cosmic-button cosmic-button--outline">View ayahs</button></div></motion.article>;
}
