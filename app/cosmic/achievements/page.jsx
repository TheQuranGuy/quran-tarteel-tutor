"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addXP } from "../../../lib/user";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import AchievementCard from "./components/AchievementCard";
import AchievementCategory from "./components/AchievementCategory";
import AchievementModal from "./components/AchievementModal";

const UNLOCKS_KEY = "sheikhduo-cosmic-achievement-unlocks";
const CATEGORIES = ["Progression", "Mastery", "Streak", "XP", "Challenge", "Review", "Special"];
const ACHIEVEMENTS = [
  ["first-surah", "Progression", "First constellation", "Complete your first surah.", "✦", "surahs", 1, 20],
  ["five-surahs", "Progression", "Five worlds", "Complete five surahs.", "◉", "surahs", 5, 60],
  ["ten-surahs", "Progression", "Orbit builder", "Complete ten surahs.", "🪐", "surahs", 10, 120],
  ["hundred-ayahs", "Progression", "Century of ayahs", "Master one hundred ayahs.", "☄", "ayahs", 100, 100],
  ["five-hundred-ayahs", "Progression", "Qur'an voyager", "Master five hundred ayahs.", "🌌", "ayahs", 500, 300],
  ["one-mastered-surah", "Mastery", "World mastered", "Master every available ayah in one surah world.", "◈", "masteredSurahs", 1, 75],
  ["five-mastered-surahs", "Mastery", "Fivefold light", "Master five surah worlds.", "✺", "masteredSurahs", 5, 160],
  ["ten-mastered-surahs", "Mastery", "Master of orbits", "Master ten surah worlds.", "✹", "masteredSurahs", 10, 320],
  ["seven-streak", "Streak", "Steady flame", "Keep a seven-day learning streak.", "🔥", "streak", 7, 50],
  ["thirty-streak", "Streak", "Luminous month", "Keep a thirty-day learning streak.", "🌙", "streak", 30, 150],
  ["hundred-streak", "Streak", "Unbroken orbit", "Keep a one hundred-day learning streak.", "🌞", "streak", 100, 400],
  ["xp-thousand", "XP", "Star collector", "Earn one thousand XP.", "💫", "xp", 1000, 75],
  ["xp-ten-thousand", "XP", "Nebula scholar", "Earn ten thousand XP.", "🌠", "xp", 10000, 250],
  ["xp-fifty-thousand", "XP", "Cosmic legacy", "Earn fifty thousand XP.", "🛰", "xp", 50000, 600],
  ["challenge-three", "Challenge", "Trial starter", "Complete three daily cosmic trials.", "⚡", "challenges", 3, 60],
  ["challenge-seven", "Challenge", "Trial rhythm", "Complete seven daily cosmic trials.", "🏹", "challenges", 7, 140],
  ["challenge-thirty", "Challenge", "Trial champion", "Complete thirty daily cosmic trials.", "🏆", "challenges", 30, 350],
  ["review-ten", "Review", "Memory healer", "Strengthen ten ayahs through focused practice.", "🩵", "reviewed", 10, 70],
  ["review-fifty", "Review", "Clearer constellations", "Strengthen fifty ayahs through focused practice.", "🔮", "reviewed", 50, 180],
  ["review-two-hundred", "Review", "Memory guardian", "Strengthen two hundred ayahs through focused practice.", "🛡", "reviewed", 200, 400],
  ["first-login", "Special", "First light", "Begin your Quran Tarteel learning journey.", "✨", "loggedIn", 1, 15],
  ["galaxy-explorer", "Special", "Galaxy explorer", "Travel beyond your first surah world.", "🚀", "explored", 1, 35],
  ["first-recitation", "Special", "Listening star", "Listen to your first ayah recitation.", "🎧", "listened", 1, 25],
];

function readUnlocks() { try { return JSON.parse(window.localStorage.getItem(UNLOCKS_KEY) || "[]"); } catch { return []; } }
function saveUnlocks(ids) { window.localStorage.setItem(UNLOCKS_KEY, JSON.stringify(ids)); }
function challengeCount() {
  return Object.keys(window.localStorage).filter((key) => {
    if (!key.startsWith("sheikhduo-cosmic-challenge-")) return false;
    try { return JSON.parse(window.localStorage.getItem(key) || "null")?.completed; } catch { return false; }
  }).length;
}

export default function CosmicAchievementsPage() {
  const user = useCosmicUser();
  const [active, setActive] = useState("Progression");
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [challengeRuns, setChallengeRuns] = useState(0);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(null);
  const metrics = useMemo(() => {
    const mastered = new Set(user.ayahsMastered || []);
    const masteredSurahs = COSMIC_UNITS.filter((unit) => unit.ayahs.every((ayah) => mastered.has(ayah.id))).length;
    return { surahs: (user.surahsCompleted || []).length, ayahs: mastered.size, masteredSurahs, streak: user.streak || 0, xp: user.xp || 0, challenges: challengeRuns, reviewed: mastered.size, loggedIn: user.lastActive ? 1 : 0, explored: Number(user.lastSurahId) > 1 ? 1 : 0, listened: (user.ayahsListened || []).length };
  }, [challengeRuns, user]);
  const achievements = useMemo(() => ACHIEVEMENTS.map(([id, category, name, description, icon, metric, target, xp]) => {
    const value = metrics[metric] || 0;
    const unlocked = value >= target || unlockedIds.includes(id);
    return { id, category, name, description, icon, metric, target, xp, value, unlocked, justUnlocked: false };
  }), [metrics, unlockedIds]);
  const visible = achievements.filter((achievement) => achievement.category === active);

  useEffect(() => {
    setUnlockedIds(readUnlocks());
    setChallengeRuns(challengeCount());
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || selected) return;
    const newlyUnlocked = achievements.find((achievement) => achievement.unlocked && !unlockedIds.includes(achievement.id));
    if (!newlyUnlocked) return;
    const nextIds = [...unlockedIds, newlyUnlocked.id];
    saveUnlocks(nextIds);
    setUnlockedIds(nextIds);
    addXP(newlyUnlocked.xp, `Achievement: ${newlyUnlocked.name}`);
    setSelected({ ...newlyUnlocked, justUnlocked: true });
  }, [achievements, ready, selected, unlockedIds]);

  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}>
    <StarParticles count={52} color="#f9d88a" />
    <section style={{ position: "relative", width: "min(980px,100%)", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap", marginBottom: 26 }}><div><p style={{ margin: 0, color: "#ffdc8a", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC REWARDS</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Your achievements.</h1><p style={{ maxWidth: 550, margin: 0, color: "#c4d3e9", lineHeight: 1.6 }}>Every small step adds another light to your learning constellation.</p></div><div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><Link href="/cosmic/profile" className="cosmic-button cosmic-button--outline">Profile</Link><Link href="/cosmic/path" className="cosmic-button">Learning path</Link></div></header>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 18 }}>{CATEGORIES.map((category) => <AchievementCategory key={category} label={category} active={active === category} onClick={() => setActive(category)} />)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 13 }}>{visible.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} onOpen={setSelected} />)}</div>
    </section>
    <AchievementModal achievement={selected} onClose={() => setSelected(null)} />
  </main>;
}
