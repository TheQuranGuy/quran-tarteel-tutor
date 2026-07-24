"use client";

export default function QuestionCard({ title, question, children }) {
  return (
    <section className="cosmic-question-card" style={{ padding: "clamp(16px,4vw,28px)", border: "1px solid rgba(180,215,255,.18)", borderRadius: 22, background: "rgba(255,255,255,.045)" }}>
      <p className="cosmic-question-label" style={{ margin: 0, color: "#a9c8ff", fontSize: 12, fontWeight: 900, letterSpacing: ".12em" }}>{title}</p>
      <h2 style={{ margin: "9px 0 14px", fontSize: "clamp(1.35rem,4vw,2rem)" }}>{question}</h2>
      {children}
    </section>
  );
}
