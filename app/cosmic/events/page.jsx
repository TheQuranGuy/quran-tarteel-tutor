"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addXP } from "../../../lib/user";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import EventBanner from "./components/EventBanner";
import EventCard from "./components/EventCard";
import EventModal from "./components/EventModal";

const CLAIMS_KEY = "sheikhduo-cosmic-event-claims";
const COSMETICS_KEY = "sheikhduo-cosmic-event-cosmetics";
const day = 86400000;
function readJson(key, fallback) { try { return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function challengeStats() { const records = Object.keys(window.localStorage).filter((key) => key.startsWith("sheikhduo-cosmic-challenge-")).map((key) => readJson(key, null)).filter((record) => record?.completed); return { count: records.length, accuracy: records.reduce((best, record) => Math.max(best, record.accuracy || 0), 0) }; }
function statusFor(event, now) { return now < event.startAt ? "upcoming" : now > event.endAt ? "expired" : "active"; }
function eventBlueprints(now) { return [
  { id: "revelation-season", name: "Cosmic Revelation Season", type: "Cosmic special", icon: "✦", startAt: now - 2 * day, endAt: now + 5 * day, description: "A seven-day orbit of quiet practice, luminous ayahs, and steady progress.", palette: "radial-gradient(circle at 20% 5%,rgba(255,216,111,.35),transparent 30%),radial-gradient(circle at 85% 80%,rgba(118,111,255,.35),transparent 35%),linear-gradient(135deg,#121443,#233f79)", reward: { xp: 120, cosmetic: "Revelation halo" }, quests: [["three-ayahs", "Brighten three ayahs", "Complete three ayah-sized learning steps today.", "dailyAyahs", 3, 25, "Starlit pin"], ["daily-challenge", "Trial spark", "Complete a daily cosmic trial.", "challenges", 1, 35, "Comet ribbon"], ["mastery", "One clear world", "Master every ayah in one available surah world.", "masteredSurahs", 1, 60, "Crystal orbit"]] },
  { id: "ramadan-journey", name: "Ramadan Cosmic Journey", type: "Seasonal", icon: "☾", startAt: now + 8 * day, endAt: now + 22 * day, description: "A coming season of reflective reading, review, and nightly constellations.", palette: "radial-gradient(circle at 80% 10%,rgba(255,245,193,.35),transparent 24%),radial-gradient(circle at 18% 78%,rgba(61,166,154,.28),transparent 35%),linear-gradient(135deg,#071e30,#17464e)", reward: { xp: 180, cosmetic: "Moonlit guide robe" }, quests: [["moon-ayahs", "Moonlit learning", "Master ten ayahs.", "ayahs", 10, 45, "Crescent trail"], ["moon-review", "Gentle review", "Strengthen ten ayahs through practice.", "reviewed", 10, 50, "Lantern aura"]] },
  { id: "dhul-hijjah-marathon", name: "Dhul Hijjah Mastery Marathon", type: "Seasonal", icon: "🕋", startAt: now - 20 * day, endAt: now - 4 * day, description: "A completed pilgrimage of mastery, remembrance, and focused review.", palette: "radial-gradient(circle at 20% 10%,rgba(253,209,127,.28),transparent 28%),linear-gradient(135deg,#2e210f,#573b1a)", reward: { xp: 150, cosmetic: "Golden pilgrim trail" }, quests: [["marathon-mastery", "Mastery ascent", "Master one surah world.", "masteredSurahs", 1, 60, "Summit badge"], ["marathon-xp", "Golden effort", "Earn five hundred XP.", "xp", 500, 65, "Gold star"]] },
]; }

export default function CosmicEventsPage() {
  const user = useCosmicUser();
  const [now, setNow] = useState(0);
  const [claims, setClaims] = useState([]);
  const [challenge, setChallenge] = useState({ count: 0, accuracy: 0 });
  const [selected, setSelected] = useState(null);
  const metrics = useMemo(() => { const mastered = new Set(user.ayahsMastered || []); const allAyahs = COSMIC_UNITS.flatMap((unit) => unit.ayahs); const masteredSurahs = COSMIC_UNITS.filter((unit) => unit.ayahs.every((ayah) => mastered.has(ayah.id))).length; return { dailyAyahs: Math.floor((user.dailyXp || 0) / 10), ayahs: mastered.size, reviewed: mastered.size, challenges: challenge.count, masteredSurahs, xp: user.xp || 0, totalMastery: allAyahs.length ? Math.max(0, Math.round(((mastered.size / allAyahs.length) * 100) - (((user.weakAyahs || []).length / allAyahs.length) * 100))) : 0 }; }, [challenge, user]);
  const events = useMemo(() => now ? eventBlueprints(now).map((event) => ({ ...event, status: statusFor(event, now), quests: event.quests.map(([id, name, description, metric, target, xp, cosmetic]) => { const value = metrics[metric] || 0; const claimKey = `${event.id}:${id}`; return { id, name, description, metric, target, xp, cosmetic, value, complete: value >= target, claimed: claims.includes(claimKey), claimKey }; }) })) : [], [claims, metrics, now]);
  const activeEvent = events.find((event) => event.status === "active");
  useEffect(() => { const refresh = () => { setNow(Date.now()); setClaims(readJson(CLAIMS_KEY, [])); setChallenge(challengeStats()); }; refresh(); const timer = window.setInterval(refresh, 60000); return () => window.clearInterval(timer); }, []);
  function claim(quest) { if (!quest.complete || quest.claimed) return; const next = [...claims, quest.claimKey]; const cosmetics = readJson(COSMETICS_KEY, []); window.localStorage.setItem(CLAIMS_KEY, JSON.stringify(next)); window.localStorage.setItem(COSMETICS_KEY, JSON.stringify([...new Set([...cosmetics, quest.cosmetic])])); setClaims(next); addXP(quest.xp, "Cosmic event reward"); setSelected((event) => event ? { ...event, quests: event.quests.map((item) => item.id === quest.id ? { ...item, claimed: true } : item) } : event); }
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}><StarParticles count={58} color="#d3c2ff" /><section style={{ position: "relative", width: "min(1040px,100%)", margin: "0 auto", display: "grid", gap: 19 }}><header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}><div><p style={{ margin: 0, color: "#ffdc8a", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>SEASONS & EVENTS</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.07em" }}>The cosmos is moving.</h1><p style={{ margin: 0, color: "#c4d4e9", maxWidth: 600, lineHeight: 1.6 }}>Join a limited-time learning orbit, complete its quests, and collect a seasonal light.</p></div><Link href="/cosmic/path" className="cosmic-button">Learning path</Link></header>{activeEvent ? <EventBanner event={activeEvent} onOpen={() => setSelected(activeEvent)} onExpire={() => setNow(Date.now())} /> : null}<section><h2 style={{ margin: "4px 0 12px" }}>Event calendar</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 13 }}>{events.map((event) => <EventCard key={event.id} event={event} onOpen={setSelected} />)}</div></section></section><EventModal event={selected} onClose={() => setSelected(null)} onClaim={claim} /></main>;
}
