"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AudioPlayer from "./AudioPlayer";
import LivesBar from "./LivesBar";
import MascotMale from "./MascotMale";
import MascotFemale from "./MascotFemale";
import RewardChest from "./RewardChest";
import { addXP, markAyahMastered, updateUser } from "../lib/user";

const quizTypes = new Set(["meaning-quiz", "multiple-choice", "fill-blank", "daily-challenge"]);

const lessonSteps = [
  { type: "listen", title: "Listen to ayah" },
  { type: "read", title: "Read ayah" },
  { type: "memorise", title: "Memorise ayah" },
  { type: "meaning-quiz", title: "Meaning quiz" },
  { type: "recitation", title: "Recitation practice" },
  { type: "multiple-choice", title: "Multiple choice" },
  { type: "fill-blank", title: "Fill in the blank" },
  { type: "weak-review", title: "Weak ayah review" },
  { type: "daily-challenge", title: "Daily challenge" },
];

const styles = {
  shell: { display: "grid", gap: 16, padding: 20, border: "1px solid rgba(189,242,208,.16)", borderRadius: 18, background: "rgba(8,19,15,.94)", boxShadow: "0 24px 80px rgba(0,0,0,.32)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  title: { margin: 0, fontSize: "clamp(1.6rem,4vw,2.5rem)" },
  card: { padding: 18, border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, background: "rgba(255,255,255,.05)" },
  arabic: { margin: "10px 0", fontSize: "clamp(2rem,7vw,3.5rem)", lineHeight: 1.8, direction: "rtl", textAlign: "right", fontFamily: "Times New Roman, serif" },
  translation: { color: "#b2c6ba", lineHeight: 1.6 },
  buttonRow: { display: "flex", flexWrap: "wrap", gap: 10 },
  primary: { padding: "12px 16px", borderRadius: 12, border: "1px solid #79e5aa", background: "#79e5aa", color: "#062112", fontWeight: 900 },
  secondary: { padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(189,242,208,.18)", background: "transparent", color: "#f4f9f5", fontWeight: 900 },
  option: { display: "block", width: "100%", marginTop: 10, padding: 12, borderRadius: 12, border: "1px solid rgba(189,242,208,.16)", color: "#f4f9f5", background: "rgba(255,255,255,.05)", textAlign: "left" },
};

function makeOptions(ayah) {
  return [
    ayah.translation || "Guidance from Allah",
    "A description of worldly trade only",
    "A historical list without meaning",
    "A line about travel routes only",
  ];
}

export default function LessonEngine({ ayah, user, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const step = lessonSteps[stepIndex];
  const options = useMemo(() => makeOptions(ayah), [ayah]);
  const Mascot = user?.cosmicGuide === "female" ? MascotFemale : MascotMale;
  const quizStep = quizTypes.has(step.type);

  function next() {
    setFeedback("");
    if (stepIndex < lessonSteps.length - 1) setStepIndex((index) => index + 1);
    else {
      setFinished(true);
      markAyahMastered(ayah.id);
      updateUser({ lastLessonType: step.type, lastSurahId: Number(ayah.id.split("-")[0]) });
    }
  }

  function answer(correct) {
    if (correct) {
      setFeedback("Correct. Nice focus.");
      addXP(step.type === "daily-challenge" ? 12 : 6, step.title);
      window.setTimeout(next, 500);
      return;
    }
    setLives((value) => Math.max(0, value - 1));
    setFeedback("Try again. Read the meaning once more.");
  }

  return (
    <motion.section style={styles.shell} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <header style={styles.header}>
        <div>
          <p style={{ margin: 0, color: "#79e5aa", fontSize: 12, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" }}>Lesson engine</p>
          <h2 style={styles.title}>{step.title}</h2>
        </div>
        {quizStep && <LivesBar lives={lives} />}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 170px", gap: 16, alignItems: "center" }}>
        <article style={styles.card}>
          {step.type === "listen" && <><AudioPlayer ayah={ayah} /><p style={styles.translation}>Listen closely before moving on.</p></>}
          {step.type === "read" && <><p style={styles.arabic}>{ayah.arabic}</p><p style={styles.translation}>{ayah.translation}</p></>}
          {step.type === "memorise" && <><p style={styles.arabic}>{revealed ? ayah.arabic : "...................."}</p><button style={styles.secondary} type="button" onClick={() => setRevealed(!revealed)}>{revealed ? "Hide" : "Reveal"}</button></>}
          {step.type === "recitation" && <><p style={styles.arabic}>{ayah.arabic}</p><p style={styles.translation}>Recite aloud, then play the audio to compare.</p><AudioPlayer ayah={ayah} /></>}
          {step.type === "weak-review" && <><p style={styles.arabic}>{ayah.arabic}</p><p style={styles.translation}>Review this ayah slowly, then mark it mastered.</p></>}
          {quizStep && <><p style={styles.translation}>Choose the closest meaning:</p>{options.map((option, index) => <button key={option} style={styles.option} type="button" onClick={() => answer(index === 0)}>{option}</button>)}</>}
          {feedback && <p style={{ color: feedback.startsWith("Correct") ? "#79e5aa" : "#fff39c", marginTop: 12 }}>{feedback}</p>}
        </article>
        <Mascot mood={feedback.startsWith("Correct") || finished ? "energetic" : "calm"} />
      </div>

      {finished ? (
        <div style={styles.card}>
          <h3>Ayah lesson complete</h3>
          <RewardChest id={`lesson-${ayah.id}`} reward={15} label="Lesson chest" />
        </div>
      ) : (
        <div style={styles.buttonRow}>
          {!quizStep && <button style={styles.primary} type="button" onClick={next}>Continue</button>}
          <button style={styles.secondary} type="button" onClick={onClose}>Close lesson</button>
        </div>
      )}
    </motion.section>
  );
}
