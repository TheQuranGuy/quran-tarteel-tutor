"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { addXP, getUser, markAyahMastered, markSurahCompleted, updateUser } from "../../../../lib/user";
import { getCosmicUnit } from "../../../../lib/cosmic";
import { useCosmicUser } from "../../../../components/cosmic/useCosmicUser";
import StarParticles from "../../../../components/cosmic/StarParticles";
import LessonHeader from "./LessonHeader";
import LessonFooter from "./LessonFooter";
import XPBubble from "./XPBubble";
import QuestionCard from "./QuestionCard";
import AnswerButton from "./AnswerButton";
import AudioPlayer from "./AudioPlayer";
import MeaningCard from "./MeaningCard";
import RewardChest from "./RewardChest";
import InteractiveAyah from "../../../../components/cosmic/InteractiveAyah";
import RecitationCoach from "../../../../components/cosmic/RecitationCoach";

const modes = [
  ["listen", "Listen"], ["read", "Read"], ["memorise", "Memorise"], ["meaning", "Meaning quiz"], ["recitation", "Recitation"], ["choice", "Multiple choice"], ["blank", "Fill blank"], ["weak", "Weak review"], ["daily", "Daily challenge"], ["mastery", "Mastery test"], ["speed", "Speed drill"],
];
const quizModes = new Set(["meaning", "choice", "blank", "daily", "mastery", "speed"]);

function Choices({ ayah, mode, onAnswer, disabled }) {
  const options = useMemo(() => [ayah.translation, "A description of trade", "A list of travel routes", "A line without meaning"], [ayah]);
  const prompt = mode === "blank" ? `Complete the final word: “${ayah.translation.split(" ").slice(0, -1).join(" ")} ...”` : mode === "mastery" ? "Mastery check: choose the exact meaning." : mode === "speed" ? "Fast answer: choose the exact meaning." : "Choose the closest meaning of this ayah.";
  if (mode === "blank") return <QuestionCard title="FILL IN THE BLANK" question={prompt}><AnswerButton onClick={() => onAnswer(true)} disabled={disabled}>{ayah.translation.split(" ").at(-1)}</AnswerButton><AnswerButton onClick={() => onAnswer(false)} disabled={disabled}>Mercy</AnswerButton></QuestionCard>;
  return <QuestionCard title={mode === "daily" ? "DAILY COSMIC CHALLENGE" : "MEANING CHECK"} question={prompt}>{options.map((option, index) => <AnswerButton key={option} onClick={() => onAnswer(index === 0)} disabled={disabled}>{option}</AnswerButton>)}</QuestionCard>;
}

