"use client";

import { useState } from "react";
import MascotMale from "../../../components/cosmic/MascotMale";
import MascotFemale from "../../../components/cosmic/MascotFemale";
import { getUser, updateUser } from "../../../lib/user";

export default function CosmicMascotsPage() {
  const [guide, setGuide] = useState(() => getUser().cosmicGuide || "male");
  function choose(value) { setGuide(value); updateUser({ cosmicGuide: value }); }
  return <main style={{ minHeight: "100vh", padding: "64px 16px", color: "#eefaff", background: "radial-gradient(circle at 50% 20%,#3a2367,transparent 34%),#06091e" }}><section style={{ width: "min(720px,100%)", margin: "0 auto", textAlign: "center" }}><h1>Choose your cosmic guide</h1><p style={{ color: "#bdcde2" }}>You can change guides any time without affecting your learning progress.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 18, marginTop: 30 }}><button type="button" onClick={() => choose("male")} style={{ border: guide === "male" ? "2px solid #9fefff" : "1px solid rgba(255,255,255,.2)", borderRadius: 24, color: "#fff", background: "rgba(23,54,105,.5)", cursor: "pointer" }}><MascotMale energetic={guide === "male"} /><strong>Male cosmic Sheikh</strong></button><button type="button" onClick={() => choose("female")} style={{ border: guide === "female" ? "2px solid #f0b6ff" : "1px solid rgba(255,255,255,.2)", borderRadius: 24, color: "#fff", background: "rgba(91,35,111,.5)", cursor: "pointer" }}><MascotFemale energetic={guide === "female"} /><strong>Female cosmic Sheikh</strong></button></div></section></main>;
}
