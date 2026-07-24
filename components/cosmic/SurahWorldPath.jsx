"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AyahTile from "./AyahTile";
import RewardChest from "./RewardChest";
import { getCosmicProgress, getSurahWorldStyle } from "../../lib/cosmic";
import { useCosmicUser } from "./useCosmicUser";

function StarField({ accent }) {
  return <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>{Array.from({ length: 28 }, (_, index) => <motion.i key={index} style={{ position: "absolute", left: `${(index * 41) % 98}%`, top: `${(index * 67) % 92}%`, width: index % 3 === 0 ? 4 : 2, height: index % 3 === 0 ? 4 : 2, borderRadius: "50%", background: accent, opacity: .7 }} animate={{ opacity: [.22, .92, .22], scale: [.7, 1.2, .7] }} transition={{ duration: 2.4 + index % 4, repeat: Infinity, delay: index * .05 }} />)}</div>;
}

export default function SurahWorldPath({ unit }) {
  const user = useCosmicUser();
  const router = useRouter();
  const world = getSurahWorldStyle(unit);
  const progress = getCosmicProgress(user, unit);
  const mastered = new Set(user.ayahsMastered || []);

  return <main style={{ minHeight: "calc(100vh - 64px)", overflow: "hidden", color: "#f4fbff", background: world.background }}>
    <StarField accent={world.accent} />
    <section style={{ position: "relative", width: "min(1240px,100%)", margin: "0 auto", padding: "clamp(28px,5vw,62px) 20px 78px" }}>
      <button type="button" onClick={() => router.push("/cosmic/path")} style={{ border: "1px solid rgba(255,255,255,.26)", borderRadius: 999, padding: "9px 13px", color: "#effaff", background: "rgba(7,16,47,.28)", cursor: "pointer", fontWeight: 850 }}>Back to planets</button>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, flexWrap: "wrap", marginTop: 26 }}><div><p style={{ margin: 0, color: world.accent, fontWeight: 900, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase" }}>Surah {unit.id} planet</p><h1 style={{ maxWidth: 690, margin: "8px 0", fontSize: "clamp(2.8rem,8vw,6.4rem)", lineHeight: .92, letterSpacing: "-.065em" }}>{unit.name}</h1><p style={{ maxWidth: 560, margin: 0, color: "#d5e5f4", fontSize: 17, lineHeight: 1.6 }}>{world.title}. Move through each ayah along this path.</p></div><div style={{ minWidth: 180, padding: 15, border: `1px solid ${world.accent}66`, borderRadius: 18, background: "rgba(6,14,42,.25)" }}><strong style={{ display: "block", color: world.accent, fontSize: 24 }}>{progress.percent}%</strong><small>{progress.complete} of {progress.total} ayahs mastered</small></div></header>
      <div style={{ position: "relative", marginTop: "clamp(40px,8vw,85px)", padding: "42px 6px 70px", overflowX: "auto", scrollbarColor: `${world.accent} transparent` }}><div style={{ position: "relative", minWidth: `max(760px, ${unit.ayahs.length * 390}px)`, minHeight: 400 }}><svg aria-hidden="true" viewBox={`0 0 ${Math.max(760, unit.ayahs.length * 390)} 400`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}><path d={unit.ayahs.map((_, index) => `${index ? "L" : "M"} ${160 + index * 390} ${index % 2 ? 265 : 135}`).join(" ")} fill="none" stroke={world.accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity=".62" style={{ filter: `drop-shadow(0 0 9px ${world.accent})` }} /></svg>{unit.ayahs.map((ayah, index) => <motion.div key={ayah.id} initial={{ opacity: 0, y: index % 2 ? 35 : -35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 + index * .12 }} style={{ position: "absolute", left: 18 + index * 390, top: index % 2 ? 205 : 35, width: 315 }}><div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9, color: world.accent, fontSize: 12, fontWeight: 950, letterSpacing: ".11em", textTransform: "uppercase" }}><span style={{ width: 29, height: 29, display: "grid", placeItems: "center", borderRadius: "50%", color: "#081525", background: world.accent }}>{ayah.number}</span>{mastered.has(ayah.id) ? "Mastered" : "Ayah lesson"}</div><AyahTile ayah={ayah} mastered={mastered.has(ayah.id)} onOpen={() => router.push(`/cosmic/lessons/${unit.id}/${ayah.number}`)} /></motion.div>)}</div></div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}><RewardChest id={`surah-world-${unit.id}`} reward={20} label={`${unit.name} world reward`} /></div>
    </section>
  </main>;
}
