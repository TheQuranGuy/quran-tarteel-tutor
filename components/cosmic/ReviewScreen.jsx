"use client";

import { useMemo, useState } from "react";
import { getUser } from "../../lib/user";
import { COSMIC_UNITS, getCosmicAyah } from "../../lib/cosmic";
import AyahTile from "./AyahTile";
import LessonEngine from "./LessonEngine";
import StreakFlame from "./StreakFlame";

export default function ReviewScreen() {
  const [user, setUser] = useState(() => getUser());
  const [active, setActive] = useState(null);
  const queue = useMemo(() => {
    const weak = (user.weakAyahs || []).map(getCosmicAyah).filter(Boolean);
    return weak.length ? weak : COSMIC_UNITS.flatMap((unit) => unit.ayahs).filter((ayah) => !(user.ayahsMastered || []).includes(ayah.id));
  }, [user]);
  if (active) return <main style={{ minHeight: "100vh", padding: "38px 16px", color: "#eefaff", background: "radial-gradient(circle at 75% 18%,#1d596a,transparent 32%),#05091d" }}><LessonEngine ayah={active} user={user} initialType="weak" onExit={() => { setUser(getUser()); setActive(null); }} /></main>;
  return <main style={{ minHeight: "100vh", padding: "42px 16px 85px", color: "#eefaff", background: "radial-gradient(circle at 78% 18%,#1b5970,transparent 30%),radial-gradient(circle at 18% 80%,#2c1764,transparent 30%),#05091d" }}><section style={{ width: "min(850px,100%)", margin: "0 auto" }}><header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}><div><h1 style={{ margin: 0, fontSize: "clamp(2.4rem,7vw,4.7rem)", letterSpacing: "-.055em" }}>Your review orbit</h1><p style={{ color: "#bdd0e5", maxWidth: 560, lineHeight: 1.6 }}>Return to the ayahs that benefit from a little more attention. Each calm review strengthens your path.</p></div><StreakFlame streak={user.streak || 0} /></header><div style={{ marginTop: 26, padding: 18, border: "1px solid rgba(163,230,255,.2)", borderRadius: 20, background: "rgba(10,25,62,.7)" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}><strong>{queue.length ? `${queue.length} ayah${queue.length === 1 ? "" : "s"} in your queue` : "Your review orbit is clear"}</strong><span style={{ color: "#a7f3d0", fontWeight: 850 }}>Review rewards use your existing XP system</span></div>{queue.length ? <div style={{ display: "grid", gap: 10 }}>{queue.map((ayah) => <AyahTile key={ayah.id} ayah={ayah} mastered={false} onOpen={() => setActive(ayah)} />)}</div> : <p style={{ color: "#bcd2e4" }}>Start any path lesson to build a personal review queue.</p>}</div></section></main>;
}
