"use client";

import { motion } from "framer-motion";

export default function ReviewAnswerButton({ children, onClick, state }) {
  return (
    <motion.button type="button" className={`cosmic-review-answer ${state ? `is-${state}` : ""}`} onClick={onClick} whileHover={!state ? { y: -2 } : {}} whileTap={!state ? { scale: .985, y: 1 } : {}} transition={{ type: "spring", stiffness: 430, damping: 28 }} style={{ display: "block", width: "100%", marginTop: 9, padding: 13, border: "1px solid rgba(183,216,255,.2)", borderRadius: 14, cursor: state ? "default" : "pointer", color: "#edf6ff", background: state === "correct" ? "rgba(83,188,134,.3)" : state === "wrong" ? "rgba(222,101,121,.25)" : "rgba(255,255,255,.055)", textAlign: "left", fontWeight: 800 }}>
      {children}
    </motion.button>
  );
}
