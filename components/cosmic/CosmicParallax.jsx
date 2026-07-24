"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback } from "react";

function starStyle(index) {
  return {
    left: `${(index * 37 + 11) % 100}%`,
    top: `${(index * 61 + 7) % 100}%`,
    width: index % 5 === 0 ? 4 : 2,
    height: index % 5 === 0 ? 4 : 2,
    opacity: 0.34 + (index % 4) * 0.12,
  };
}

export default function CosmicParallax({ children, className = "", style, intensity = 18, stars = 34, interactive = true }) {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const distantX = useSpring(useTransform(pointerX, (value) => value * intensity * -0.3), { stiffness: 55, damping: 22 });
  const distantY = useSpring(useTransform(pointerY, (value) => value * intensity * -0.3), { stiffness: 55, damping: 22 });
  const nearX = useSpring(useTransform(pointerX, (value) => value * intensity), { stiffness: 75, damping: 22 });
  const nearY = useSpring(useTransform(pointerY, (value) => value * intensity), { stiffness: 75, damping: 22 });

  const move = useCallback((event) => {
    if (!interactive || prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }, [interactive, pointerX, pointerY, prefersReducedMotion]);

  const reset = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return <motion.section className={className} onPointerMove={move} onPointerLeave={reset} style={{ position: "relative", isolation: "isolate", overflow: "hidden", background: "radial-gradient(circle at 18% 75%,rgba(29,151,202,.26),transparent 34%),radial-gradient(circle at 83% 13%,rgba(164,79,211,.3),transparent 31%),linear-gradient(145deg,#050817 0%,#0b1440 48%,#070a23 100%)", ...style }}>
    <motion.div aria-hidden="true" style={{ position: "absolute", zIndex: -2, inset: "-18%", x: distantX, y: distantY, background: "radial-gradient(ellipse at 28% 60%,rgba(76,221,218,.2),transparent 31%),radial-gradient(ellipse at 68% 32%,rgba(214,122,255,.22),transparent 33%)", filter: "blur(14px)" }} />
    <motion.div aria-hidden="true" style={{ position: "absolute", zIndex: -1, inset: 0, x: nearX, y: nearY, pointerEvents: "none" }}>
      {Array.from({ length: Math.max(0, stars) }, (_, index) => <motion.i key={index} style={{ position: "absolute", borderRadius: "50%", background: index % 3 === 0 ? "#d9f7ff" : "#b9a7ff", boxShadow: "0 0 12px currentColor", ...starStyle(index) }} animate={prefersReducedMotion ? undefined : { opacity: [0.3, 1, 0.3], scale: [0.75, 1.25, 0.75] }} transition={{ duration: 2.4 + index % 4, delay: index * 0.07, repeat: Infinity }} />)}
    </motion.div>
    <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
  </motion.section>;
}
