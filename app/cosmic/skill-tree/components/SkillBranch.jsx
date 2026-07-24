"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SkillNode from "./SkillNode";

export default function SkillBranch({ branch, index, selected, onSelect, reduceMotion }) {
  return <motion.section
    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * .07, .28) }}
    onClick={onSelect}
    className="cosmic-bright-card"
    style={{ position: "relative", minHeight: 378, padding: 17, borderRadius: 25, cursor: "pointer", overflow: "hidden", borderColor: selected ? `${branch.color}80` : undefined, boxShadow: selected ? `0 0 0 1px ${branch.color}26, 0 20px 45px ${branch.color}12` : undefined }}
  >
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: .18, background: `radial-gradient(circle at 50% 15%,${branch.color},transparent 38%)`, pointerEvents: "none" }} />
    <header style={{ position: "relative", display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
      <div><span style={{ display: "grid", width: 34, height: 34, placeItems: "center", borderRadius: 13, color: "#071126", background: branch.color, fontWeight: 950, boxShadow: `0 0 22px ${branch.color}77` }}>{branch.icon}</span><h2 style={{ margin: "10px 0 4px", fontSize: 20 }}>{branch.name}</h2><p style={{ margin: 0, color: "#bbcae4", fontSize: 12, lineHeight: 1.45 }}>{branch.description}</p></div>
      <strong style={{ color: branch.color, fontSize: 19 }}>{branch.percent}%</strong>
    </header>
    <div aria-hidden="true" style={{ position: "absolute", top: 132, bottom: 56, left: 38, width: 2, background: `linear-gradient(${branch.color},rgba(255,255,255,.09))`, opacity: .75 }} />
    <div style={{ position: "relative", display: "grid", gap: 9, marginTop: 21 }}>
      {branch.nodes.map(([threshold, label], nodeIndex) => <SkillNode key={label} label={label} threshold={threshold} unlocked={branch.percent >= threshold} color={branch.color} index={nodeIndex} />)}
    </div>
    <Link href={branch.href} onClick={(event) => event.stopPropagation()} className="cosmic-button cosmic-button--outline" style={{ position: "absolute", right: 17, bottom: 15, padding: "8px 11px", fontSize: 12, textDecoration: "none" }}>Practise {branch.name}</Link>
  </motion.section>;
}
