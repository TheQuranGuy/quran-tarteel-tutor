"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import WorldMap from "./components/WorldMap";
import WorldPanel from "./components/WorldPanel";

function localDay() {
  return new Intl.DateTimeFormat("en-CA").format(new Date());
}

function hasCompletedChallenge() {
  try {
    return Boolean(JSON.parse(window.localStorage.getItem(`sheikhduo-cosmic-challenge-${localDay()}`) || "null")?.completed);
  } catch {
    return false;
  }
}

export default function CosmicWorldsPage() {
  const user = useCosmicUser();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState("surahs");
  const [challengeComplete, setChallengeComplete] = useState(false);

  useEffect(() => {
    setChallengeComplete(hasCompletedChallenge());
  }, []);

  const stats = useMemo(() => {
    const mastered = new Set(user.ayahsMastered || []);
    const weak = new Set(user.weakAyahs || []);
    const totalAyahs = COSMIC_UNITS.reduce((sum, unit) => sum + unit.ayahCount, 0);
    const masteredCount = mastered.size;
    const mastery = totalAyahs ? Math.max(0, Math.round(((masteredCount - weak.size) / totalAyahs) * 100)) : 0;
    const completedSurahs = (user.surahsCompleted || []).length;
    return { totalAyahs, masteredCount, mastery, completedSurahs, weak: weak.size };
  }, [user.ayahsMastered, user.surahsCompleted, user.weakAyahs]);

  const worlds = useMemo(() => [
    { id: "surahs", index: 0, name: "Surah Galaxy", href: "/cosmic/path", icon: "surah", accent: "#9cf0cf", glow: "rgba(103,239,194,.48)", background: "radial-gradient(circle at 30% 26%,#e7ffd3 0 5%,#5dd8ac 24%,#126487 57%,#11255c 100%)", description: "Travel a living path through all 114 surah worlds, one ayah tile at a time.", metricLabel: "Surah worlds complete", metricValue: `${stats.completedSurahs} / 114`, progress: Math.round((stats.completedSurahs / 114) * 100) },
    { id: "mastery", index: 1, name: "Mastery Galaxy", href: "/cosmic/mastery", icon: "mastery", accent: "#a9e9ff", glow: "rgba(106,204,255,.48)", background: "radial-gradient(circle at 30% 26%,#effeff 0 5%,#78d7ff 26%,#3156a5 58%,#151c55 100%)", description: "See the signal in your learning: every completed ayah, gap, and growing mastery orbit.", metricLabel: "Current mastery", metricValue: `${stats.mastery}%`, progress: stats.mastery },
    { id: "review", index: 2, name: "Review Galaxy", href: "/cosmic/review", icon: "review", accent: "#c8b4ff", glow: "rgba(186,135,255,.5)", background: "radial-gradient(circle at 28% 24%,#f7ebff 0 4%,#bb85f4 25%,#583e99 58%,#1c174c 100%)", description: "Repair fragile memory fragments with focused review sessions shaped around weak ayahs.", metricLabel: "Weak ayahs in orbit", metricValue: `${stats.weak}`, progress: stats.totalAyahs ? Math.max(0, Math.round(((stats.totalAyahs - stats.weak) / stats.totalAyahs) * 100)) : 0 },
    { id: "challenge", index: 3, name: "Challenge Galaxy", href: "/cosmic/challenge", icon: "challenge", accent: "#ffd78d", glow: "rgba(255,186,84,.5)", background: "radial-gradient(circle at 30% 25%,#fff4bb 0 5%,#ffbf5a 23%,#dd5d50 56%,#531b49 100%)", description: "Take today’s timed cosmic trial, protect your lives, and turn calm recall into bright rewards.", metricLabel: "Today’s trial", metricValue: challengeComplete ? "Complete" : "Waiting", progress: challengeComplete ? 100 : 0 },
    { id: "events", index: 4, name: "Event Galaxy", href: "/cosmic/events", icon: "events", accent: "#f4d498", glow: "rgba(245,202,116,.48)", background: "radial-gradient(circle at 28% 25%,#fff9d6 0 4%,#f3c96c 22%,#a04c94 58%,#271746 100%)", description: "Follow seasonal constellations, complete gentle event quests, and collect luminous relics.", metricLabel: "Current orbit", metricValue: "Season active", progress: 52 },
    { id: "community", index: 5, name: "Community Galaxy", href: "/cosmic/social", icon: "community", accent: "#f2a8dc", glow: "rgba(242,137,203,.46)", background: "radial-gradient(circle at 30% 25%,#ffe8f7 0 4%,#f27dbb 24%,#724bca 58%,#1d1d59 100%)", description: "Meet the constellation: share quiet wins, celebrate friends, and learn together with good intention.", metricLabel: "Your current streak", metricValue: `${user.streak || 0} days`, progress: Math.min(100, ((user.streak || 0) / 30) * 100) },
  ], [challengeComplete, stats, user.streak]);

  const selected = worlds.find((world) => world.id === selectedId) || worlds[0];

  return <main className="cosmic-dark cd-worlds-v2" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "clamp(28px,5vw,58px) 16px 94px", overflow: "hidden" }}>
    <StarParticles count={70} color="#bfdcff" />
    <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: [0, 22, 0], y: [0, -12, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", width: "min(56vw,760px)", aspectRatio: "1", right: "-18%", top: "-24%", borderRadius: "50%", filter: "blur(20px)", background: "radial-gradient(circle,rgba(132,85,255,.24),transparent 64%)" }} />
    <section className="cd-worlds-shell" style={{ position: "relative", width: "min(1160px,100%)", margin: "0 auto", display: "grid", gap: 24 }}>
      <header className="cd-worlds-header" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div><h1 style={{ margin: 0, maxWidth: 680, fontSize: "clamp(2.65rem,7vw,5.5rem)", letterSpacing: "-.075em", lineHeight: 0.91 }}>Choose a world.</h1><p style={{ maxWidth: 600, margin: "14px 0 0", color: "#c5d5ea", lineHeight: 1.65, fontSize: "clamp(.96rem,1.5vw,1.08rem)" }}>Each galaxy is a different way to grow with the Qur&apos;an. Your learning data stays exactly where it is; this is simply a new map to guide you through it.</p></div>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><Link href="/cosmic/inventory" className="cosmic-button cosmic-button--outline" style={{ textDecoration: "none" }}>Inventory</Link><Link href="/cosmic/path" className="cosmic-button" style={{ color: "#112138", background: "linear-gradient(135deg,#a9f5d1,#82dbed)", textDecoration: "none" }}>Continue path</Link></div>
      </header>
      <div className="cd-worlds-stage" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: 20, alignItems: "stretch" }}>
        <WorldMap worlds={worlds} selectedId={selected.id} onSelect={setSelectedId} />
        <WorldPanel world={selected} />
      </div>
      <p className="cd-worlds-footnote" style={{ margin: "2px 0 0", color: "#94a9c8", fontSize: 13, textAlign: "center" }}>Select a galaxy to preview it, then enter when you&apos;re ready.</p>
    </section><style jsx global>{`
      .cd-worlds-v2{isolation:isolate;background:radial-gradient(circle at 46% -14%,rgba(123,107,249,.34),transparent 34%),radial-gradient(circle at 6% 80%,rgba(33,216,227,.14),transparent 33%),#07091a!important}.cd-worlds-v2:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.026),transparent 32%,rgba(151,112,255,.07) 75%,transparent)}.cd-worlds-shell{z-index:1}.cd-worlds-header{padding:0 4px}.cd-worlds-header h1{line-height:.93!important;max-width:580px}.cd-worlds-header p{color:#b7c8e3!important;font-size:14px!important}.cd-worlds-header .cosmic-button{min-height:40px!important;border-radius:13px!important;font-size:12px!important;font-weight:900!important}.cd-worlds-stage{align-items:stretch!important}.cd-world-map{min-height:490px!important;border:1px solid rgba(215,230,255,.23)!important;border-radius:30px!important;background:radial-gradient(circle at 50% 50%,rgba(137,115,255,.24),transparent 24%),radial-gradient(circle at 16% 14%,rgba(88,220,255,.15),transparent 24%),linear-gradient(145deg,rgba(255,255,255,.1),rgba(24,27,71,.85))!important;box-shadow:0 24px 64px rgba(0,0,0,.27),inset 0 1px rgba(255,255,255,.11)!important}.cd-world-node>a{border-radius:18px!important;background:rgba(8,12,43,.36);transition:transform .18s cubic-bezier(.16,1,.3,1),background .18s ease!important}.cd-world-node>a:hover{background:rgba(255,255,255,.09)}.cd-world-node>a>span:last-child{padding:5px 8px;border-radius:9px;background:rgba(9,13,43,.45);font-size:11px!important}.cd-world-panel{overflow:hidden;border-width:1px!important;border-radius:29px!important;box-shadow:0 26px 64px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.15)!important}.cd-world-panel:before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.09),transparent 37%)}.cd-world-panel>*{position:relative}.cd-world-panel .cosmic-button{border-radius:13px!important;font-size:13px!important;font-weight:900!important}.cd-world-status{padding:12px 13px;border:1px solid rgba(219,230,255,.14);border-radius:15px;background:rgba(3,8,30,.25)}.cd-worlds-footnote{color:#9eb2d0!important;font-size:12px!important}@media(max-width:680px){.cd-worlds-v2{padding-inline:12px!important}.cd-worlds-header{align-items:flex-start!important}.cd-worlds-header>div:last-child{width:100%}.cd-worlds-header .cosmic-button{flex:1;text-align:center}.cd-world-map{min-height:450px!important}.cd-world-map>div:last-child{grid-template-columns:repeat(2,minmax(108px,1fr))!important;padding:26px 15px!important;gap:17px!important}.cd-world-node>a>span:last-child{font-size:10px!important}.cd-world-panel{min-height:330px!important}.cd-worlds-stage{grid-template-columns:1fr!important}}@media(prefers-reduced-motion:reduce){.cd-world-node>a{transition:none!important}}
    `}</style>
  </main>;
}
