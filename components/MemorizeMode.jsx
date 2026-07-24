"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { completeMemorization, saveMemorizationProgress } from "../lib/progress";

export default function MemorizeMode({ lesson }) {
  const [step, setStep] = useState(1);
  const [revealed, setRevealed] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [slow, setSlow] = useState(false);
  const [complete, setComplete] = useState(false);
  const labels = ["Listen and follow", "Recall from memory", "Confirm and repeat"];

  function next() {
    const updated = Math.min(step + 1, 3);
    setStep(updated);
    setRevealed(updated !== 2);
    saveMemorizationProgress(lesson.id, updated, 3);
  }

  function finish() {
    completeMemorization(lesson.id, 10);
    setComplete(true);
  }

  return (
    <section>
      <header className="page-heading">
        <p className="eyebrow">Memorisation mode</p>
        <h1>{lesson.title}</h1>
        <p className="lead">Step {step} of 3: {labels[step - 1]}</p>
      </header>

      <section className="memorize-card">
        <div className="memorize-controls">
          <AudioPlayer ayah={lesson.ayah} loopEnabled={repeat} slow={slow} />
          <button className={`toggle ${repeat ? "active" : ""}`} onClick={() => setRepeat(!repeat)} type="button">Repeat after me</button>
          <button className={`toggle ${slow ? "active" : ""}`} onClick={() => setSlow(!slow)} type="button">Slow recitation</button>
        </div>

        <p className={`memorize-arabic ${revealed ? "revealed" : "hidden-ayah"}`}>
          {revealed ? lesson.ayah.arabic : "...................."}
        </p>

        <div className="button-row centered">
          <button className="button secondary" onClick={() => setRevealed(!revealed)} type="button">{revealed ? "Hide Arabic" : "Reveal Arabic"}</button>
          {step < 3 ? (
            <button className="button primary" onClick={next} type="button">Next step</button>
          ) : (
            <button className="button primary" disabled={complete} onClick={finish} type="button">{complete ? "Memorisation complete +10 XP" : "Claim 10 XP"}</button>
          )}
        </div>

        {complete && <p className="quiz-success celebrate">Excellent work. This ayah is now in your memorisation progress.</p>}
      </section>
    </section>
  );
}
