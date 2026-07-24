"use client";

import { motion } from "framer-motion";

export default function BrightCard({ children, selected = false, onClick, style }) {
  const interactive = typeof onClick === "function";
  return <motion.div onClick={onClick} whileHover={interactive ? { y: -5, scale: 1.015 } : {}} whileTap={interactive ? { scale: .985 } : {}} className="cosmic-bright-card cd-card" style={{ padding: 22, outline: selected ? "3px solid rgba(116,225,194,.72)" : "none", cursor: interactive ? "pointer" : "default", ...style }}>{children}</motion.div>;
}
