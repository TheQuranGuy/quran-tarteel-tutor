"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function XPBubble({ amount = 0, visible }) {
  return (
    <AnimatePresence>
      {visible ? <motion.div className="cosmic-xp-bubble" initial={{ opacity: 0, y: 16, scale: .8 }} animate={{ opacity: 1, y: -14, scale: 1 }} exit={{ opacity: 0, y: -36 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} style={{ position: "absolute", right: 18, top: 18, zIndex: 3, padding: "9px 12px", borderRadius: 99, color: "#08251c", background: "#9ff2ca", fontWeight: 950 }}>+{amount} XP</motion.div> : null}
    </AnimatePresence>
  );
}
