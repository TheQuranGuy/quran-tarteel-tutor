"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import { updateUser } from "../../../lib/user";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileMascot from "./components/ProfileMascot";
import ProfileThemes from "./components/ProfileThemes";
import ProfileAchievements from "./components/ProfileAchievements";
import ProfileMastery from "./components/ProfileMastery";
import ProfileStreakHistory from "./components/ProfileStreakHistory";
import ProfileXPHistory from "./components/ProfileXPHistory";

export default function CosmicProfilePage() {
  const user = useCosmicUser();
  const [achievementCount, setAchievementCount] = useState(0);
  const allAyahs = useMemo(() => COSMIC_UNITS.flatMap((unit) => unit.ayahs), []);
  const mastered = useMemo(() => new Set(user.ayahsMastered || []), [user.ayahsMastered]);
  const masteredCount = allAyahs.filter((ayah) => mastered.has(ayah.id)).length;
  const weakCount = allAyahs.filter((ayah) => (user.weakAyahs || []).includes(ayah.id)).length;
  const mastery = allAyahs.length ? Math.max(0, Math.round(((masteredCount / allAyahs.length) * 100) - ((weakCount / allAyahs.length) * 100))) : 0;
  useEffect(() => { try { setAchievementCount(JSON.parse(window.localStorage.getItem("sheikhduo-cosmic-achievement-unlocks") || "[]").length); } catch { setAchievementCount(0); } }, []);
  function chooseTheme(preferredTheme) { updateUser({ preferredTheme }); }
  function chooseGuide(cosmicGuide) { updateUser({ cosmicGuide }); }
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}><StarParticles count={52} color="#cfbfff" /><section style={{ position: "relative", width: "min(980px,100%)", margin: "0 auto", display: "grid", gap: 15 }}><div style={{ display: "flex", justifyContent: "flex-end", gap: 9, flexWrap: "wrap" }}><Link href="/cosmic/store" className="cosmic-button cosmic-button--outline">Redeem XP</Link><Link href="/cosmic/settings" className="cosmic-button cosmic-button--outline">Settings</Link><Link href="/cosmic/path" className="cosmic-button">Learning path</Link></div><ProfileHeader user={user} /><ProfileStats user={user} mastery={mastery} /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}><ProfileMascot guide={user.cosmicGuide || "male"} streak={user.streak || 0} onChange={chooseGuide} /><ProfileThemes value={user.preferredTheme || "space"} onChange={chooseTheme} /><ProfileAchievements count={achievementCount} /><ProfileMastery mastery={mastery} mastered={masteredCount} total={allAyahs.length} /><ProfileStreakHistory streak={user.streak || 0} lastActive={user.lastActive} /><ProfileXPHistory user={user} /></div></section></main>;
}
