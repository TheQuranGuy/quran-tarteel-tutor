"use client";

const suggestions = [["Explain Bismillah", "Explain this ayah"], ["Show grammar", "Break down grammar"], ["Give tajweed tips", "Give me tajweed tips"], ["Help me memorise", "Help me memorise"], ["My progress", "Show my progress"], ["Recommend next step", "Recommend a lesson"]];

export default function TutorSuggestions({ onSelect }) {
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{suggestions.map(([label, prompt]) => <button type="button" key={label} onClick={() => onSelect(prompt)} className="cosmic-tutor-chip" style={{ padding: "8px 10px", fontSize: 12 }}>{label}</button>)}</div>;
}
