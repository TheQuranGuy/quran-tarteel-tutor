"use client";

import { getLessonById } from "../../../../lib/lessons";

export default function TutorAyahBreakdown({ lessonId = "1-1", mode = "meaning" }) {
  const lesson = getLessonById(lessonId) || getLessonById("1-1");
  const grammar = lesson.id === "1-1" ? "بِـ is a preposition; اسْم is a noun following it; اللَّهِ is in the genitive case; الرَّحْمَٰنِ and الرَّحِيمِ describe Allah and match that case." : "الْحَمْدُ functions as the opening subject; لِلَّهِ is a prepositional phrase completing the meaning; رَبِّ الْعَالَمِينَ describes Allah as the Lord and Sustainer of all worlds.";
  return <article style={{ padding: 13, borderRadius: 14, color: "#eaf5ff", background: "rgba(8,21,53,.48)", border: "1px solid rgba(177,216,255,.2)" }}><p dir="rtl" style={{ margin: "0 0 8px", fontFamily: "serif", fontSize: 25, textAlign: "right" }}>{lesson.ayah?.arabic}</p><strong>{mode === "grammar" ? "Grammar map" : "Ayah map"}</strong><p style={{ margin: "6px 0", color: "#c3d4ea", lineHeight: 1.5 }}>{mode === "grammar" ? grammar : lesson.translation}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 7 }}>{lesson.vocabulary.map((word) => <div key={word.arabic} style={{ padding: 8, borderRadius: 10, background: "rgba(255,255,255,.055)" }}><strong dir="rtl">{word.arabic}</strong><small style={{ display: "block", color: "#b8cae3" }}>{word.meaning}</small></div>)}</div><p style={{ margin: "10px 0 0", color: "#ffdc8b", fontSize: 13 }}><strong>Tajweed:</strong> {lesson.tajweed}</p><p style={{ margin: "7px 0 0", color: "#c3d4ea", fontSize: 13 }}><strong>Tafsir summary:</strong> {lesson.tafsir}</p></article>;
}
