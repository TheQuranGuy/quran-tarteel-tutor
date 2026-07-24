"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { COSMIC_UNITS, getCosmicProgress } from "../../lib/cosmic";
import { useCosmicUser } from "./useCosmicUser";
import SurahPlanetNode from "./SurahPlanetNode";
import RewardChest from "./RewardChest";

export default function LearningPath({ user: suppliedUser }) {
  const hydratedUser = useCosmicUser();
  const user = suppliedUser || hydratedUser;
  const router = useRouter();
  const completed = new Set(user.surahsCompleted || []);
  const data = useMemo(() => COSMIC_UNITS.map((unit) => ({ unit, progress: getCosmicProgress(user, unit) })), [user]);

  return <section style={{ width: "min(1050px,calc(100% - 32px))", margin: "0 auto", padding: "38px 0 80px" }}>
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}><div><p style={{ margin: 0, color: "#9fefff", fontSize: 12, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>Cosmic learning path</p><h1 style={{ margin: "7px 0 0", color: "#f0f9ff", fontSize: "clamp(2rem,6vw,4rem)" }}>Follow the light, one ayah at a time.</h1></div><RewardChest id="cosmic-daily-path" reward={20} label="Daily path reward" /></header>
    <div style={{ position: "relative", display: "grid", gap: 38, padding: "34px 0" }}><div aria-hidden="true" style={{ position: "absolute", top: 80, bottom: 75, left: "50%", width: 5, transform: "translateX(-50%) rotate(10deg)", borderRadius: 999, background: "linear-gradient(#75ddff,#9d83ff,#e9bd59)", boxShadow: "0 0 26px rgba(120,218,255,.6)" }} />
      {data.map(({ unit, progress }, index) => {
        const locked = index > 0 && !completed.has(COSMIC_UNITS[index - 1].id);
        return <motion.div key={unit.id} initial={{ opacity: 0, x: index % 2 ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .1 }} style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: index % 2 ? "flex-end" : "flex-start", alignItems: "center", gap: 18, flexDirection: index % 2 ? "row" : "row-reverse" }}><SurahPlanetNode unit={unit} progress={progress} locked={locked} selected={false} onClick={() => { if (!locked) router.push(`/cosmic/path/${unit.id}`); }} /><div style={{ width: "min(360px,calc(100% - 190px))", padding: 16, border: "1px solid rgba(171,232,255,.18)", borderRadius: 19, background: "rgba(9,22,61,.62)", backdropFilter: "blur(10px)" }}><strong style={{ color: "#fff" }}>{unit.theme}</strong><p style={{ margin: "7px 0 0", color: "#b9cae1" }}>{locked ? "Complete the previous planet to unlock this world." : "Enter this planet to follow its ayah path."}</p></div></motion.div>;
      })}
    </div>
  </section>;
}
