"use client";

import { motion } from "framer-motion";
export default function IntroTransition() { return <motion.div className="cd-intro-divider" aria-hidden="true" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: .7 }} style={{ width: "min(220px,60%)", height: 2, margin: "18px auto", transformOrigin: "center", background: "linear-gradient(90deg,transparent,#9eefff,transparent)" }} />; }
