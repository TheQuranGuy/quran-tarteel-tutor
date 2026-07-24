"use client";

import Link from "next/link";
import MascotMale from "../../../../components/cosmic/MascotMale";
import MascotFemale from "../../../../components/cosmic/MascotFemale";
import StreakFlame from "../../../../components/cosmic/StreakFlame";

export default function GalaxyHUD({ user, onToggleMenu }) { const Mascot = user.cosmicGuide === "female" ? MascotFemale : MascotMale; return <header style={{ pointerEvents: "auto", position: "absolute", zIndex: 5, top: 18, left: 18, right: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: "1px solid rgba(176,212,255,.2)", borderRadius: 18, color: "#eaf5ff", background: "rgba(5,10,32,.72)", backdropFilter: "blur(14px)" }}><Mascot compact /><div><strong style={{ display: "block" }}>{user.xp || 0} XP</strong><StreakFlame streak={user.streak || 0} /></div></div><div style={{ display: "flex", gap: 8 }}><Link href="/cosmic/path" style={{ padding: "10px 12px", borderRadius: 12, color: "#dff7ff", background: "rgba(8,17,49,.75)", textDecoration: "none", fontWeight: 850 }}>Path</Link><button type="button" onClick={onToggleMenu} style={{ border: "1px solid rgba(176,212,255,.26)", borderRadius: 12, padding: "10px 12px", cursor: "pointer", color: "#dff7ff", background: "rgba(8,17,49,.75)", fontWeight: 850 }}>Navigate</button></div></header>; }
