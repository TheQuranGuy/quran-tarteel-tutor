"use client";

import { motion } from "framer-motion";

export default function AnswerButton({ children, onClick, disabled, tone = "default" }) {
  return (
    <motion.button
      type="button"
      className="cosmic-answer"
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: .985, y: 1 } : {}}
      transition={{ type: "spring", stiffness: 430, damping: 28 }}
      style={{ width: "100%", marginTop: 9, padding: 13, border: "1px solid rgba(180,215,255,.22)", borderRadius: 14, cursor: disabled ? "default" : "pointer", color: "#edf7ff", background: tone === "correct" ? "rgba(70,178,126,.32)" : tone === "wrong" ? "rgba(226,99,119,.26)" : "rgba(255,255,255,.055)", textAlign: "left", fontWeight: 750 }}
    >
      {children}
    </motion.button>
  );
}
