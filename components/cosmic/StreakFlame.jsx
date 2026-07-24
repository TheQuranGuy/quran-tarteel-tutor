"use client";

import { motion } from "framer-motion";

export default function StreakFlame({ streak = 0 }) {
  return <motion.div className="cd-streak" animate={{ y: [0, -3, 0], scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} title={`${streak} day streak`}><span aria-hidden="true" className="cd-streak-flame" />{streak} day streak</motion.div>;
}
