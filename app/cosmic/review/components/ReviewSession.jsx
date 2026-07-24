"use client";

import { useState } from "react";
import { addXP, markAyahMastered, updateUser } from "../../../../lib/user";
import ReviewQuestion from "./ReviewQuestion";
import ReviewProgressBar from "./ReviewProgressBar";
import ReviewSummary from "./ReviewSummary";

export default function ReviewSession({ ayahs }) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState(false);
  const ayah = ayahs[index];

  function answer(isCorrect) {
    if (answered) return;
    setAnswered(true);
    setCorrect(isCorrect);
    if (isCorrect) { markAyahMastered(ayah.id); addXP(5, "Review answer"); setScore((value) => value + 1); setXp((value) => value + 5); }
    else updateUser((user) => ({ ...user, weakAyahs: [...new Set([...(user.weakAyahs || []), ayah.id])] }));
  }

  function next() {
    if (index >= ayahs.length - 1) { setDone(true); return; }
    setIndex((value) => value + 1);
    setAnswered(false);
    setCorrect(null);
  }

  if (done) return <ReviewSummary correct={score} total={ayahs.length} xp={xp} />;
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <ReviewProgressBar current={index + 1} total={ayahs.length} />
      <ReviewQuestion ayah={ayah} onAnswer={answer} answered={answered} correct={correct} />
      {answered ? <div className="cosmic-review-feedback" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, color: correct ? "#bff4d9" : "#ffe4a5", background: correct ? "rgba(63,168,112,.18)" : "rgba(197,137,51,.18)" }}><strong>{correct ? "Correct—this ayah is strengthening." : "Keep this ayah in your review orbit."}</strong><button type="button" onClick={next} className="cosmic-button">{index === ayahs.length - 1 ? "View summary" : "Next ayah"}</button></div> : null}
    </section>
  );
}
