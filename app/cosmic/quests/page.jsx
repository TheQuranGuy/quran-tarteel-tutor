"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addXP } from "../../../lib/user";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import QuestList from "./components/QuestList";
import QuestModal from "./components/QuestModal";
import QuestCategoryTabs from "./components/QuestCategoryTabs";

const CLAIMS_KEY = "sheikhduo-cosmic-quest-claims";
const COSMETICS_KEY = "sheikhduo-cosmic-quest-cosmetics";
const CATEGORIES = ["Daily", "Weekly", "Surah", "Mastery", "Review", "Challenge", "Special"];
const QUESTS = [
  ["daily-ayahs", "Daily", "Three bright ayahs", "Complete three ayah-sized learning steps today.", "☀", "dailyAyahs", 3, 20, "Crescent pin", "daily"],
  ["daily-xp", "Daily", "Fuel the nebula", "Earn fifty XP today.", "⚡", "dailyXp", 50, 25, "Aurora trail", "daily"],
  ["daily-review", "Daily", "Gentle repair", "Strengthen two ayahs through today’s practice.", "🩵", "dailyAyahs", 2, 20, "Healing star", "daily"],
  ["weekly-surah", "Weekly", "Weekly world", "Complete a surah during this weekly cycle.", "🪐", "surahs", 1, 45, "Orbit frame", "weekly"],
  ["weekly-xp", "Weekly", "Five-hundred glow", "Reach five hundred total XP.", "🌠", "xp", 500, 75, "Gold comet", "weekly"],
  ["weekly-challenges", "Weekly", "Trial rhythm", "Complete three daily cosmic trials.", "🏹", "challenges", 3, 60, "Trial banner", "weekly"],
  ["baqarah", "Surah", "Al-Baqarah world", "Complete Surah Al-Baqarah.", "🌿", "baqarah", 1, 120, "Garden planet", "permanent"],
  ["mulk", "Surah", "Al-Mulk world", "Complete Surah Al-Mulk.", "👑", "mulk", 1, 100, "Royal moon", "permanent"],
  ["master-one", "Mastery", "One world mastered", "Master every ayah in one surah world.", "◈", "masteredSurahs", 1, 75, "Mastery halo", "permanent"],
  ["master-five", "Mastery", "Five worlds mastered", "Master five surah worlds.", "✺", "masteredSurahs", 5, 180, "Galaxy mantle", "permanent"],
  ["review-ten", "Review", "Memory gardener", "Strengthen ten ayahs through focused learning.", "🔮", "reviewed", 10, 65, "Sapphire seed", "permanent"],
  ["review-fifty", "Review", "Memory keeper", "Strengthen fifty ayahs through focused learning.", "🛡", "reviewed", 50, 160, "Guardian shield", "permanent"],
  ["challenge-seven", "Challenge", "Seven trials", "Complete seven daily cosmic trials.", "🔥", "challenges", 7, 140, "Flame crown", "permanent"],
  ["challenge-accuracy", "Challenge", "Sharp stargazer", "Score 90% accuracy in a daily challenge.", "🎯", "bestChallengeAccuracy", 90, 90, "Precision lens", "permanent"],
  ["first-login", "Special", "First light", "Begin your Quran Tarteel journey.", "✨", "loggedIn", 1, 15, "First light aura", "permanent"],
  ["first-surah", "Special", "First world", "Complete your first surah.", "🚀", "surahs", 1, 35, "Explorer visor", "permanent"],
  ["explorer", "Special", "Galaxy explorer", "Travel beyond your first surah world.", "🌌", "explored", 1, 35, "Nebula skin", "permanent"],
  ["first-listen", "Special", "Listening star", "Listen to your first ayah recitation.", "🎧", "listened", 1, 25, "Soundwave trail", "permanent"],
];

