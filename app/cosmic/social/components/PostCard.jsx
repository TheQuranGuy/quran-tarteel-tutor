"use client";

import ReactionBar from "./ReactionBar";

function timeLabel(value) { const delta = Math.max(0, Date.now() - Number(value)); if (delta < 3600000) return "just now"; if (delta < 86400000) return `${Math.floor(delta / 3600000)}h ago`; return `${Math.floor(delta / 86400000)}d ago`; }
export default function PostCard({ post, reaction, onReact }) {
  return <article className="cosmic-bright-card" style={{ padding: 16, borderRadius: 19, display: "grid", gap: 12 }}><header style={{ display: "flex", gap: 10, alignItems: "center" }}><span aria-hidden="true" style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: "50%", background: post.avatarColor || "#5b68bd", fontSize: 21 }}>{post.avatar || "✦"}</span><div><strong>{post.author}</strong><p style={{ margin: "2px 0 0", color: "#9fb3d2", fontSize: 12 }}>{post.label || "Cosmic update"} · {timeLabel(post.createdAt)}</p></div></header><p style={{ margin: 0, color: "#d2dff0", lineHeight: 1.58, whiteSpace: "pre-wrap" }}>{post.content}</p><ReactionBar values={reaction?.values} selected={reaction?.selected} onReact={onReact} /></article>;
}
