"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import WorldGlyph from "./WorldGlyph";

export default function WorldNode({ world, active, onSelect }) {
  const reduceMotion = useReducedMotion();

  return <motion.div className="cd-world-node"
    layout
    initial={reduceMotion ? false : { opacity: 0, scale: 0.84, y: 18 }}
    animate={{ opacity: 1, scale: active ? 1.035 : 1, y: 0 }}
    transition={{ type: "spring", stiffness: 210, damping: 19, delay: reduceMotion ? 0 : world.index * 0.05 }}
    style={{ position: "relative", zIndex: active ? 3 : 2, minWidth: 0 }}
  >
    <Link
      href={world.href}
      onMouseEnter={() => onSelect(world.id)}
      onFocus={() => onSelect(world.id)}
      aria-current={active ? "page" : undefined}
      style={{ display: "grid", justifyItems: "center", gap: 10, padding: "12px 6px", color: "#eef7ff", textDecoration: "none", outline: "none" }}
    >
      <motion.span
        whileHover={reduceMotion ? undefined : { scale: 1.11, y: -5 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        animate={reduceMotion ? undefined : { y: [0, -5, 0], boxShadow: active ? [`0 0 22px ${world.glow}`, `0 0 43px ${world.glow}`, `0 0 22px ${world.glow}`] : `0 0 18px ${world.glow}` }}
        transition={reduceMotion ? undefined : { y: { duration: 3.8 + world.index * 0.22, repeat: Infinity, ease: "easeInOut" }, boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }, type: "spring", stiffness: 360, damping: 21 }}
        style={{ position: "relative", display: "grid", width: "min(100%, clamp(64px,10vw,108px))", aspectRatio: "1", placeItems: "center", overflow: "hidden", borderRadius: "50%", background: world.background, border: `1px solid ${world.accent}88`, boxShadow: `0 0 18px ${world.glow}` }}
      >
        <span aria-hidden="true" style={{ position: "absolute", width: "78%", height: "27%", borderRadius: "50%", border: `1px solid ${world.accent}55`, transform: "rotate(-24deg)" }} />
        <span aria-hidden="true" style={{ position: "absolute", inset: "13%", borderRadius: "50%", border: `1px dashed ${world.accent}55`, opacity: 0.75 }} />
        <WorldGlyph kind={world.icon} color={world.accent} />
      </motion.span>
      <span style={{ maxWidth: "100%", color: active ? "#ffffff" : "#d1e0f0", fontSize: 13, fontWeight: 900, overflowWrap: "anywhere", textAlign: "center", lineHeight: 1.15 }}>{world.name}</span>
    </Link>
  </motion.div>;
}
