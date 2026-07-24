"use client";

export default function LessonFooter({ onBack, step, total }) {
  return (
    <footer className="cosmic-lesson-footer" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 20 }}>
      <button type="button" onClick={onBack} style={{ border: 0, cursor: "pointer", color: "#c9d8ef", background: "transparent", fontWeight: 850 }}>Back to learning path</button>
      <span style={{ color: "#a7b9d8", fontSize: 13, fontWeight: 800 }}>Mode {step + 1} / {total}</span>
    </footer>
  );
}
