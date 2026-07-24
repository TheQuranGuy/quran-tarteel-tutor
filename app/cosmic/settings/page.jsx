"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "../../../lib/user";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import SettingsSection from "./components/SettingsSection";
import SettingsThemeSelector from "./components/SettingsThemeSelector";
import SettingsAudio from "./components/SettingsAudio";
import SettingsNotifications from "./components/SettingsNotifications";
import SettingsAccessibility from "./components/SettingsAccessibility";
import SettingsAccount from "./components/SettingsAccount";
import SettingsDropdown from "./components/SettingsDropdown";
import SettingsToggle from "./components/SettingsToggle";

const SETTINGS_KEY = "sheikhduo-cosmic-settings";
const DEFAULTS = { theme: "dark", recitationVolume: 90, uiVolume: 35, muteAudio: false, dailyReminder: true, streakAlerts: true, eventAlerts: true, challengeAlerts: true, textSize: 100, dyslexiaFont: false, highContrast: false, language: "en", publicProfile: true, publicAchievements: true, publicLeaderboard: true, email: "" };
const backgrounds = { dark: "radial-gradient(circle at 80% 5%,rgba(121,91,255,.25),transparent 30%),#080f28", bright: "radial-gradient(circle at 80% 5%,rgba(255,224,136,.28),transparent 30%),#143d59", nebula: "radial-gradient(circle at 15% 10%,rgba(234,102,184,.28),transparent 30%),radial-gradient(circle at 80% 70%,rgba(110,105,255,.28),transparent 35%),#130d36" };
function readSettings() { try { return { ...DEFAULTS, ...JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || "{}") }; } catch { return DEFAULTS; } }

export default function CosmicSettingsPage() {
  const user = useCosmicUser();
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);
  useEffect(() => { setSettings(readSettings()); setReady(true); }, []);
  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    const root = document.documentElement;
    root.dataset.cosmicTheme = settings.theme;
    root.style.fontSize = `${settings.textSize}%`;
    root.style.fontFamily = settings.dyslexiaFont ? "Arial, Verdana, sans-serif" : "";
    root.classList.toggle("cosmic-high-contrast", settings.highContrast);
    document.body.style.background = backgrounds[settings.theme];
    document.body.style.filter = settings.highContrast ? "contrast(1.16) saturate(1.08)" : "";
    document.querySelectorAll("audio").forEach((audio) => { audio.muted = settings.muteAudio; audio.volume = settings.muteAudio ? 0 : settings.recitationVolume / 100; });
    window.dispatchEvent(new CustomEvent("sheikhduo-settings-changed", { detail: settings }));
  }, [ready, settings]);
  function change(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
    if (key === "theme") updateUser({ preferredTheme: value });
    if (key === "language") updateUser({ preferredTranslation: value });
    if (key === "dailyReminder" && value && "Notification" in window && Notification.permission === "default") Notification.requestPermission().catch(() => {});
  }
  function saveAccount({ username, email }) { updateUser({ username }); change("email", email); }
  function reset() { setSettings(DEFAULTS); updateUser({ preferredTheme: "space" }); }
  function logout() { window.sessionStorage.removeItem("sheikhduo-cosmic-session"); router.push("/cosmic/intro"); }
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px", background: backgrounds[settings.theme] }}><StarParticles count={48} color={settings.theme === "bright" ? "#fff2ab" : "#d2bfff"} /><section style={{ position: "relative", width: "min(860px,100%)", margin: "0 auto", display: "grid", gap: 15 }}><header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap" }}><div><p style={{ margin: 0, color: "#ffdc8a", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC CONTROL PANEL</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.4rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Make it yours.</h1><p style={{ maxWidth: 570, margin: 0, color: "#c4d4e9", lineHeight: 1.6 }}>Tune your reading space, audio, reminders, privacy, and comfort settings.</p></div><div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><Link href="/cosmic/profile" className="cosmic-button cosmic-button--outline">Profile</Link><Link href="/cosmic/path" className="cosmic-button">Learning path</Link></div></header><SettingsSection icon="🎨" title="Theme" description="Your cosmic atmosphere"><SettingsThemeSelector value={settings.theme} onChange={(value) => change("theme", value)} /></SettingsSection><SettingsSection icon="🔊" title="Audio" description="Recitation and interface sound"><SettingsAudio settings={settings} onChange={change} /></SettingsSection><SettingsSection icon="🔔" title="Notifications" description="Gentle learning reminders"><SettingsNotifications settings={settings} onChange={change} /></SettingsSection><SettingsSection icon="♿" title="Accessibility" description="Make each ayah comfortable to read"><SettingsAccessibility settings={settings} onChange={change} /></SettingsSection><SettingsSection icon="🌐" title="Language" description="Choose the interface language"><SettingsDropdown label="Interface language" value={settings.language} options={[{ value: "en", label: "English" }, { value: "ar", label: "Arabic" }, { value: "ur", label: "Urdu" }, { value: "id", label: "Indonesian" }, { value: "ms", label: "Malay" }]} onChange={(value) => change("language", value)} /></SettingsSection><SettingsSection icon="🔒" title="Privacy" description="Control what your cosmic community can see"><div style={{ display: "grid", gap: 14 }}><SettingsToggle label="Show profile publicly" checked={settings.publicProfile} onChange={(value) => change("publicProfile", value)} /><SettingsToggle label="Show achievements publicly" checked={settings.publicAchievements} onChange={(value) => change("publicAchievements", value)} /><SettingsToggle label="Show leaderboard statistics" checked={settings.publicLeaderboard} onChange={(value) => change("publicLeaderboard", value)} /></div></SettingsSection><SettingsSection icon="👤" title="Account" description="Your local Quran Tarteel identity"><SettingsAccount username={user.username} email={settings.email} onSave={saveAccount} onLogout={logout} /></SettingsSection><button type="button" onClick={reset} className="cosmic-button cosmic-button--outline" style={{ justifySelf: "start" }}>Reset settings to default</button></section></main>;
}
