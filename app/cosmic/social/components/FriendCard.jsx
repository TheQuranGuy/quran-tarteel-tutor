"use client";

import { motion } from "framer-motion";

export default function FriendCard({ friend, onView, onRemove }) {
  return <motion.article className="cosmic-v2-card" whileHover={{ y: -3 }} style={{ display: "grid", gridTemplateColumns: "46px minmax(0,1fr)", gap: 11, padding: 13, borderRadius: 16, border: "1px solid rgba(176,210,249,.16)", background: "rgba(255,255,255,.045)" }}><span aria-hidden="true" style={{ width: 46, height: 46, display: "grid", placeItems: "center", borderRadius: "50%", background: friend.color, fontSize: 22 }}>{friend.avatar}</span><div style={{ minWidth: 0 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><strong>{friend.name}</strong><small style={{ color: "#ffd98b", fontWeight: 900 }}>{friend.xp} XP</small></div><p style={{ margin: "4px 0 9px", color: "#b9cae3", fontSize: 12 }}>🔥 {friend.streak} · {friend.mastery}% mastery</p><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}><button type="button" onClick={() => onView(friend)} className="cosmic-button cosmic-button--outline" style={{ padding: "6px 9px", fontSize: 12 }}>View profile</button><button type="button" onClick={() => onRemove(friend.id)} style={{ border: 0, padding: "6px 3px", cursor: "pointer", color: "#ffb7c0", background: "transparent", fontWeight: 850, fontSize: 12 }}>Remove</button></div></div></motion.article>;
}
