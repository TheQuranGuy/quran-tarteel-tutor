"use client";

import RewardChest from "../../../components/cosmic/RewardChest";
import { COSMIC_SKINS, COSMIC_THEMES } from "../../../lib/cosmic";
import { getUser, updateUser } from "../../../lib/user";

export default function CosmicRewardsPage() {
  const user = getUser();
  return <main style={{ minHeight: "100vh", padding: "64px 16px", color: "#eefaff", background: "radial-gradient(circle at 52% 15%,#6a4814,transparent 33%),#090817" }}><section style={{ width: "min(850px,100%)", margin: "0 auto" }}><h1>Rewards and galaxy skins</h1><p style={{ color: "#c7d3e5" }}>Your rewards are gentle milestones for steady learning.</p><div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0" }}><RewardChest id="cosmic-welcome" reward={10} label="Welcome to Quran Tarteel" /><RewardChest id="cosmic-constellation" reward={25} label="Constellation reward" /></div><h2>Theme</h2><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{COSMIC_THEMES.map((theme) => <button key={theme} type="button" onClick={() => updateUser({ preferredTheme: theme })} style={{ border: "1px solid #e8d490", borderRadius: 12, padding: "10px 14px", color: "#fff4cf", background: user.preferredTheme === theme ? "#8b611c" : "transparent", cursor: "pointer", fontWeight: 800 }}>{theme}</button>)}</div><h2 style={{ marginTop: 30 }}>Galaxy skin collection</h2><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{COSMIC_SKINS.map((skin) => <span key={skin} style={{ padding: "10px 13px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 12, background: "rgba(255,255,255,.06)" }}>{skin}</span>)}</div></section></main>;
}
