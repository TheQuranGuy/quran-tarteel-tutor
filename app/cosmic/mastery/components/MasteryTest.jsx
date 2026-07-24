"use client";

import { useMemo, useState } from "react";
import { markAyahMastered, updateUser } from "../../../../lib/user";

function optionsFor(question, translations, index) {
  const wrong = translations.filter((item) => item !== question.translation);
  const start = (index * 2) % Math.max(1, wrong.length);
  const options = [question.translation, ...wrong.slice(start, start + 3)];
  while (options.length < 4 && wrong.length) options.push(wrong[options.length % wrong.length]);
  return options.slice(0, 4).sort((left, right) => (left === question.translation ? -1 : right === question.translation ? 1 : left.localeCompare(right)));
}

function scoreFor(total, mastered, weak) {
  const completion = total ? (mastered / total) * 100 : 0;
  const penalty = total ? (weak / total) * 100 : 0;
  return Math.max(0, Math.min(100, Math.round(completion - penalty)));
}

export default function MasteryTest({ unit, user, allTranslations, before, onComplete }) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState("");
  const [correctIds, setCorrectIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [startingMastery] = useState(before);
  const [baseline] = useState(() => ({ mastered: new Set(user.ayahsMastered || []), weak: new Set(user.weakAyahs || []) }));
  const ayah = unit.ayahs[index];
  const options = useMemo(() => optionsFor(ayah, allTranslations, index), [allTranslations, ayah, index]);
  function answer(choice) {
    if (answered) return;
    const isCorrect = choice === ayah.translation;
    setPicked(choice);
    setAnswered(true);
    if (isCorrect) {
      markAyahMastered(ayah.id);
      setCorrectIds((ids) => [...ids, ayah.id]);
    } else {
      updateUser((profile) => ({ ...profile, weakAyahs: [...new Set([...(profile.weakAyahs || []), ayah.id])] }));
      setWrongIds((ids) => [...ids, ayah.id]);
    }
  }
  function complete() {
    const mastered = new Set([...baseline.mastered, ...correctIds]);
    const weak = new Set([...baseline.weak, ...wrongIds]);
    correctIds.forEach((id) => weak.delete(id));
    const completed = unit.ayahs.filter((item) => mastered.has(item.id)).length;
    const weakCount = unit.ayahs.filter((item) => weak.has(item.id)).length;
    const newlyMastered = correctIds.filter((id) => !baseline.mastered.has(id)).length;
    onComplete({ correct: correctIds.length, total: unit.ayahs.length, before: startingMastery, after: scoreFor(unit.ayahs.length, completed, weakCount), xp: newlyMastered * 10 });
  }
  function next() {
    if (index === unit.ayahs.length - 1) { complete(); return; }
    setIndex((value) => value + 1);
    setAnswered(false);
    setPicked("");
  }
  return <section className="cosmic-bright-card" style={{ padding: "clamp(20px,4vw,34px)", borderRadius: 25, display: "grid", gap: 19 }}><header style={{ display: "flex", justifyContent: "space-between", gap: 14, color: "#bed0ea", fontWeight: 850 }}><span>Mastery test · {unit.name}</span><span>{index + 1}/{unit.ayahs.length}</span></header><div style={{ height: 8, borderRadius: 99, overflow: "hidden", background: "rgba(255,255,255,.1)" }}><div style={{ width: `${(index / unit.ayahs.length) * 100}%`, height: "100%", borderRadius: "inherit", background: "linear-gradient(90deg,#87e6cf,#ffe18b)", transition: "width .25s" }} /></div><div style={{ padding: "clamp(18px,4vw,30px)", borderRadius: 19, background: "rgba(111,139,255,.1)", border: "1px solid rgba(159,225,255,.15)" }}><p style={{ margin: 0, color: "#ffdc89", fontSize: 12, fontWeight: 900, letterSpacing: ".13em" }}>AYAH {ayah.number}</p><h1 style={{ margin: "8px 0 0", fontSize: "clamp(1.65rem,4vw,2.45rem)", lineHeight: 1.12 }}>Choose this ayah&apos;s meaning.</h1></div><div style={{ display: "grid", gap: 10 }}>{options.map((choice) => { const correct = choice === ayah.translation; const selected = picked === choice; const border = answered && correct ? "#83efbd" : answered && selected ? "#ff98a3" : "rgba(184,211,249,.18)"; return <button type="button" key={choice} disabled={answered} onClick={() => answer(choice)} style={{ padding: "14px 15px", textAlign: "left", border: `1px solid ${border}`, borderRadius: 14, cursor: answered ? "default" : "pointer", color: "#eff8ff", background: answered && correct ? "rgba(66,191,120,.15)" : answered && selected ? "rgba(206,75,95,.17)" : "rgba(255,255,255,.045)", lineHeight: 1.45 }}>{choice}</button>; })}</div>{answered ? <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: 13, borderRadius: 14, color: picked === ayah.translation ? "#c9f9dc" : "#ffe0e3", background: picked === ayah.translation ? "rgba(59,192,119,.15)" : "rgba(214,81,101,.15)" }}><strong>{picked === ayah.translation ? "Correct — mastery rises." : "Marked for focused review."}</strong><button type="button" onClick={next} className="cosmic-button">{index === unit.ayahs.length - 1 ? "View summary" : "Next ayah"}</button></div> : null}</section>;
}
