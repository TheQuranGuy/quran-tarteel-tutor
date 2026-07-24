"use client";

import { useState } from "react";

export default function PostComposer({ onPost, name }) {
  const [text, setText] = useState("");
  function submit(event) { event.preventDefault(); const value = text.trim(); if (!value) return; onPost(value); setText(""); }
  return <form onSubmit={submit} className="cosmic-bright-card" style={{ padding: 16, borderRadius: 19, display: "grid", gap: 11 }}><label htmlFor="cosmic-post" style={{ color: "#d8e5f6", fontWeight: 850 }}>Share a little light, {name || "traveler"}</label><textarea id="cosmic-post" value={text} onChange={(event) => setText(event.target.value)} maxLength={280} placeholder="I learned something beautiful today…" style={{ width: "100%", minHeight: 84, resize: "vertical", boxSizing: "border-box", padding: 12, borderRadius: 14, border: "1px solid rgba(168,208,249,.2)", color: "#eef7ff", background: "rgba(255,255,255,.045)", font: "inherit" }} /><div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><small style={{ color: "#9fb3d2" }}>{text.length}/280</small><button type="submit" className="cosmic-button">Post update</button></div></form>;
}
