"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function XPBubble() {
  const [bubble, setBubble] = useState(null);

  useEffect(() => {
    function show(event) {
      setBubble({ id: Date.now(), amount: event.detail?.amount || 0, label: event.detail?.label || "XP" });
    }
    window.addEventListener("sheikhduo-xp-pop", show);
    return () => window.removeEventListener("sheikhduo-xp-pop", show);
  }, []);

  return (
    <AnimatePresence>
      {bubble ? <motion.div key={bubble.id} className="cd-xp-bubble" role="status" initial={{ opacity: 0, y: 22, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -36, scale: 1.08 }} transition={{ duration: 0.7 }} style={{ position: "fixed", zIndex: 90, right: 24, bottom: 24, padding: "11px 15px", color: "#082014", fontWeight: 900 }}>+{bubble.amount} {bubble.label}</motion.div> : null}
    </AnimatePresence>
  );
}