export default function LessonContainer({ ayah }) {
  const router = useRouter();
  const user = useCosmicUser();
  const [mode, setMode] = useState("listen");
  const [lives, setLives] = useState(3);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState("");
  const [completed, setCompleted] = useState(false);
  const [surahComplete, setSurahComplete] = useState(false);
  const [timer, setTimer] = useState(45);
  const quiz = quizModes.has(mode);
  const mastery = user.ayahsMastered?.includes(ayah.id) ? 100 : 0;
  const arabicText = ayah.arabic || ayah.words?.filter((word) => word?.text && word.type !== "end" && word.char_type_name !== "end").map((word) => word.text).join(" ") || "";

  useEffect(() => {
    if (!(["daily", "speed"].includes(mode)) || completed || timer <= 0) return undefined;
    const interval = window.setInterval(() => setTimer((current) => current - 1), 1000);
    return () => window.clearInterval(interval);
  }, [mode, completed, timer]);

  function resetMode(next) { setMode(next); setLives(3); setRevealed(false); setResult(""); setCompleted(false); setTimer(45); }
  function finish(message, bonus = 0) {
    markAyahMastered(ayah.id);
    if (bonus) addXP(bonus, `${mode} lesson`);
    const unit = getCosmicUnit(ayah.id.split("-")[0]);
    const nextUser = getUser();
    if (unit && unit.ayahs.every((item) => nextUser.ayahsMastered.includes(item.id))) { markSurahCompleted(unit.id); setSurahComplete(true); }
    setResult(message);
    setCompleted(true);
  }
  function markWeak() { updateUser((current) => ({ ...current, weakAyahs: [...new Set([...(current.weakAyahs || []), ayah.id])] })); }
  function answer(correct) {
    if (timer <= 0 && ["daily", "speed"].includes(mode)) { markWeak(); setResult("Time is up. This ayah is ready for review."); return; }
    if (correct) { finish("Correct. Your constellation grows brighter.", mode === "daily" ? 12 : mode === "speed" ? 9 : 6); return; }
    markWeak();
    setLives((current) => Math.max(0, current - 1));
    setResult(lives <= 1 ? "No lives left. This ayah was added to your review orbit." : "Not quite. Listen once more, then try again.");
  }

  const backToPath = () => router.push("/cosmic/path");
  let body;
  if (completed) body = <div className="cosmic-completion" style={{ textAlign: "center" }}><h2>Ayah mastered</h2><p style={{ color: "#c9d8ed" }}>{result}</p>{surahComplete ? <RewardChest ayah={ayah} /> : null}<button type="button" className="cosmic-primary-action" onClick={backToPath} style={{ marginTop: 18, border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0c2130", background: "#9ff2ca", fontWeight: 900 }}>Return to learning path</button></div>;
  else if (mode === "listen") body = <><p style={{ color: "#c9d8ed" }}>Listen closely to the recitation, then mark the listening step complete.</p><AudioPlayer ayah={ayah} /><button type="button" className="cosmic-primary-action" onClick={() => finish("Listening complete. Beautiful focus.")} style={{ marginTop: 16, border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0c2130", background: "#9ff2ca", fontWeight: 900 }}>I listened</button></>;
  else if (mode === "read") body = <><p style={{ color: "#c9d8ed", marginTop: 0 }}>Hover or focus a word for its meaning. Click it to hear the word on its own.</p><InteractiveAyah arabicText={arabicText} translation={ayah.translation} ayahId={ayah.id} words={ayah.words} /><MeaningCard ayah={ayah} /><button type="button" className="cosmic-primary-action" onClick={() => finish("Reading complete.")} style={{ marginTop: 16, border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0c2130", background: "#9ff2ca", fontWeight: 900 }}>I read it</button></>;
  else if (mode === "memorise") body = <><p style={{ color: "#c9d8ed" }}>Try from memory, then reveal the ayah only when needed.</p>{revealed ? <InteractiveAyah arabicText={arabicText} translation={ayah.translation} ayahId={ayah.id} words={ayah.words} /> : <p aria-label="Hidden Arabic ayah" dir="rtl" className="cosmic-arabic" style={{ minHeight: 118, padding: 20, borderRadius: 18, color: "#edf6ff", background: "rgba(0,0,0,.18)", fontFamily: "serif", fontSize: "clamp(2.3rem,7vw,4.1rem)", textAlign: "right" }}>....................</p>}<button type="button" className="cosmic-secondary-action" onClick={() => setRevealed((value) => !value)} style={{ border: "1px solid rgba(172,214,255,.3)", borderRadius: 13, padding: "11px 14px", cursor: "pointer", color: "#eaf5ff", background: "transparent", fontWeight: 850 }}>{revealed ? "Hide ayah" : "Reveal ayah"}</button><button type="button" className="cosmic-primary-action" onClick={() => finish("Memorisation practice complete.")} style={{ marginLeft: 9, border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0c2130", background: "#9ff2ca", fontWeight: 900 }}>I practised</button></>;
  else if (mode === "recitation") body = <><p style={{ color: "#c9d8ed", marginTop: 0 }}>Listen to the reference, then let the browser compare the word sequence you recite. It is word-level guidance, not a tajweed verdict.</p><InteractiveAyah arabicText={arabicText} translation={ayah.translation} ayahId={ayah.id} words={ayah.words} /><div style={{ marginTop: 16 }}><AudioPlayer ayah={ayah} /></div><div style={{ marginTop: 18 }}><RecitationCoach arabicText={arabicText} translation={ayah.translation} /></div><button type="button" className="cosmic-primary-action" onClick={() => finish("Recitation practice complete.")} style={{ marginTop: 16, border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0c2130", background: "#9ff2ca", fontWeight: 900 }}>I practised aloud</button></>;
  else if (mode === "weak") body = <><MeaningCard ayah={ayah} /><InteractiveAyah arabicText={arabicText} translation={ayah.translation} ayahId={ayah.id} words={ayah.words} /><button type="button" className="cosmic-primary-action" onClick={() => finish("Review complete. This ayah is stronger now.")} style={{ border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0c2130", background: "#9ff2ca", fontWeight: 900 }}>Mark reviewed</button></>;
  else body = <Choices ayah={ayah} mode={mode} onAnswer={answer} disabled={lives <= 0 || (["daily", "speed"].includes(mode) && timer <= 0)} />;

  return <main className="cosmic-dark cosmic-learning-shell cosmic-lesson-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "clamp(24px,5vw,60px) 16px" }}><StarParticles color="#c5b7ff" /><motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="cosmic-learning-card cosmic-lesson-card" style={{ position: "relative", width: "min(900px,100%)", margin: "0 auto", padding: "clamp(18px,4vw,38px)", border: "1px solid rgba(177,212,255,.22)", borderRadius: 28, background: "linear-gradient(145deg,rgba(19,34,84,.94),rgba(10,15,49,.98))", boxShadow: "0 30px 85px rgba(0,0,0,.35)" }}><XPBubble amount={mode === "daily" ? 12 : 6} visible={completed} /><LessonHeader ayah={ayah} user={user} lives={lives} quiz={quiz} mastery={mastery} excited={completed || result.startsWith("Correct")} /><div className="cosmic-mode-rail" style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "22px 0" }}>{modes.map(([id, label]) => <button key={id} type="button" className={`cosmic-mode-button ${mode === id ? "is-active" : ""}`} onClick={() => resetMode(id)} style={{ border: mode === id ? "1px solid #a9cfff" : "1px solid rgba(255,255,255,.13)", borderRadius: 999, padding: "7px 10px", cursor: "pointer", color: "#eaf5ff", background: mode === id ? "rgba(139,180,255,.22)" : "transparent", fontSize: 12, fontWeight: 800 }}>{label}</button>)}</div>{["daily", "speed"].includes(mode) ? <p className="cosmic-timer-label" style={{ margin: "0 0 12px", color: "#ffe196", fontWeight: 900 }}>STAR TIMER: {timer}s</p> : null}<section className="cosmic-activity-panel" style={{ minHeight: 280, padding: "clamp(15px,3vw,26px)", borderRadius: 20, background: "rgba(255,255,255,.045)" }}>{body}{result && !completed ? <p style={{ color: "#ffe196", fontWeight: 800 }}>{result}</p> : null}</section><LessonFooter onBack={backToPath} step={modes.findIndex(([id]) => id === mode)} total={modes.length} /></motion.section></main>;
}
