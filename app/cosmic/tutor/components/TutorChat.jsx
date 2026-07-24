"use client";

import { useEffect, useRef } from "react";
import TutorMessage from "./TutorMessage";

export default function TutorChat({ messages, typing, renderCard }) {
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, typing]);

  return <section className="cosmic-bright-card cosmic-tutor-chat" style={{ minHeight: 380, maxHeight: 590, overflowY: "auto", padding: 16, borderRadius: 22, display: "grid", alignContent: "start", gap: 13 }}><p style={{ margin: 0, color: "#ffdc8b", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>COSMIC SHEIKH TUTOR</p>{messages.map((message) => <TutorMessage key={message.id} message={message}>{message.card ? renderCard(message.card) : null}</TutorMessage>)}{typing ? <TutorMessage message={{ role: "tutor", text: "Looking through the lesson constellation…" }} /> : null}<div ref={endRef} /></section>;
}
