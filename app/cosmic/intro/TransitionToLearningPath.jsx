"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import StarParticles from "../../../components/cosmic/StarParticles";

export default function TransitionToLearningPath({ onDone }) { useEffect(() => { const timer = window.setTimeout(onDone, 1000); return () => window.clearTimeout(timer); }, [onDone]); return <main className="cosmic-dark cd-intro-transition" style={{ position: "relative", display: "grid", placeItems: "center", overflow: "hidden" }}><StarParticles color="#d6b9ff" /><motion.div initial={{ x: -90, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .72, ease: [0.16,1,.3,1] }} className="cd-transition-inner" style={{ position: "relative", textAlign: "center" }}><div style={{ width: "min(600px,80vw)", height: 6, margin: "0 auto 24px", transform: "rotate(-12deg)", borderRadius: 99, background: "linear-gradient(90deg,#8af0cf,#f3a3d6,#99d7ff)", boxShadow: "0 0 22px rgba(174,127,230,.6)" }} /><h1 style={{ fontSize: "clamp(2.2rem,7vw,4.5rem)", letterSpacing: "-.06em" }}>Your path is ready.</h1><p>Taking you to your first orbit…</p></motion.div><style jsx global>{`
  .cd-intro-transition{min-height:calc(100svh - 64px);background:radial-gradient(circle at 50% 45%,rgba(109,89,227,.34),transparent 28%),#060819!important}.cd-transition-inner{z-index:1}.cd-transition-inner h1{margin:0;line-height:.95}.cd-transition-inner p{margin:14px 0 0;color:#becdeb;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
`}</style></main>; }
