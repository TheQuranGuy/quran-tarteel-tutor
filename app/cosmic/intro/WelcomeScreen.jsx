"use client";

import { motion } from "framer-motion";
import BrightCard from "../../../components/cosmic/BrightCard";
import StarParticles from "../../../components/cosmic/StarParticles";
import IntroMascot from "./IntroMascot";
import IntroHero from "./IntroHero";
import IntroCTA from "./IntroCTA";
import IntroTransition from "./IntroTransition";

export default function WelcomeScreen({ onStart }) {
  return <main className="cosmic-dark cd-intro-screen cd-intro-welcome" style={{ position: "relative", display: "grid", placeItems: "center", padding: 24 }}><StarParticles color="#d6b9ff" /><span className="cd-intro-orb cd-intro-orb--one" aria-hidden="true" /><span className="cd-intro-orb cd-intro-orb--two" aria-hidden="true" /><motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .58, ease: [0.16, 1, .3, 1] }} className="cd-intro-welcome-card" style={{ position: "relative", width: "min(520px,100%)", textAlign: "center" }}><BrightCard style={{ padding: "40px clamp(24px,7vw,58px)" }}><IntroMascot /><IntroHero /><IntroTransition /><IntroCTA onStart={onStart} /></BrightCard></motion.div><style jsx global>{`
    .cd-intro-screen{isolation:isolate;min-height:calc(100svh - 64px);overflow:hidden;background:radial-gradient(circle at 50% 0%,rgba(106,98,255,.29),transparent 34%),radial-gradient(circle at 2% 84%,rgba(0,222,255,.16),transparent 36%),#07091a !important}
    .cd-intro-screen:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.03),transparent 32%,rgba(167,135,255,.1) 82%,transparent),repeating-linear-gradient(90deg,transparent 0 74px,rgba(162,194,255,.025) 75px 76px)}
    .cd-intro-welcome-card{z-index:2}.cd-intro-welcome-card>.cosmic-bright-card{overflow:hidden;border:1px solid rgba(214,228,255,.28)!important;border-radius:34px!important;background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(141,151,255,.08))!important;box-shadow:0 32px 100px rgba(0,0,0,.48),inset 0 1px rgba(255,255,255,.22)!important;backdrop-filter:blur(24px)}
    .cd-intro-orb{position:absolute;z-index:0;border-radius:50%;filter:blur(2px);pointer-events:none;animation:cdIntroFloat 12s ease-in-out infinite}.cd-intro-orb--one{width:min(48vw,580px);aspect-ratio:1;right:-15%;top:-19%;background:radial-gradient(circle at 35% 35%,rgba(173,150,255,.55),rgba(88,75,203,.12) 44%,transparent 68%)}.cd-intro-orb--two{width:min(39vw,460px);aspect-ratio:1;left:-18%;bottom:-23%;background:radial-gradient(circle at 63% 39%,rgba(79,235,233,.35),rgba(65,96,255,.08) 48%,transparent 68%);animation-delay:-6s}
    .cd-intro-screen .cosmic-button{border-radius:16px!important;min-height:48px!important;font-weight:900!important;letter-spacing:.01em;box-shadow:0 12px 26px rgba(79,221,206,.18);transition:transform .18s cubic-bezier(.16,1,.3,1),box-shadow .18s ease,filter .18s ease}.cd-intro-screen .cosmic-button:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 16px 34px rgba(124,170,255,.3)}
    .cd-intro-welcome .cd-intro-mascot{padding:4px 0 10px;filter:drop-shadow(0 20px 28px rgba(74,77,255,.27))}.cd-intro-welcome h1{max-width:570px;margin-inline:auto}.cd-intro-welcome p{font-size:clamp(.92rem,2vw,1.03rem)}.cd-intro-welcome .cd-intro-divider{opacity:.85}
    @keyframes cdIntroFloat{50%{transform:translate3d(0,-18px,0) scale(1.04)}}@media (prefers-reduced-motion:reduce){.cd-intro-orb{animation:none}.cd-intro-screen .cosmic-button{transition:none!important}}
  `}</style></main>;
}
