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

function message(role, text, card) { return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`, role, text, card }; }

export default function CosmicTutorPage() {
  const user = useCosmicUser();
  const [messages, setMessages] = useState([message("tutor", "Assalamu alaikum. I’m your Cosmic Sheikh Tutor. I can give grounded study help from the available Al-Fatiha lessons, explain vocabulary and grammar, or suggest your next calm step.")]);
  const [typing, setTyping] = useState(false);

  async function respond(prompt) {
    const query = prompt.toLowerCase();
    let reply;
    if (query.includes("grammar")) reply = { text: "Let’s look at the grammar carefully. This is a compact learning map, not a substitute for a full Arabic course.", card: { type: "breakdown", mode: "grammar" } };
    else if (query.includes("tajweed")) reply = { text: "Here are the tajweed points from the available lesson. Listen, repeat slowly, and check each doubled consonant.", card: { type: "breakdown", mode: "tajweed" } };
    else if (query.includes("memor") || query.includes("help me")) reply = { text: "Try this gentle memorisation loop: listen once, read one phrase aloud three times, hide it, then reveal and correct yourself.", card: { type: "breakdown", mode: "meaning" } };
    else if (query.includes("progress") || query.includes("mastery") || query.includes("weak")) reply = { text: "Here is your current progress constellation and the clearest place to focus next.", card: { type: "progress" } };
    else if (query.includes("recommend") || query.includes("next step") || query.includes("lesson")) reply = { text: "I picked a next step using your mastered and weak ayahs. Small, consistent sessions are usually best.", card: { type: "recommendation" } };
    else if (query.includes("recit") || query.includes("pronoun")) reply = { text: "I can give you a careful self-check list. For formal evaluation, please learn with a qualified teacher.", card: { type: "recitation" } };
    else { const text = await getSheikhReply(prompt); reply = { text, card: query.includes("bismillah") || query.includes("ayah") ? { type: "breakdown", mode: "meaning" } : null }; }
    setMessages((current) => [...current, message("tutor", reply.text, reply.card)]);
  }

  async function ask(prompt) { setMessages((current) => [...current, message("user", prompt)]); setTyping(true); try { await respond(prompt); } finally { setTyping(false); } }
  async function attachAudio(file) { const text = `I attached a recitation recording: ${file.name}`; setMessages((current) => [...current, message("user", text)]); setTyping(true); await new Promise((resolve) => window.setTimeout(resolve, 350)); setMessages((current) => [...current, message("tutor", "Thank you for practising. I can’t acoustically analyse the recording in this local build, but here is a focused checklist to use while you listen back.", { type: "recitation", fileName: file.name })]); setTyping(false); }
  function renderCard(card) { if (card.type === "breakdown") return <TutorAyahBreakdown mode={card.mode} />; if (card.type === "recitation") return <TutorRecitationFeedback fileName={card.fileName} />; if (card.type === "progress") return <TutorProgressReport user={user} />; if (card.type === "recommendation") return <TutorLessonRecommendation user={user} />; return null; }

  return <main className="cosmic-dark cosmic-learning-shell cosmic-tutor-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}>
    <StarParticles count={52} color="#cfbfff" />
    <section style={{ position: "relative", width: "min(1120px,100%)", margin: "0 auto", display: "grid", gap: 17 }}>
      <header className="cosmic-tutor-hero" style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}>
        <div><p className="cosmic-review-label" style={{ margin: 0, color: "#ffdc8a", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>GROUNDED STUDY COMPANION</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Ask your cosmic tutor.</h1><p style={{ margin: 0, maxWidth: 600, color: "#c4d4e9", lineHeight: 1.6 }}>Meaning, short tafsir summaries, vocabulary, grammar maps, tajweed practice, and a calm next step.</p></div>
        <Link href="/cosmic/path" className="cosmic-button">Learning path</Link>
      </header>
      <div className="cosmic-tutor-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(280px,.82fr)", gap: 16, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 12 }}><TutorChat messages={messages} typing={typing} renderCard={renderCard} /><TutorSuggestions onSelect={ask} /><TutorInput onSend={ask} onAudio={attachAudio} disabled={typing} /></div>
        <aside style={{ display: "grid", gap: 13 }}><CosmicCompanion user={user} compact /><TutorProgressReport user={user} /><TutorLessonRecommendation user={user} /><section className="cosmic-tutor-aside" style={{ padding: 15, borderRadius: 18, color: "#b9cbe3", fontSize: 13, lineHeight: 1.55 }}><strong style={{ color: "#ffdc8a" }}>Study note</strong><p style={{ margin: "6px 0 0" }}>This tutor uses the project&apos;s available lesson summaries. For religious rulings or detailed recitation correction, ask a qualified scholar or teacher.</p></section></aside>
      </div>
    </section>
  </main>;
}
