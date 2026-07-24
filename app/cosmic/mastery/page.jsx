"use client";

import { useMemo, useState } from "react";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import { startUserSession } from "../../../lib/user";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import MasteryOverview from "./components/MasteryOverview";
import MasterySurahCard from "./components/MasterySurahCard";
import MasteryAyahList from "./components/MasteryAyahList";
import MasteryTest from "./components/MasteryTest";
import MasterySummary from "./components/MasterySummary";

function ayahStats(ayah, user) {
  const mastered = (user.ayahsMastered || []).includes(ayah.id);
  const weak = (user.weakAyahs || []).includes(ayah.id);
  return { mastered, weak, mastery: Math.max(0, (mastered ? 100 : 0) - (weak ? 100 : 0)) };
}
function unitStats(unit, user) {
  const values = unit.ayahs.map((ayah) => ayahStats(ayah, user));
  const total = values.length;
  const completed = values.filter((value) => value.mastered).length;
  const weak = values.filter((value) => value.weak).length;
  const completionScore = total ? (completed / total) * 100 : 0;
  const weaknessPenalty = total ? (weak / total) * 100 : 0;
  return { total, completed, weak, mastery: Math.max(0, Math.min(100, Math.round(completionScore - weaknessPenalty))) };
}

export default function CosmicMasteryPage() {
  const user = useCosmicUser();
  const [view, setView] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);
  const stats = useMemo(() => new Map(COSMIC_UNITS.map((unit) => [unit.id, unitStats(unit, user)])), [user]);
  const allAyahs = useMemo(() => COSMIC_UNITS.flatMap((unit) => unit.ayahs), []);
  const total = useMemo(() => { const completed = allAyahs.filter((ayah) => ayahStats(ayah, user).mastered).length; const weak = allAyahs.filter((ayah) => ayahStats(ayah, user).weak).length; return Math.max(0, Math.round(((completed / allAyahs.length) * 100) - ((weak / allAyahs.length) * 100))); }, [allAyahs, user]);
  function choose(unit) { setSelected(unit); setView("ayahs"); }
  function beginTest() { startUserSession(); setView("test"); }
  function finish(result) { setSummary(result); setView("summary"); }
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}><StarParticles count={48} color="#aeeeff" /><section style={{ position: "relative", width: "min(940px,100%)", margin: "0 auto", display: "grid", gap: 16 }}>
    {view === "overview" ? <><MasteryOverview total={total} xp={user.xp || 0} streak={user.streak || 0} surahs={COSMIC_UNITS.length} /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 13 }}>{COSMIC_UNITS.map((unit) => <MasterySurahCard key={unit.id} unit={unit} stats={stats.get(unit.id)} onSelect={() => choose(unit)} />)}</div></> : null}
    {view === "ayahs" && selected ? <MasteryAyahList unit={selected} getAyahStats={(ayah) => ayahStats(ayah, user)} onTest={beginTest} onBack={() => setView("overview")} /> : null}
    {view === "test" && selected ? <MasteryTest unit={selected} user={user} allTranslations={allAyahs.map((ayah) => ayah.translation)} before={stats.get(selected.id).mastery} onComplete={finish} /> : null}
    {view === "summary" && summary ? <MasterySummary result={summary} streak={user.streak || 0} onBack={() => setView("ayahs")} /> : null}
  </section></main>;
}
