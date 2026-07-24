"use client";

import { motion } from "framer-motion";

export default function StarParticles({ count = 32, color = "#f5a4d7" }) {
  return <div aria-hidden="true" className="cd-starfield" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>{Array.from({ length: count }, (_, index) => <motion.i key={index} className="cosmic-star" style={{ left: `${(index * 47) % 98}%`, top: `${(index * 71) % 93}%`, width: index % 3 === 0 ? 5 : 3, height: index % 3 === 0 ? 5 : 3, color, background: color }} animate={{ opacity: [.15, .95, .15], scale: [.75, 1.25, .75], y: [0, index % 2 ? -9 : 9, 0] }} transition={{ duration: 2.2 + index % 4, repeat: Infinity, delay: index * .04 }} />)}</div>;
}
