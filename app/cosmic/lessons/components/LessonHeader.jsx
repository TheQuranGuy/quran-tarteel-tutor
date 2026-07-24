"use client";

import MascotMale from "../../../../components/cosmic/MascotMale";
import MascotFemale from "../../../../components/cosmic/MascotFemale";
import StreakFlame from "./StreakFlame";
import LivesBar from "./LivesBar";
import MasteryRing from "./MasteryRing";

export default function LessonHeader({ ayah, user, lives, quiz, mastery, excited }) {
  const Mascot = user.cosmicGuide === "female" ? MascotFemale : MascotMale;

  return (
    <header className="cosmic-lesson-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Mascot compact energetic={excited} />
        <div>
          <p style={{ margin: 0, color: "#a8c7ff", fontSize: 12, fontWeight: 900, letterSpacing: ".12em" }}>SURAH {ayah.id.split("-")[0]} · AYAH {ayah.number}</p>
          <h1 style={{ margin: "5px 0", fontSize: "clamp(1.7rem,5vw,3rem)" }}>Cosmic lesson</h1>
          <StreakFlame streak={user.streak || 0} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <MasteryRing value={mastery} />
        {quiz ? <LivesBar lives={lives} /> : null}
      </div>
    </header>
  );
}
