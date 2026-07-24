"use client";

import MascotMale from "../../../components/cosmic/MascotMale";
import MascotFemale from "../../../components/cosmic/MascotFemale";

export default function IntroMascot({ guide = "male" }) { const Mascot = guide === "female" ? MascotFemale : MascotMale; return <div className="cd-intro-mascot" style={{ display: "grid", placeItems: "center" }}><Mascot compact /></div>; }
