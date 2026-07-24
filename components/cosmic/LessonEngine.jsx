"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AudioPlayer from "../AudioPlayer";
import { addXP, markAyahMastered, updateUser } from "../../lib/user";
import LivesBar from "./LivesBar";
import MascotMale from "./MascotMale";
import MascotFemale from "./MascotFemale";
import RewardChest from "./RewardChest";

const TYPES = [
  ["listen", "Listen"], ["read", "Read"], ["memorise", "Memorise"], ["meaning", "Meaning quiz"], ["recitation", "Recitation"], ["choice", "Multiple choice"], ["blank", "Fill the blank"], ["weak", "Weak ayah review"], ["daily", "Daily challenge"],
];
const QUIZZES = new Set(["meaning", "choice", "blank", "daily"]);

const shell = { maxWidth: 850, margin: "0 auto", padding: "clamp(18px,4vw,38px)", border: "1px solid rgba(156,222,255,.25)", borderRadius: 28, background: "linear-gradient(145deg,rgba(16,34,78,.96),rgba(10,13,43,.98))", boxShadow: "0 30px 95px rgba(0,0,0,.42)" };
const action = { padding: "12px 16px", border: "none", borderRadius: 13, cursor: "pointer", color: "#071528", background: "#98eaff", fontWeight: 900 };

function AnswerChoices({ ayah, onAnswer, mode }) {
  const options = useMemo(() => [ayah.translation, "A description of worldly trade only", "A verse about travelling routes only", "A historical list without guidance"], [ayah]);
  if (mode === "blank") return <div><p style={{ color: "#c9d8eb" }}>Complete the meaning: &quot;{ayah.translation.split(" ").slice(0, -1).join(" ")} ...&quot;</p><button type="button" style={action} onClick={() => onAnswer(true)}>{ayah.translation.split(" ").at(-1)}</button></div>;
  return <div>{options.map((option, index) => <button key={option} type="button" onClick={() => onAnswer(index === 0)} style={{ display: "block", width: "100%", marginTop: 10, padding: 14, border: "1px solid rgba(165,231,255,.24)", borderRadius: 14, cursor: "pointer", color: "#edf8ff", background: "rgba(255,255,255,.06)", textAlign: "left", fontWeight: 700 }}>{option}</button>)}</div>;
}

