"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import EventProgress from "./EventProgress";
import EventQuestList from "./EventQuestList";
import EventReward from "./EventReward";

export default function EventModal({ event, onClose, onClaim }) {
  useEffect(() => { const close = (eventKey) => { if (eventKey.key === "Escape") onClose(); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [onClose]);
  if (!event) return null;
  const completeCount = event.quests.filter((quest) => quest.complete).length;
  return <div role="presentation" onMouseDown={onClose} style={{ position: "fixed", zIndex: 90, inset: 0, overflowY: "auto", display: "grid", placeItems: "center", padding: 18, background: "rgba(2,5,22,.76)", backdropFilter: "blur(8px)" }}><motion.section role="dialog" aria-modal="true" aria-label={event.name} onMouseDown={(eventClick) => eventClick.stopPropagation()} initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ width: "min(620px,100%)", padding: "clamp(22px,5vw,34px)", borderRadius: 27, color: "#f1f8ff", background: event.palette, border: "1px solid rgba(215,233,255,.29)" }}><div style={{ textAlign: "center", fontSize: 54 }}>{event.icon}</div><p style={{ margin: "4px 0", color: "#fff0ad", textAlign: "center", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>{event.type.toUpperCase()} EVENT · {event.status.toUpperCase()}</p><h1 style={{ margin: "7px 0", textAlign: "center", fontSize: 31 }}>{event.name}</h1><p style={{ margin: "0 0 18px", color: "#d3e3fa", textAlign: "center", lineHeight: 1.55 }}>{event.description}</p><EventProgress value={completeCount} target={event.quests.length} complete={completeCount === event.quests.length} /><div style={{ margin: "15px 0" }}><EventReward xp={event.reward.xp} cosmetic={event.reward.cosmetic} /></div><h2 style={{ margin: "20px 0 10px" }}>Event quests</h2><EventQuestList quests={event.quests} active={event.status === "active"} onClaim={onClaim} /><p style={{ margin: "18px 0", color: "#b6c7df", fontSize: 13, lineHeight: 1.5 }}>Your current streak is shown elsewhere and follows the existing Quran Tarteel session rules.</p><button type="button" onClick={onClose} className="cosmic-button cosmic-button--outline">Close event</button></motion.section></div>;
}
