"use client";

import { motion } from "framer-motion";
import RewardChest from "../../../../components/cosmic/RewardChest";

export default function TreasureChest({ unit }) {
  return <motion.div className="cd-path-treasure" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 12, textAlign: "center" }}><p style={{ margin: "0 0 8px", color: "#ffe9a5", fontSize: 13, fontWeight: 900 }}>SURAH TREASURE UNLOCKED</p><RewardChest id={`path-surah-${unit.id}`} reward={25} label={`${unit.name} mastery`} /></motion.div>;
}