function today() { return new Intl.DateTimeFormat("en-CA").format(new Date()); }
function week() { const date = new Date(); const first = new Date(date.getFullYear(), 0, 1); return `${date.getFullYear()}-${Math.ceil((((date - first) / 86400000) + first.getDay() + 1) / 7)}`; }
function readJson(key, fallback) { try { return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function getChallengeStats() { const records = Object.keys(window.localStorage).filter((key) => key.startsWith("sheikhduo-cosmic-challenge-")).map((key) => readJson(key, null)).filter((record) => record?.completed); return { count: records.length, bestAccuracy: records.reduce((best, record) => Math.max(best, record.accuracy || 0), 0) }; }

export default function CosmicQuestsPage() {
  const user = useCosmicUser();
  const [active, setActive] = useState("Daily");
  const [claims, setClaims] = useState([]);
  const [selected, setSelected] = useState(null);
  const [challengeStats, setChallengeStats] = useState({ count: 0, bestAccuracy: 0 });
  const [dateScope, setDateScope] = useState("");
  const metrics = useMemo(() => {
    const mastered = new Set(user.ayahsMastered || []);
    const masteredSurahs = COSMIC_UNITS.filter((unit) => unit.ayahs.every((ayah) => mastered.has(ayah.id))).length;
    return { dailyAyahs: Math.floor((user.dailyXp || 0) / 10), dailyXp: user.dailyXp || 0, surahs: (user.surahsCompleted || []).length, xp: user.xp || 0, baqarah: (user.surahsCompleted || []).includes(2) ? 1 : 0, mulk: (user.surahsCompleted || []).includes(67) ? 1 : 0, masteredSurahs, reviewed: mastered.size, challenges: challengeStats.count, bestChallengeAccuracy: challengeStats.bestAccuracy, loggedIn: user.lastActive ? 1 : 0, explored: Number(user.lastSurahId) > 1 ? 1 : 0, listened: (user.ayahsListened || []).length };
  }, [challengeStats, user]);
  function scopeFor(scope) { return scope === "daily" ? `daily-${dateScope}` : scope === "weekly" ? `weekly-${week()}` : "permanent"; }
  const quests = useMemo(() => QUESTS.map(([id, category, name, description, icon, metric, target, xp, cosmetic, scope]) => { const value = metrics[metric] || 0; const claimKey = `${scopeFor(scope)}:${id}`; return { id, category, name, description, icon, metric, target, xp, cosmetic, scope, value, complete: value >= target, claimed: claims.includes(claimKey), claimKey, streak: user.streak || 0 }; }), [claims, dateScope, metrics, user.streak]);
  const visible = quests.filter((quest) => quest.category === active);

  useEffect(() => {
    const refresh = () => { setClaims(readJson(CLAIMS_KEY, [])); setChallengeStats(getChallengeStats()); setDateScope(today()); };
    refresh();
    const timer = window.setInterval(refresh, 60000);
    return () => window.clearInterval(timer);
  }, []);
  function claim(quest) {
    if (!quest.complete || quest.claimed) return;
    const nextClaims = [...claims, quest.claimKey];
    const cosmetics = readJson(COSMETICS_KEY, []);
    window.localStorage.setItem(CLAIMS_KEY, JSON.stringify(nextClaims));
    window.localStorage.setItem(COSMETICS_KEY, JSON.stringify([...new Set([...cosmetics, quest.cosmetic])]));
    setClaims(nextClaims);
    addXP(quest.xp, `Quest: ${quest.name}`);
    setSelected({ ...quest, claimed: true });
  }
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}><StarParticles count={52} color="#cbb7ff" /><section style={{ position: "relative", width: "min(980px,100%)", margin: "0 auto", display: "grid", gap: 18 }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 18 }}><div><p style={{ margin: 0, color: "#ffdc8b", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC MISSIONS</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Choose your next quest.</h1><p style={{ maxWidth: 590, margin: 0, color: "#c5d4e9", lineHeight: 1.6 }}>Follow a mission, earn a cosmic reward, and let steady practice light the way.</p></div><div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><span style={{ padding: "10px 12px", borderRadius: 12, color: "#ffdf8f", background: "rgba(224,166,59,.14)", fontWeight: 900 }}>🔥 {user.streak || 0}</span><Link href="/cosmic/path" className="cosmic-button">Learning path</Link></div></header><QuestCategoryTabs categories={CATEGORIES} active={active} onChange={setActive} /><QuestList quests={visible} onOpen={setSelected} /></section><QuestModal quest={selected} onClose={() => setSelected(null)} onClaim={claim} /></main>;
}
