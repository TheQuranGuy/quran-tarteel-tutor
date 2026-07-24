"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addXP, startUserSession } from "../../../lib/user";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import ChallengeIntro from "./components/ChallengeIntro";
import ChallengeQuiz from "./components/ChallengeQuiz";
import ChallengeSummary from "./components/ChallengeSummary";
import ChallengeLeaderboard from "./components/ChallengeLeaderboard";

const BOARD_SEED = [
  { name: "Amina", score: 5, total: 5, xp: 100, accuracy: 100 },
  { name: "Yusuf", score: 4, total: 5, xp: 80, accuracy: 80 },
  { name: "Maryam", score: 4, total: 5, xp: 80, accuracy: 80 },
  { name: "Ibrahim", score: 3, total: 5, xp: 60, accuracy: 60 },
];

function localDay() { return new Intl.DateTimeFormat("en-CA").format(new Date()); }
function challengeKey(day) { return `sheikhduo-cosmic-challenge-${day}`; }
function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
function createQuestions() { return shuffle(COSMIC_UNITS.flatMap((unit) => unit.ayahs.map((ayah) => ({ ...ayah, surahId: unit.id, surahName: unit.name })))).slice(0, 5); }
function readResult(day) { try { return JSON.parse(window.localStorage.getItem(challengeKey(day)) || "null"); } catch { return null; } }
function saveResult(day, result) { window.localStorage.setItem(challengeKey(day), JSON.stringify(result)); }

export default function CosmicChallengePage() {
  const user = useCosmicUser();
  const [day, setDay] = useState("");
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState("loading");
  const [result, setResult] = useState(null);
  const [showBoard, setShowBoard] = useState(false);
  const translations = useMemo(() => COSMIC_UNITS.flatMap((unit) => unit.ayahs.map((ayah) => ayah.translation)), []);

  useEffect(() => {
    const currentDay = localDay();
    const saved = readResult(currentDay);
    setDay(currentDay);
    setQuestions(createQuestions());
    if (saved?.completed) {
      setResult(saved);
      setMode("locked");
    } else setMode("intro");
  }, []);

  const finish = useCallback((sessionResult) => {
    const completedResult = { ...sessionResult, completed: true, completedAt: Date.now(), accuracy: sessionResult.total ? Math.round((sessionResult.score / sessionResult.total) * 100) : 0 };
    saveResult(day, completedResult);
    setResult(completedResult);
    setMode("summary");
    setShowBoard(true);
  }, [day]);

  function start() {
    startUserSession();
    setQuestions(createQuestions());
    setMode("active");
  }
  function awardXp(amount) { addXP(amount, "Daily cosmic trial"); }
  const entries = useMemo(() => {
    if (!result) return BOARD_SEED;
    return [...BOARD_SEED, { name: user.username || "You", score: result.score, total: result.total, xp: result.xp, accuracy: result.accuracy }];
  }, [result, user.username]);

  return <main className="cosmic-dark cosmic-learning-shell cosmic-challenge-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}>
    <StarParticles count={48} color="#d6b6ff" />
    <section style={{ position: "relative", width: "min(860px, 100%)", margin: "0 auto", display: "grid", gap: 18 }}>
      {mode === "loading" ? <div style={{ minHeight: 280 }} /> : null}
      {mode === "intro" || mode === "locked" ? <ChallengeIntro completed={mode === "locked"} onStart={start} onLeaderboard={() => setShowBoard(true)} /> : null}
      {mode === "active" && questions.length ? <ChallengeQuiz questions={questions} translations={translations} onAwardXp={awardXp} onComplete={finish} /> : null}
      {mode === "summary" && result ? <ChallengeSummary result={result} streak={user.streak || 0} onLeaderboard={() => setShowBoard(true)} /> : null}
      {showBoard ? <ChallengeLeaderboard entries={entries} username={user.username || "You"} /> : null}
    </section>
  </main>;
}
