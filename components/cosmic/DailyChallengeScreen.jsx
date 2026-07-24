"use client";

import { useEffect, useState } from "react";
import { COSMIC_UNITS } from "../../lib/cosmic";
import { getUser } from "../../lib/user";
import LessonEngine from "./LessonEngine";
import StreakFlame from "./StreakFlame";

export default function DailyChallengeScreen() {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(true);
  useEffect(() => { if (!running || seconds <= 0) return undefined; const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [running, seconds]);
  return <main style={{ minHeight: "100vh", padding: "42px 16px 85px", color: "#eefaff", background: "radial-gradient(circle at 30% 15%,#825314,transparent 34%),radial-gradient(circle at 78% 80%,#35236b,transparent 32%),#09091c" }}><section style={{ width: "min(850px,100%)", margin: "0 auto" }}><header style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}><div><h1 style={{ margin: 0, fontSize: "clamp(2.4rem,7vw,4.7rem)", letterSpacing: "-.055em" }}>Daily cosmic challenge</h1><p style={{ color: "#d8c8a5" }}>Answer before the star timer fades for a 2× XP reward.</p></div><div style={{ padding: "12px 15px", border: "1px solid #ffd76a", borderRadius: 14, color: "#fff2bd", background: "rgba(202,145,42,.15)", fontWeight: 950 }}>{seconds}s · 2× XP</div></header><div style={{ marginBottom: 16 }}><StreakFlame streak={getUser().streak || 0} /></div><LessonEngine ayah={COSMIC_UNITS[0].ayahs[0]} user={getUser()} initialType="daily" multiplier={2} challengeExpired={seconds === 0} onExit={() => { setRunning(false); }} /></section></main>;
}