export default function LessonEngine({ ayah, user, initialType = "listen", onExit, multiplier = 1, challengeExpired = false }) {
  const [type, setType] = useState(initialType);
  const [lives, setLives] = useState(3);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const isQuiz = QUIZZES.has(type);
  const Mascot = user?.cosmicGuide === "female" ? MascotFemale : MascotMale;

  function finish(label = "Lesson complete") {
    markAyahMastered(ayah.id);
    updateUser({ cosmicLastAyah: ayah.id, cosmicLastLesson: type });
    setMessage(label);
    setComplete(true);
  }
  function answer(correct) {
    if (challengeExpired && type === "daily") {
      setMessage("The star timer has faded. Try tomorrow's challenge.");
      return;
    }
    if (correct) {
      addXP((type === "daily" ? 12 : 6) * multiplier, `${type} challenge`);
      finish("Correct. Your path shines brighter.");
      return;
    }
    setLives((current) => Math.max(0, current - 1));
    setMessage(lives <= 1 ? "No lives left—review the ayah and try another lesson." : "Not quite. Listen once more and try again.");
  }

  let body;
  if (complete) body = <div style={{ textAlign: "center" }}><h2 style={{ marginTop: 0 }}>Ayah mastered</h2><p style={{ color: "#c6d8e9" }}>{message}</p><RewardChest id={`cosmic-lesson-${ayah.id}`} reward={15} label="Cosmic lesson chest" /><div style={{ marginTop: 16 }}><button type="button" style={action} onClick={onExit}>Back to path</button></div></div>;
  else if (type === "listen") body = <><p style={{ color: "#c6d8e9" }}>Listen with full attention, then continue when you are ready.</p><AudioPlayer ayah={ayah} /><button type="button" style={{ ...action, marginTop: 18 }} onClick={() => finish("Listening complete. Beautiful focus.")}>I listened</button></>;
  else if (type === "read") body = <><p dir="rtl" style={{ fontFamily: "serif", fontSize: "clamp(2rem,6vw,4rem)", lineHeight: 1.75, textAlign: "right" }}>{ayah.arabic}</p><p style={{ color: "#c6d8e9", fontSize: 18 }}>{ayah.translation}</p><button type="button" style={action} onClick={() => finish("Reading complete. Keep building your connection.")}>I read it</button></>;
  else if (type === "memorise") body = <><p style={{ color: "#c6d8e9" }}>Try from memory, then reveal it only when needed.</p><p dir="rtl" style={{ minHeight: 120, padding: 18, borderRadius: 18, background: "rgba(0,0,0,.2)", fontFamily: "serif", fontSize: "clamp(2rem,6vw,3.6rem)", textAlign: "right" }}>{revealed ? ayah.arabic : "••••••••••••••"}</p><button type="button" style={action} onClick={() => setRevealed((value) => !value)}>{revealed ? "Hide ayah" : "Reveal ayah"}</button><button type="button" style={{ ...action, marginLeft: 10, background: "#a7f3d0" }} onClick={() => finish("Memorisation practice complete.")}>I practised it</button></>;
  else if (type === "recitation") body = <><p dir="rtl" style={{ fontFamily: "serif", fontSize: "clamp(2rem,6vw,3.6rem)", textAlign: "right" }}>{ayah.arabic}</p><p style={{ color: "#c6d8e9" }}>Recite aloud, then use the audio to compare gently.</p><AudioPlayer ayah={ayah} /><button type="button" style={{ ...action, marginTop: 18 }} onClick={() => finish("Recitation practice complete.")}>I practised aloud</button></>;
  else if (type === "weak") body = <><p style={{ color: "#c6d8e9" }}>A calm review makes hard ayahs feel familiar.</p><p dir="rtl" style={{ fontFamily: "serif", fontSize: "clamp(2rem,6vw,3.6rem)", textAlign: "right" }}>{ayah.arabic}</p><p style={{ color: "#c6d8e9" }}>{ayah.translation}</p><button type="button" style={action} onClick={() => finish("Weak ayah reviewed and strengthened.")}>Mark reviewed</button></>;
  else body = <AnswerChoices ayah={ayah} mode={type} onAnswer={answer} />;

  return <motion.section initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} style={shell}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}><div><p style={{ margin: 0, color: "#a8e9ff", fontSize: 12, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase" }}>Cosmic lesson engine</p><h1 style={{ margin: "6px 0 0" }}>Ayah {ayah.number}</h1></div>{isQuiz ? <LivesBar lives={lives} /> : null}</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0" }}>{TYPES.map(([id, label]) => <button key={id} type="button" onClick={() => { setType(id); setMessage(""); setComplete(false); setLives(3); }} style={{ padding: "7px 10px", border: type === id ? "1px solid #a8e9ff" : "1px solid rgba(255,255,255,.13)", borderRadius: 999, cursor: "pointer", color: "#e7f6ff", background: type === id ? "rgba(115,213,255,.2)" : "transparent", fontSize: 12, fontWeight: 800 }}>{label}</button>)}</div>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 125px", gap: 16, alignItems: "center", padding: "clamp(15px,3vw,26px)", borderRadius: 20, background: "rgba(255,255,255,.045)" }}><div>{body}{message && !complete ? <p style={{ color: "#ffe39b", fontWeight: 700 }}>{message}</p> : null}</div><Mascot compact energetic={complete || message.startsWith("Correct")} /></div>
    {!complete ? <button type="button" onClick={onExit} style={{ marginTop: 17, border: "none", color: "#c6d8e9", background: "transparent", cursor: "pointer", fontWeight: 800 }}>Exit lesson</button> : null}
  </motion.section>;
}
