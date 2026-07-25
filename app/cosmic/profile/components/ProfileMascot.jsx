"use client";

import MascotMale from "../../../../components/cosmic/MascotMale";
import MascotFemale from "../../../../components/cosmic/MascotFemale";

export default function ProfileMascot({ guide, streak, onChange }) {
  const Mascot = guide === "female" ? MascotFemale : MascotMale;
  return <section className="cosmic-bright-card" style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: 16, alignItems: "center", padding: 18, borderRadius: 20 }}><Mascot energetic={streak > 0} /><div><p style={{ margin: 0, color: "#ffdc8a", fontSize: 11, fontWeight: 900 }}>YOUR COSMIC GUIDE</p><h2 style={{ margin: "5px 0" }}>{guide === "female" ? "Cosmic Sheikhah" : "Cosmic Sheikh"}</h2><p style={{ margin: 0, color: "#c3d3e9", fontSize: 13, lineHeight: 1.5 }}>Your guide stays alongside your learning path, review orbit, and daily goals.</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}><button type="button" onClick={() => onChange?.("male")} className={guide === "male" ? "cosmic-button" : "cosmic-button cosmic-button--outline"} aria-pressed={guide === "male"}>Male guide</button><button type="button" onClick={() => onChange?.("female")} className={guide === "female" ? "cosmic-button" : "cosmic-button cosmic-button--outline"} aria-pressed={guide === "female"}>Female guide</button></div></div></section>;
}
