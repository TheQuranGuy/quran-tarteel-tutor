"use client";

import { useState } from "react";
import LessonEngine from "../../../components/cosmic/LessonEngine";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import { getUser } from "../../../lib/user";

export default function CosmicLessonsPage() {
  const [ayah, setAyah] = useState(COSMIC_UNITS[0].ayahs[0]);
  const user = getUser();
  return <main style={{ minHeight: "100vh", padding: "42px 16px", color: "#eefaff", background: "radial-gradient(circle at 85% 10%,#39265f,transparent 36%),#05091d" }}><div style={{ width: "min(850px,100%)", margin: "0 auto 18px", display: "flex", gap: 9, flexWrap: "wrap" }}>{COSMIC_UNITS.flatMap((unit) => unit.ayahs).map((item) => <button key={item.id} type="button" onClick={() => setAyah(item)} style={{ border: "1px solid rgba(159,239,255,.28)", borderRadius: 999, padding: "8px 11px", color: "#e9f8ff", background: ayah.id === item.id ? "#1d5d85" : "transparent", cursor: "pointer", fontWeight: 800 }}>Ayah {item.id}</button>)}</div><LessonEngine ayah={ayah} user={user} onExit={() => {}} /></main>;
}
