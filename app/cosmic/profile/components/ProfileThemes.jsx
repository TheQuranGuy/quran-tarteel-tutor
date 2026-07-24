"use client";

const options = [["dark", "Dark cosmic"], ["bright", "Bright cosmic"], ["nebula", "Nebula mode"]];
export default function ProfileThemes({ value, onChange }) { return <section className="cosmic-bright-card" style={{ padding: 18, borderRadius: 20 }}><h2 style={{ marginTop: 0 }}>Cosmic theme</h2><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{options.map(([id, label]) => <button type="button" key={id} onClick={() => onChange(id)} className={value === id ? "cosmic-button" : "cosmic-button cosmic-button--outline"}>{label}</button>)}</div></section>; }
