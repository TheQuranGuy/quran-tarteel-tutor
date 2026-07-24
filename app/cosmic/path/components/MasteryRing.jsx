"use client";

import { motion } from "framer-motion";

export default function MasteryRing({ percent = 0, size = 76 }) {
  const complete = percent >= 100;
  return <motion.div className="cd-mastery-ring" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: size, height: size, display: "grid", placeItems: "center", flex: "0 0 auto", borderRadius: "50%", background: `conic-gradient(${complete ? "#9ff2ca" : "#99d6ff"} ${percent * 3.6}deg, rgba(255,255,255,.12) 0)`, boxShadow: complete ? "0 0 22px rgba(159,242,202,.72)" : "0 0 15px rgba(153,214,255,.35)" }}><span style={{ width: size - 12, height: size - 12, display: "grid", placeItems: "center", borderRadius: "50%", color: "#eaf5ff", background: "#10193e", fontSize: 13, fontWeight: 950 }}>{percent}%</span></motion.div>;
}
