"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ChallengeTimer({ duration = 75, onExpire }) {
  const [remaining, setRemaining] = useState(duration);
  const expired = useRef(false);
  const progress = Math.max(0, remaining / duration);

  useEffect(() => {
    if (remaining <= 0) {
      if (!expired.current) {
        expired.current = true;
        onExpire();
      }
      return undefined;
    }
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, onExpire]);

  return (
    <motion.div className="cosmic-challenge-timer" animate={{ boxShadow: remaining <= 15 ? "0 0 28px rgba(255,118,119,.8)" : "0 0 24px rgba(114,225,255,.32)" }} transition={{ duration: .5, ease: "easeInOut" }} style={{ width: 88, height: 88, display: "grid", placeItems: "center", borderRadius: "50%", background: `conic-gradient(${remaining <= 15 ? "#ff7d88" : "#7de4ff"} ${progress * 360}deg, rgba(255,255,255,.09) 0deg)`, padding: 5 }}>
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", borderRadius: "50%", background: "#0d1736", color: "#f4fbff", fontSize: 22, fontWeight: 950 }}>{remaining}s</div>
    </motion.div>
  );
}
