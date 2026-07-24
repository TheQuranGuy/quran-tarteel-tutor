"use client";

import MasteryAyahCard from "./MasteryAyahCard";

export default function MasteryAyahList({ unit, getAyahStats, onTest, onBack }) {
  return <section style={{ display: "grid", gap: 16 }}><header className="cosmic-bright-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", padding: 20, borderRadius: 20 }}><div><p style={{ margin: 0, color: "#ffdb8b", fontSize: 12, fontWeight: 900 }}>SURAH {unit.id}</p><h1 style={{ margin: "5px 0" }}>{unit.name} mastery</h1><p style={{ margin: 0, color: "#b8c9e3" }}>{unit.theme}</p></div><div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><button type="button" onClick={onBack} className="cosmic-button cosmic-button--outline">All surahs</button><button type="button" onClick={onTest} className="cosmic-button">Take mastery test</button></div></header><div style={{ display: "grid", gap: 10 }}>{unit.ayahs.map((ayah) => { const stats = getAyahStats(ayah); return <MasteryAyahCard key={ayah.id} ayah={ayah} {...stats} />; })}</div></section>;
}
