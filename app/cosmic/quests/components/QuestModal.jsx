"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import QuestProgress from "./QuestProgress";
import QuestReward from "./QuestReward";

export default function QuestModal({ quest, onClose, onClaim }) {
  useEffect(() => { const close = (event) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [onClose]);
  if (!quest) return null;
  return <div role="presentation" onMouseDown={onClose} style={{ position: "fixed", zIndex: 90, inset: 0, display: "grid", placeItems: "center", padding: 18, background: "rgba(2,5,21,.74)", backdropFilter: "blur(8px)" }}><motion.section role="dialog" aria-modal="true" aria-label={quest.name} onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ width: "min(470px,100%)", padding: 28, borderRadius: 25, color: "#f1f8ff", background: "radial-gradient(circle at 50% 0%,rgba(121,91,255,.3),transparent 52%),#101a3e", border: "1px solid rgba(165,216,255,.26)" }}><div aria-hidden="true" style={{ fontSize: 48, textAlign: "center" }}>{quest.icon}</div><p style={{ margin: "6px 0", textAlign: "center", color: "#ffdc8b", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>{quest.category.toUpperCase()} QUEST</p><h1 style={{ margin: "6px 0", textAlign: "center", fontSize: 29 }}>{quest.name}</h1><p style={{ margin: "0 0 20px", textAlign: "center", color: "#c4d4ea", lineHeight: 1.55 }}>{quest.description}</p><QuestProgress value={quest.value} target={quest.target} complete={quest.complete} /><div style={{ marginTop: 16 }}><QuestReward xp={quest.xp} cosmetic={quest.cosmetic} claimed={quest.claimed} /></div><p style={{ margin: "16px 0", color: "#aebfdb", fontSize: 13, lineHeight: 1.5 }}>Your current streak remains {quest.streak} days. Quests celebrate your progress without changing streak rules.</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{quest.complete && !quest.claimed ? <button type="button" onClick={() => onClaim(quest)} className="cosmic-button">Claim +{quest.xp} XP</button> : null}<button type="button" onClick={onClose} className="cosmic-button cosmic-button--outline">Close</button></div></motion.section></div>;
}
