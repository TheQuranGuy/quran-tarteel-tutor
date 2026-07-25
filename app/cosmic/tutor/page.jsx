"use client";

import Link from "next/link";
import { useState } from "react";
import { getSheikhReply } from "../../../lib/ai";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import TutorChat from "./components/TutorChat";
import TutorInput from "./components/TutorInput";
import TutorSuggestions from "./components/TutorSuggestions";
import TutorAyahBreakdown from "./components/TutorAyahBreakdown";
import TutorRecitationFeedback from "./components/TutorRecitationFeedback";
import TutorProgressReport from "./components/TutorProgressReport";
import TutorLessonRecommendation from "./components/TutorLessonRecommendation";
import CosmicCompanion from "../../../components/cosmic/CosmicCompanion";

function message(role, text, card) {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`, role, text, card };
}

export default function CosmicTutorPage() {
  const user = useCosmicUser();
  const [messages, setMessages] = useState([
    message("tutor", "Assalamu alaikum. I am your Quran Tarteel tutor. Ask me about surah meanings, ayah counts, memorisation plans, tajweed practice, recitation mistakes, or your next study step."),
  ]);
  const [typing, setTyping] = useState(false);
  const [tutorContext, setTutorContext] = useState({});

  async function respond(prompt) {
    let result;
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt, messages, user, ...tutorContext }),
      });
      result = await response.json();
    } catch {
      result = await getSheikhReply(prompt, { messages, user, ...tutorContext });
    }

    const card = typeof result.card === "string" ? { type: result.card, mode: result.card === "breakdown" ? "meaning" : undefined } : result.card;
    setTutorContext((current) => ({ ...current, ...(result.context || {}) }));
    setMessages((current) => [...current, message("tutor", result.text, card)]);
  }

  async function ask(prompt) {
    setMessages((current) => [...current, message("user", prompt)]);
    setTyping(true);
    try {
      await respond(prompt);
    } finally {
      setTyping(false);
    }
  }

  async function attachAudio(file) {
    const text = `I attached a recitation recording: ${file.name}`;
    setMessages((current) => [...current, message("user", text)]);
    setTyping(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setMessages((current) => [...current, message("tutor", "Thank you for practising. I cannot acoustically analyse the recording in this local build, but here is a focused checklist to use while you listen back.", { type: "recitation", fileName: file.name })]);
    setTyping(false);
  }

  function renderCard(card) {
    if (card.type === "breakdown") return <TutorAyahBreakdown mode={card.mode} />;
    if (card.type === "recitation") return <TutorRecitationFeedback fileName={card.fileName} />;
    if (card.type === "progress") return <TutorProgressReport user={user} />;
    if (card.type === "recommendation") return <TutorLessonRecommendation user={user} />;
    return null;
  }

  return <main className="cosmic-dark cosmic-learning-shell cosmic-tutor-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "34px 16px 90px" }}>
    <StarParticles count={52} color="#cfbfff" />
    <section style={{ position: "relative", width: "min(1120px,100%)", margin: "0 auto", display: "grid", gap: 15 }}>
      <header className="cosmic-tutor-hero" style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}>
        <div><p className="cosmic-review-label" style={{ margin: 0, color: "#ffdc8a", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>GROUNDED STUDY COMPANION</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.35rem,7vw,4.8rem)", lineHeight: .92, letterSpacing: "-.06em" }}>Ask your cosmic tutor.</h1><p style={{ margin: 0, maxWidth: 600, color: "#c4d4e9", lineHeight: 1.6 }}>Meaning, short tafsir summaries, vocabulary, grammar maps, tajweed practice, and a calm next step.</p></div>
        <Link href="/cosmic/path" className="cosmic-button">Learning path</Link>
      </header>
      <div className="cosmic-tutor-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(280px,.82fr)", gap: 16, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 12 }}><TutorChat messages={messages} typing={typing} renderCard={renderCard} /><TutorSuggestions onSelect={ask} /><TutorInput onSend={ask} onAudio={attachAudio} disabled={typing} /></div>
        <aside style={{ display: "grid", gap: 13 }}><CosmicCompanion user={user} compact /><TutorProgressReport user={user} /><TutorLessonRecommendation user={user} /><section className="cosmic-tutor-aside" style={{ padding: 15, borderRadius: 18, color: "#b9cbe3", fontSize: 13, lineHeight: 1.55 }}><strong style={{ color: "#ffdc8a" }}>Study note</strong><p style={{ margin: "6px 0 0" }}>This tutor uses the app's Quran data and lesson summaries. For religious rulings or detailed recitation correction, ask a qualified scholar or teacher.</p></section></aside>
      </div>
    </section>
  </main>;
}
