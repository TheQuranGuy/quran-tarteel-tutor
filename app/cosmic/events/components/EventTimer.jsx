"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function format(ms) { const seconds = Math.max(0, Math.floor(ms / 1000)); const days = Math.floor(seconds / 86400); const hours = Math.floor((seconds % 86400) / 3600); const minutes = Math.floor((seconds % 3600) / 60); const secs = seconds % 60; return days ? `${days}d ${hours}h` : `${hours}h ${minutes}m ${String(secs).padStart(2, "0")}s`; }

export default function EventTimer({ endAt, onExpire }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, endAt - Date.now()));
  useEffect(() => { const timer = window.setInterval(() => { const next = Math.max(0, endAt - Date.now()); setRemaining(next); if (next === 0) onExpire?.(); }, 1000); return () => window.clearInterval(timer); }, [endAt, onExpire]);
  return <motion.div animate={{ boxShadow: remaining < 3600000 ? "0 0 22px rgba(255,122,130,.65)" : "0 0 20px rgba(140,222,255,.3)" }} style={{ padding: "10px 13px", borderRadius: 14, color: "#eef8ff", background: "rgba(10,24,58,.62)", border: "1px solid rgba(165,220,255,.22)", fontWeight: 900 }}>{remaining ? `Ends in ${format(remaining)}` : "Event complete"}</motion.div>;
}
