"use client";

const suggestions = [
  ["Al-Mulk", "What is Surah Al-Mulk about?"],
  ["Ayah count", "How many ayahs are in Al-Ikhlas?"],
  ["Memorise", "Help me memorise a short surah"],
  ["Tajweed", "How do I fix a shaddah mistake?"],
  ["Recitation", "How do I correct recurring recitation mistakes?"],
  ["Beginner path", "Where should a beginner start?"],
];

export default function TutorSuggestions({ onSelect }) {
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{suggestions.map(([label, prompt]) => <button type="button" key={label} onClick={() => onSelect(prompt)} className="cosmic-tutor-chip" style={{ padding: "8px 10px", fontSize: 12 }}>{label}</button>)}</div>;
}
