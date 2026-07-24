"use client";

export default function MeaningCard({ ayah }) {
  return (
    <section className="cosmic-meaning-card" style={{ padding: 22, borderRadius: 20, border: "1px solid rgba(181,215,255,.2)", color: "#e9f4ff", background: "linear-gradient(145deg,rgba(32,57,111,.66),rgba(15,27,66,.72))" }}>
      <p className="cosmic-question-label" style={{ margin: 0, color: "#a9c8ff", fontWeight: 900, fontSize: 12, letterSpacing: ".12em" }}>MEANING</p>
      <p style={{ margin: "12px 0 0", lineHeight: 1.7, fontSize: 18 }}>{ayah.translation}</p>
    </section>
  );
}
