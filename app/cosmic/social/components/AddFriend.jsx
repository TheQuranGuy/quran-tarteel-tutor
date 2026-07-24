"use client";

import { useState } from "react";

export default function AddFriend({ onAdd, existing }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  function submit(event) { event.preventDefault(); const value = name.trim(); if (!value) return; const success = onAdd(value); setMessage(success ? `${value} joined your orbit.` : "That traveler is already in your orbit."); if (success) setName(""); }
  return <form onSubmit={submit} className="cosmic-bright-card" style={{ padding: 16, borderRadius: 20, display: "grid", gap: 10 }}><h2 style={{ margin: 0 }}>Add a friend</h2><p style={{ margin: 0, color: "#b9cae3", fontSize: 13 }}>Search a cosmic nickname to invite a traveler.</p><div style={{ display: "flex", gap: 8 }}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Amina" aria-label="Friend nickname" style={{ flex: 1, minWidth: 0, padding: "10px 11px", borderRadius: 12, border: "1px solid rgba(174,208,249,.2)", color: "#eff8ff", background: "rgba(255,255,255,.05)", font: "inherit" }} /><button type="submit" className="cosmic-button" style={{ padding: "9px 11px" }}>Add</button></div>{message ? <small style={{ color: message.includes("already") ? "#ffb7c0" : "#aaf3cb" }}>{message}</small> : <small style={{ color: "#9eb2d1" }}>{existing.length} travelers in your orbit</small>}</form>;
}
