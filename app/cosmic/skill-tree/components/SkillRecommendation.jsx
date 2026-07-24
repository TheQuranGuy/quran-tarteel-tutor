"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SkillRecommendation({ branch }) {
  const nextNode = branch.nodes.find(([threshold]) => threshold > branch.percent) || branch.nodes.at(-1);
  return <motion.aside key={branch.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .25 }} className="cosmic-bright-card" style={{ padding: 21, borderRadius: 25, display: "grid", gap: 14, position: "sticky", top: 18 }}>
    <div style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 16, color: "#071126", background: branch.color, boxShadow: `0 0 26px ${branch.color}77`, fontWeight: 950 }}>{branch.icon}</div>
    <div><p style={{ margin: 0, color: branch.color, fontSize: 12, fontWeight: 900, letterSpacing: ".13em" }}>FOCUS BRANCH</p><h2 style={{ margin: "7px 0", fontSize: 25 }}>{branch.name}</h2><p style={{ margin: 0, color: "#c4d2e8", lineHeight: 1.65, fontSize: 14 }}>{branch.description}</p></div>
    <div style={{ padding: 14, borderRadius: 17, border: `1px solid ${branch.color}42`, background: `${branch.color}12` }}><strong style={{ display: "block", color: branch.color }}>Next light: {nextNode[1]}</strong><p style={{ margin: "5px 0 0", color: "#c4d2e8", fontSize: 13, lineHeight: 1.5 }}>Reach {nextNode[0]}% through your regular lesson activity. No separate scoring is written from this screen.</p></div>
    <div style={{ padding: 13, borderRadius: 16, background: "rgba(255,255,255,.055)", color: "#c2d1e7", fontSize: 12, lineHeight: 1.55 }}>Signals: {branch.evidence.mastered} mastered ayahs, {branch.evidence.listened} listened ayahs, {branch.evidence.weak} in review.</div>
    <Link href={branch.href} className="cosmic-button cosmic-button--mint" style={{ textAlign: "center", textDecoration: "none" }}>Open practice</Link>
  </motion.aside>;
}
