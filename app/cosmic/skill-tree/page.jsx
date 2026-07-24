"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import SkillTreeHeader from "./components/SkillTreeHeader";
import SkillOverview from "./components/SkillOverview";
import SkillBranch from "./components/SkillBranch";
import SkillRecommendation from "./components/SkillRecommendation";

const TOTAL_AYAHS = COSMIC_UNITS.reduce((total, unit) => total + unit.ayahCount, 0);
const BRANCH_DEFINITIONS = [
  { id: "tajweed", name: "Tajweed", icon: "~", color: "#89e8ff", href: "/cosmic/tutor", description: "Build attentive listening and careful sound awareness.", nodes: [[0, "First listening"], [10, "Sound awareness"], [30, "Measured pace"], [60, "Confident patterns"], [90, "Refined practice"]] },
  { id: "memorisation", name: "Memorisation", icon: "*", color: "#a8f0c9", href: "/cosmic/path", description: "Turn completed ayahs into a durable memory constellation.", nodes: [[0, "First fragment"], [10, "Memory rhythm"], [30, "Steady recall"], [60, "Surah keeper"], [90, "Living constellation"]] },
  { id: "recitation", name: "Recitation", icon: ">", color: "#ffbad7", href: "/cosmic/recitation", description: "Return to audio and practise reciting one ayah at a time.", nodes: [[0, "Open your voice"], [10, "Repeat after me"], [30, "Fluent phrases"], [60, "Connected recitation"], [90, "Clear delivery"]] },
  { id: "grammar", name: "Grammar", icon: "+", color: "#c0bbff", href: "/cosmic/tutor", description: "Use lesson mastery as a gentle map for language study.", nodes: [[0, "Word notices"], [10, "Phrase shapes"], [30, "Grammar signals"], [60, "Sentence pathways"], [90, "Language navigator"]] },
  { id: "meaning", name: "Meaning", icon: "o", color: "#ffe19a", href: "/cosmic/review", description: "Reinforce meanings through review and mastered fragments.", nodes: [[0, "First meaning"], [10, "Recall clues"], [30, "Meaning links"], [60, "Context builder"], [90, "Meaning guide"]] },
];

function bounded(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildBranches(user) {
  const mastered = Math.min(TOTAL_AYAHS, (user.ayahsMastered || []).length);
  const listened = Math.min(TOTAL_AYAHS, (user.ayahsListened || []).length);
  const completedSurahs = Math.min(COSMIC_UNITS.length, (user.surahsCompleted || []).length);
  const weak = Math.min(TOTAL_AYAHS, (user.weakAyahs || []).length);
  const masteryRatio = mastered / TOTAL_AYAHS;
  const listeningRatio = listened / TOTAL_AYAHS;
  const surahRatio = completedSurahs / COSMIC_UNITS.length;
  const weakRatio = weak / TOTAL_AYAHS;
  const dailyRatio = Math.min(1, (user.dailyXp || 0) / Math.max(1, user.dailyGoal || 10));
  const values = {
    tajweed: bounded((listeningRatio * 72 + masteryRatio * 28) * 100),
    memorisation: bounded((masteryRatio * 86 + surahRatio * 14) * 100),
    recitation: bounded((listeningRatio * 82 + dailyRatio * 18) * 100),
    grammar: bounded((masteryRatio * 68 + surahRatio * 32) * 100),
    meaning: bounded(((masteryRatio * 80 + surahRatio * 20) - weakRatio * 35) * 100),
  };
  return BRANCH_DEFINITIONS.map((definition) => ({ ...definition, percent: values[definition.id], evidence: { mastered, listened, completedSurahs, weak } }));
}

export default function CosmicSkillTreePage() {
  const user = useCosmicUser();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState("memorisation");
  const branches = useMemo(() => buildBranches(user), [user]);
  const selected = branches.find((branch) => branch.id === selectedId) || branches[0];
  const unlocked = branches.reduce((total, branch) => total + branch.nodes.filter(([threshold]) => branch.percent >= threshold).length, 0);

  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", overflow: "hidden", padding: "42px 16px 96px" }}>
    <StarParticles count={64} color="#a8d4ff" />
    <div aria-hidden="true" style={{ position: "absolute", inset: "8% 15% auto", height: 330, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(123,93,230,.22),transparent 68%)", filter: "blur(18px)", pointerEvents: "none" }} />
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} style={{ position: "relative", width: "min(1180px,100%)", margin: "0 auto", display: "grid", gap: 18 }}>
      <SkillTreeHeader xp={user.xp || 0} streak={user.streak || 0} />
      <SkillOverview branches={branches} unlocked={unlocked} total={BRANCH_DEFINITIONS.reduce((sum, branch) => sum + branch.nodes.length, 0)} />
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 18, alignItems: "start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(238px,1fr))", gap: 14 }}>
          {branches.map((branch, index) => <SkillBranch key={branch.id} branch={branch} index={index} selected={branch.id === selected.id} onSelect={() => setSelectedId(branch.id)} reduceMotion={reduceMotion} />)}
        </div>
        <SkillRecommendation branch={selected} />
      </section>
    </motion.section>
  </main>;
}
