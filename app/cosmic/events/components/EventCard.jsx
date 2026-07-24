"use client";

import { motion } from "framer-motion";
import EventReward from "./EventReward";

const statusColor = { active: "#aaf4cd", upcoming: "#afddff", expired: "#b1b7cb" };
export default function EventCard({ event, onOpen }) {
  return <motion.article className="cosmic-v2-card" whileHover={{ y: -4, scale: 1.01 }} style={{ display: "grid", gap: 13, padding: 18, borderRadius: 21, border: "1px solid rgba(172,211,252,.19)", background: "rgba(255,255,255,.045)" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span aria-hidden="true" style={{ fontSize: 38 }}>{event.icon}</span><small style={{ color: statusColor[event.status], fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em" }}>{event.status}</small></div><div><p style={{ margin: 0, color: "#ffdb8a", fontSize: 11, fontWeight: 900 }}>{event.type.toUpperCase()}</p><h2 style={{ margin: "4px 0", color: "#f1f8ff", fontSize: 21 }}>{event.name}</h2><p style={{ margin: 0, color: "#b9cae4", fontSize: 13, lineHeight: 1.45 }}>{event.description}</p></div><EventReward xp={event.reward.xp} cosmetic={event.reward.cosmetic} /><button type="button" onClick={() => onOpen(event)} className="cosmic-button cosmic-button--outline">View event</button></motion.article>;
}
