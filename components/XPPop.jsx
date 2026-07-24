"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function XPPop() {
  const [pops, setPops] = useState([]);

  useEffect(() => {
    function showPop(event) {
      const amount = event.detail?.amount || 0;
      const label = event.detail?.label || "XP";
      const id = `${Date.now()}-${Math.random()}`;
      setPops((items) => [...items, { id, amount, label }]);
      window.setTimeout(() => {
        setPops((items) => items.filter((item) => item.id !== id));
      }, 1300);
    }

    window.addEventListener("sheikhduo-xp-pop", showPop);
    return () => window.removeEventListener("sheikhduo-xp-pop", showPop);
  }, []);

  return (
    <div className="xp-pop-layer" aria-live="polite">
      <AnimatePresence>
        {pops.map((pop) => (
          <motion.div
            key={pop.id}
            className="xp-pop"
            initial={{ opacity: 0, y: 20, scale: 0.82 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0, y: -64, scale: 0.9 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            +{pop.amount} XP
            <span>{pop.label}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
