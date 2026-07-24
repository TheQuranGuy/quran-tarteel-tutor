"use client";

import { motion } from "framer-motion";

export default function ChallengeLives({ lives, maxLives = 3 }) {
  return <div className="cosmic-challenge-lives" aria-label={`${lives} of ${maxLives} lives left`} style={{ display: "flex", gap: 5, alignItems: "center", color: "#ffd5db", fontWeight: 850 }}><span style={{ color: "#c7d6ec", fontSize: 13 }}>Lives</span>{Array.from({ length: maxLives }, (_, index) => <motion.span key={index} animate={{ scale: index < lives ? [1, 1.16, 1] : 0.75, opacity: index < lives ? 1 : 0.22 }} transition={{ duration: 0.28 }} style={{ color: "#ff8796", fontSize: 21 }}>♥</motion.span>)}</div>;
}
