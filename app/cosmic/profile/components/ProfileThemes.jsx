"use client";

const options = [["space", "Classic space"], ["dark", "Deep cosmic"], ["bright", "Bright cosmic"], ["nebula", "Nebula mode"], ["emerald", "Emerald calm"], ["gold", "Golden orbit"]];

export default function ProfileThemes({ value, onChange }) {
  return <section className="cosmic-bright-card" style={{ padding: 18, borderRadius: 20 }}><h2 style={{ marginTop: 0 }}>Cosmic theme</h2><p style={{ margin: "0 0 12px", color: "#c3d3e9", fontSize: 13 }}>Choose a background style for Quran Tarteel.</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{options.map(([id, label]) => <button type="button" key={id} onClick={() => onChange(id)} className={value === id ? "cosmic-button" : "cosmic-button cosmic-button--outline"} aria-pressed={value === id}>{label}</button>)}</div></section>;
}
