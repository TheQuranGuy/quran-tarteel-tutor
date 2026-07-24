"use client";

export default function TutorRecitationFeedback({ fileName }) {
  return <article style={{ padding: 13, borderRadius: 14, color: "#eaf5ff", background: "rgba(8,21,53,.48)", border: "1px solid rgba(177,216,255,.2)" }}><strong>Recitation practice checklist</strong><p style={{ margin: "6px 0", color: "#c4d4ea", lineHeight: 1.5 }}>{fileName ? `“${fileName}” is attached locally. This build cannot acoustically analyse recordings, so use the checklist while you listen back.` : "Record or attach a short recitation to use this self-check checklist."}</p><ul style={{ margin: 0, paddingLeft: 18, color: "#c4d4ea", lineHeight: 1.65 }}><li>Hold the shaddah in اللَّهِ as a gentle doubled lam.</li><li>Keep a steady pace; do not rush the final vowel sounds.</li><li>Compare one phrase at a time with the chosen reciter.</li></ul><p style={{ margin: "9px 0 0", color: "#ffdc8b", fontSize: 12 }}>For a formal recitation evaluation, learn with a qualified teacher.</p></article>;
}
