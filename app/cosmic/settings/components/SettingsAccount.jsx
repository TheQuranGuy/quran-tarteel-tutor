"use client";

import { useEffect, useState } from "react";

export default function SettingsAccount({ username, email, onSave, onLogout }) {
  const [name, setName] = useState(username || "");
  const [mail, setMail] = useState(email || "");
  const [message, setMessage] = useState("");
  useEffect(() => { setName(username || ""); setMail(email || ""); }, [username, email]);
  function save(event) { event.preventDefault(); onSave({ username: name.trim(), email: mail.trim() }); setMessage("Account preferences saved on this device."); }
  return <form onSubmit={save} style={{ display: "grid", gap: 12 }}><label style={{ display: "grid", gap: 6 }}><strong>Username</strong><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Qur'an traveler" style={{ padding: "10px 11px", borderRadius: 12, border: "1px solid rgba(181,213,251,.22)", color: "#edf7ff", background: "rgba(255,255,255,.05)", font: "inherit" }} /></label><label style={{ display: "grid", gap: 6 }}><strong>Email</strong><input type="email" value={mail} onChange={(event) => setMail(event.target.value)} placeholder="you@example.com" style={{ padding: "10px 11px", borderRadius: 12, border: "1px solid rgba(181,213,251,.22)", color: "#edf7ff", background: "rgba(255,255,255,.05)", font: "inherit" }} /></label><p style={{ margin: 0, color: "#aebfda", fontSize: 13, lineHeight: 1.5 }}>Password and sign-in are not available because this project has no authentication provider configured.</p>{message ? <small style={{ color: "#aaf3cb" }}>{message}</small> : null}<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button type="submit" className="cosmic-button">Save account</button><button type="button" onClick={onLogout} className="cosmic-button cosmic-button--outline">End local session</button></div></form>;
}
