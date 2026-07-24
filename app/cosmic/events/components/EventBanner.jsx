"use client";

import EventTimer from "./EventTimer";

export default function EventBanner({ event, onOpen, onExpire }) {
  if (!event) return null;
  return <section style={{ overflow: "hidden", position: "relative", padding: "clamp(24px,5vw,48px)", borderRadius: 28, color: "#f6fbff", background: event.palette, border: "1px solid rgba(215,232,255,.26)", boxShadow: "0 20px 70px rgba(0,0,0,.22)" }}><div aria-hidden="true" style={{ position: "absolute", right: "-2%", bottom: "-20%", fontSize: "clamp(9rem,25vw,18rem)", opacity: .2 }}>{event.icon}</div><div style={{ position: "relative", maxWidth: 650 }}><p style={{ margin: 0, color: "#fff0b0", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>ACTIVE COSMIC EVENT</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.5rem,7vw,5.5rem)", lineHeight: .9, letterSpacing: "-.07em" }}>{event.name}</h1><p style={{ maxWidth: 530, margin: "0 0 20px", color: "#d5e5ff", lineHeight: 1.6 }}>{event.description}</p><div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}><EventTimer endAt={event.endAt} onExpire={onExpire} /><button type="button" onClick={onOpen} className="cosmic-button">Explore event</button></div></div></section>;
}
