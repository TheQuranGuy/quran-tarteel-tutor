"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import MascotMale from "../../../components/cosmic/MascotMale";
import MascotFemale from "../../../components/cosmic/MascotFemale";
import StarParticles from "../../../components/cosmic/StarParticles";

export default function IntroAnimation({ guide, onDone }) {
  const Mascot = guide === "female" ? MascotFemale : MascotMale;
  useEffect(() => { const timer = window.setTimeout(onDone, 1900); return () => window.clearTimeout(timer); }, [onDone]);
  return <main className="cd-intro-launch" style={{ minHeight: "calc(100vh - 64px)", position: "relative", display: "grid", placeItems: "center", overflow: "hidden", color: "#effaff", background: "radial-gradient(circle at 50% 45%,#593c92,transparent 25%),radial-gradient(circle at 18% 76%,#125c7d,transparent 38%),#080b25" }}><StarParticles color="#c9b5ff" /><span className="cd-launch-rings" aria-hidden="true" /><div className="cd-launch-inner" style={{ position: "relative", textAlign: "center" }}><Mascot energetic /><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2 }} style={{ width: "min(600px,78vw)", height: 4, margin: "20px auto", borderRadius: 99, background: "linear-gradient(90deg,#93f2d0,#f6a2d5,#a9b5ff)", boxShadow: "0 0 20px #e1abfa" }} /><h1 style={{ fontSize: "clamp(2.3rem,7vw,4.5rem)", letterSpacing: "-.06em" }}>Your Qur&apos;an journey begins now</h1><p>Plotting a calm course through the stars…</p></div><style jsx global>{`
  .cd-intro-launch{isolation:isolate;background:radial-gradient(circle at 50% 45%,rgba(121,83,213,.6),transparent 22%),radial-gradient(circle at 18% 76%,rgba(18,143,183,.32),transparent 38%),#060819!important}.cd-launch-rings{position:absolute;width:min(82vw,850px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(188,184,255,.21);box-shadow:0 0 0 72px rgba(164,149,255,.03),0 0 0 144px rgba(112,225,255,.025);animation:cdLaunchSpin 15s linear infinite}.cd-launch-rings:after,.cd-launch-rings:before{content:"";position:absolute;inset:13%;border:1px solid rgba(134,239,220,.19);border-radius:50%}.cd-launch-rings:before{inset:28%;border-style:dashed}.cd-launch-inner{z-index:1;max-width:700px;padding:24px}.cd-launch-inner h1{margin:0;line-height:.95}.cd-launch-inner p{margin:15px 0 0;color:#c7d5ef;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}@keyframes cdLaunchSpin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.cd-launch-rings{animation:none}}
`}</style></main>;
}
