"use client";

export default function SettingsSection({ icon, title, description, children }) {
  return <section className="cosmic-bright-card" style={{ padding: "clamp(17px,3vw,24px)", borderRadius: 21, display: "grid", gap: 15 }}><header style={{ display: "flex", gap: 11, alignItems: "center" }}><span aria-hidden="true" style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 13, background: "rgba(133,218,255,.13)", fontSize: 20 }}>{icon}</span><div><h2 style={{ margin: 0, fontSize: 21 }}>{title}</h2>{description ? <p style={{ margin: "3px 0 0", color: "#aebfda", fontSize: 13 }}>{description}</p> : null}</div></header>{children}</section>;
}
