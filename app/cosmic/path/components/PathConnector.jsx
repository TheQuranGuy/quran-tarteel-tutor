"use client";

import { motion } from "framer-motion";

export default function PathConnector() {
  return <motion.div className="cd-path-connector" aria-hidden="true" animate={{ opacity: [.45, 1, .45] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", top: -34, bottom: -34, left: "50%", width: 5, transform: "translateX(-50%) rotate(12deg)", borderRadius: 99, background: "linear-gradient(#7ee9d0,#d39cff,#9bd4ff)", boxShadow: "0 0 22px rgba(171,151,255,.65)" }} />;
}
