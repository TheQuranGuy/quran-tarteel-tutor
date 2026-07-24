"use client";

import MascotMale from "../../../../components/cosmic/MascotMale";
import MascotFemale from "../../../../components/cosmic/MascotFemale";

export default function ProfileMascot({ guide, streak }) { const Mascot = guide === "female" ? MascotFemale : MascotMale; return <section className="cosmic-bright-card" style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: 16, alignItems: "center", padding: 18, borderRadius: 20 }}><Mascot energetic={streak > 0} /><div><p style={{ margin: 0, color: "#ffdc8a", fontSize: 11, fontWeight: 900 }}>YOUR COSMIC GUIDE</p><h2 style={{ margin: "5px 0" }}>{guide === "female" ? "Cosmic Sheikhah" : "Cosmic Sheikh"}</h2><p style={{ margin: 0, color: "#c3d3e9", fontSize: 13, lineHeight: 1.5 }}>Your guide stays alongside your learning path, review orbit, and daily goals.</p></div></section>; }
