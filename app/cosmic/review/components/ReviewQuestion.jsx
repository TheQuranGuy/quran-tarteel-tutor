"use client";

import ReviewAnswerButton from "./ReviewAnswerButton";

export default function ReviewQuestion({ ayah, onAnswer, answered, correct }) {
  const options = [ayah.translation, "A description of worldly trade", "A travelling route", "A line without guidance"];
  return (
    <section className="cosmic-review-question" style={{ padding: "clamp(18px,4vw,30px)", border: "1px solid rgba(183,216,255,.2)", borderRadius: 24, color: "#edf6ff", background: "rgba(255,255,255,.055)" }}>
      <p className="cosmic-review-label" style={{ margin: 0, color: "#ffd98b", fontSize: 12, fontWeight: 900, letterSpacing: ".12em" }}>MEMORY CHECK</p>
      <p dir="rtl" className="cosmic-arabic" style={{ padding: 14, margin: "12px 0", fontFamily: "serif", fontSize: "clamp(2rem,6vw,3.8rem)", textAlign: "right" }}>{ayah.arabic}</p>
      <h2>Choose the closest meaning.</h2>
      {options.map((option, index) => <ReviewAnswerButton key={option} onClick={() => !answered && onAnswer(index === 0)} state={answered ? index === 0 ? "correct" : correct === false ? "wrong" : undefined : undefined}>{option}</ReviewAnswerButton>)}
    </section>
  );
}
