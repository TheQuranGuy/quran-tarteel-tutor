"use client";

import { useMemo, useState } from "react";
import ChallengeLives from "./ChallengeLives";
import ChallengeProgress from "./ChallengeProgress";
import ChallengeTimer from "./ChallengeTimer";

function makeOptions(question, translations, index) {
  const wrong = translations.filter((translation) => translation !== question.translation);
  const choices = [question.translation, ...wrong.slice((index * 2) % Math.max(1, wrong.length), ((index * 2) % Math.max(1, wrong.length)) + 3)];
  while (choices.length < 4 && wrong.length) choices.push(wrong[choices.length % wrong.length]);
  return choices.slice(0, 4).sort((left, right) => (left === question.translation ? -1 : right === question.translation ? 1 : left.localeCompare(right)));
}

export default function ChallengeQuiz({ questions, translations, onAwardXp, onComplete }) {
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState("");
  const question = questions[index];
  const options = useMemo(() => makeOptions(question, translations, index), [question, translations, index]);

  function finish() { onComplete({ score: correct, total: questions.length, xp, lives }); }
  function answer(choice) {
    if (answered) return;
    const isCorrect = choice === question.translation;
    setPicked(choice);
    setAnswered(true);
    if (isCorrect) {
      const reward = 20;
      setCorrect((value) => value + 1);
      setXp((value) => value + reward);
      onAwardXp(reward);
    } else setLives((value) => Math.max(0, value - 1));
  }
  function next() {
    if (lives === 0 || index === questions.length - 1) {
      onComplete({ score: correct, total: questions.length, xp, lives });
      return;
    }
    setIndex((value) => value + 1);
    setAnswered(false);
    setPicked("");
  }
  function timeout() { onComplete({ score: correct, total: questions.length, xp, lives, timedOut: true }); }

  return <section className="cosmic-bright-card cosmic-challenge-card" style={{ padding: "clamp(18px,4vw,34px)", borderRadius: 26, display: "grid", gap: 24 }}>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><ChallengeProgress current={index + 1} total={questions.length} correct={correct} xp={xp} /><ChallengeTimer onExpire={timeout} /><ChallengeLives lives={lives} /></header>
    <div className="cosmic-question-card" style={{ padding: "clamp(18px,4vw,32px)", borderRadius: 22, background: "rgba(120,151,255,.09)", border: "1px solid rgba(157,225,255,.18)" }}><p className="cosmic-review-label" style={{ margin: 0, color: "#ffd98b", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>{question.surahName.toUpperCase()} · AYAH {question.number}</p><h2 style={{ margin: "10px 0 0", fontSize: "clamp(1.65rem,4vw,2.55rem)", lineHeight: 1.08 }}>Which meaning belongs to this ayah?</h2></div>
    <div style={{ display: "grid", gap: 10 }}>{options.map((choice) => {
      const isCorrect = choice === question.translation;
      const selected = picked === choice;
      const tone = answered ? (isCorrect ? "#83efbd" : selected ? "#ff939e" : "rgba(255,255,255,.13)") : "rgba(255,255,255,.13)";
      const choiceState = answered && isCorrect ? "is-correct" : answered && selected ? "is-wrong" : "";
      return <button type="button" className={`cosmic-challenge-answer ${choiceState}`} key={choice} disabled={answered} onClick={() => answer(choice)} style={{ textAlign: "left", padding: "15px 16px", borderRadius: 15, border: `1px solid ${tone}`, cursor: answered ? "default" : "pointer", color: "#eef7ff", background: selected && !isCorrect ? "rgba(220,86,100,.17)" : isCorrect && answered ? "rgba(73,194,125,.17)" : "rgba(255,255,255,.05)", fontSize: 15, lineHeight: 1.45 }}>{choice}</button>;
    })}</div>
    {answered ? <div className="cosmic-challenge-feedback" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", padding: 14, borderRadius: 15, background: picked === question.translation ? "rgba(75,197,132,.16)" : "rgba(224,112,121,.16)", color: picked === question.translation ? "#c5f8db" : "#ffe0e4" }}><strong>{picked === question.translation ? "Correct — your star brightens." : lives === 0 ? "Your trial ends here. Learn from the answer." : "Not quite — keep this ayah in your orbit."}</strong><button type="button" onClick={next} className="cosmic-button">{lives === 0 || index === questions.length - 1 ? "View summary" : "Next question"}</button></div> : null}
  </section>;
}
