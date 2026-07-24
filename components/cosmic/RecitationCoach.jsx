"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const NON_ARABIC_LETTERS = /[^\u0621-\u063A\u0641-\u064A\u066E-\u066F\u0671-\u06D3\s]/g;
const EMPTY_LIST = Object.freeze([]);

function normaliseArabic(text = "") {
  return String(text)
    .normalize("NFC")
    .replace(ARABIC_DIACRITICS, "")
    .replace(/[ـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ى]/g, "ي")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(NON_ARABIC_LETTERS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toWords(text) {
  return normaliseArabic(text).split(" ").filter(Boolean);
}

function findLcsPairs(expected, heard) {
  const rows = expected.length + 1;
  const columns = heard.length + 1;
  const table = Array.from({ length: rows }, () => new Uint16Array(columns));

  for (let expectedIndex = 1; expectedIndex < rows; expectedIndex += 1) {
    for (let heardIndex = 1; heardIndex < columns; heardIndex += 1) {
      table[expectedIndex][heardIndex] = expected[expectedIndex - 1] === heard[heardIndex - 1]
        ? table[expectedIndex - 1][heardIndex - 1] + 1
        : Math.max(table[expectedIndex - 1][heardIndex], table[expectedIndex][heardIndex - 1]);
    }
  }

  const pairs = [];
  let expectedIndex = expected.length;
  let heardIndex = heard.length;
  while (expectedIndex > 0 && heardIndex > 0) {
    if (expected[expectedIndex - 1] === heard[heardIndex - 1]) {
      pairs.push([expectedIndex - 1, heardIndex - 1]);
      expectedIndex -= 1;
      heardIndex -= 1;
    } else if (table[expectedIndex - 1][heardIndex] >= table[expectedIndex][heardIndex - 1]) {
      expectedIndex -= 1;
    } else {
      heardIndex -= 1;
    }
  }
  return pairs.reverse();
}

function compareRecitation(arabicText, transcript) {
  const expected = toWords(arabicText);
  const heard = toWords(transcript);
  const pairs = findLcsPairs(expected, heard);
  const pairedExpected = new Set(pairs.map(([expectedIndex]) => expectedIndex));
  const pairedHeard = new Set(pairs.map(([, heardIndex]) => heardIndex));
  const heardSet = new Set(heard);
  const expectedSet = new Set(expected);
  const expectedWords = expected.map((word, index) => ({
    word,
    status: pairedExpected.has(index) ? "matched" : heardSet.has(word) ? "order" : "missed",
  }));
  const extras = heard
    .map((word, index) => ({ word, index }))
    .filter(({ word, index }) => !pairedHeard.has(index) && !expectedSet.has(word))
    .map(({ word }) => word);
  const matched = pairs.length;
  const score = expected.length ? Math.round((matched / expected.length) * 100) : 0;

  return {
    expected,
    heard,
    expectedWords,
    extras,
    matched,
    missed: expectedWords.filter(({ status }) => status === "missed").map(({ word }) => word),
    outOfOrder: expectedWords.filter(({ status }) => status === "order").map(({ word }) => word),
    score,
  };
}

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function humaniseError(error) {
  const messages = {
    "not-allowed": "Microphone permission was not allowed. Enable it in your browser settings, then try again.",
    "service-not-allowed": "Speech recognition is unavailable in this browser session. Try a supported browser or practise with the reference audio.",
    "audio-capture": "No microphone was found. Connect a microphone, then try again.",
    "network": "Speech recognition needs a network connection in this browser. Check your connection and try again.",
    "no-speech": "No speech was detected. Take a breath, then try one short phrase at a time.",
  };
  return messages[error] || "The browser could not listen just now. Try starting the microphone again.";
}

function getTips(comparison) {
  if (!comparison.heard.length) {
    return ["Start the microphone and recite one short phrase. Your live words will appear here as the browser hears them."];
  }

  const tips = [];
  if (comparison.missed.length) {
    tips.push(`Loop the missed word${comparison.missed.length > 1 ? "s" : ""}: ${comparison.missed.slice(0, 3).join(" · ")}. Listen once, then repeat slowly in a small phrase.`);
  }
  if (comparison.outOfOrder.length) {
    tips.push(`Keep the ayah sequence steady around: ${comparison.outOfOrder.slice(0, 3).join(" · ")}. Pause briefly, then restart from the word before it.`);
  }
  if (comparison.extras.length) {
    tips.push(`The browser also heard: ${comparison.extras.slice(0, 3).join(" · ")}. Slow down and leave a little space between words so the recognizer can separate them.`);
  }
  if (!tips.length && comparison.score === 100) {
    tips.push("Beautiful word sequence. Repeat once more with the reference audio and focus on a calm, even pace.");
  } else if (!tips.length) {
    tips.push("Good start. Repeat the ayah in two small phrases, then join them together at a calm pace.");
  }
  return tips;
}

function ScoreRing({ score }) {
  const safeScore = Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0;
  return <div className="recitation-coach__score-ring" style={{ "--recitation-score": `${safeScore * 3.6}deg` }} aria-label={`${safeScore}% word sequence match`}>
    <strong>{safeScore}%</strong>
    <span>sequence</span>
  </div>;
}

/**
 * A browser-only, speech-to-text practice coach. It compares recognized words
 * to the supplied Arabic text; it is intentionally not a tajweed or pronunciation grader.
 */
export default function RecitationCoach({ arabicText = "", translation = "", className = "" }) {
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const [isSupported, setIsSupported] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Check your browser microphone to begin.");
  const [error, setError] = useState("");

  const comparison = useMemo(() => compareRecitation(arabicText, transcript), [arabicText, transcript]);
  const tips = useMemo(() => getTips(comparison), [comparison]);
  const hasTarget = comparison.expected.length > 0;

  useEffect(() => {
    setIsSupported(Boolean(getSpeechRecognition()));
  }, []);

  const endRecognition = useCallback((abort = false) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognitionRef.current = null;
    if (abort) recognition.abort(); else recognition.stop();
  }, []);

  useEffect(() => () => endRecognition(true), [endRecognition]);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Live word comparison needs the Web Speech API. Use a recent Chromium-based browser with microphone access.");
      return;
    }
    if (!hasTarget) {
      setError("Arabic text is not available for this ayah yet, so there is nothing to compare.");
      return;
    }

    endRecognition(true);
    setError("");
    setStatus("Starting your microphone…");

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening live. Recite at a calm pace; you can stop whenever you are ready.");
    };
    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = finalTranscriptRef.current;
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const recognisedText = event.results[index][0]?.transcript || "";
        if (event.results[index].isFinal) finalTranscript = `${finalTranscript} ${recognisedText}`.trim();
        else interimTranscript = `${interimTranscript} ${recognisedText}`.trim();
      }
      finalTranscriptRef.current = finalTranscript;
      setTranscript(`${finalTranscript} ${interimTranscript}`.trim());
    };
    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      setError(humaniseError(event.error));
      setStatus("Listening paused.");
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setIsListening(false);
      setStatus((current) => current.startsWith("Listening") ? "Listening paused. Review the words below or try another short phrase." : current);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setError("The microphone is already starting. Wait a moment, then try again.");
    }
  }, [endRecognition, hasTarget]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setStatus("Finishing this listening pass…");
    endRecognition();
  }, [endRecognition]);

  const resetPractice = useCallback(() => {
    endRecognition(true);
    finalTranscriptRef.current = "";
    setTranscript("");
    setError("");
    setStatus("Ready for a fresh pass. Try one short phrase at a time.");
  }, [endRecognition]);

  return <section className={`recitation-coach ${className}`.trim()} aria-labelledby="recitation-coach-title">
    <div className="recitation-coach__cosmos" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <header className="recitation-coach__header">
      <div>
        <p className="recitation-coach__eyebrow">LIVE RECITATION COACH</p>
        <h2 id="recitation-coach-title">Practise one phrase at a time.</h2>
        <p>We compare the words your browser recognizes with this ayah. It is a practice guide, not a tajweed or pronunciation ruling.</p>
      </div>
      {hasTarget ? <ScoreRing score={comparison.score} /> : null}
    </header>

    {translation ? <div className="recitation-coach__translation"><span>Ayah meaning</span><p>{translation}</p></div> : null}

    <div className="recitation-coach__controls">
      {isSupported === null ? <span className="recitation-coach__checking" role="status">Checking microphone support…</span> : null}
      {isSupported === false ? <p className="recitation-coach__unsupported" role="status">Live listening is not available in this browser. You can still use the reference audio and word practice.</p> : null}
      {isSupported ? <>
        <button type="button" className="recitation-coach__primary" onClick={isListening ? stopListening : startListening} disabled={!hasTarget} aria-pressed={isListening}>
          <span aria-hidden="true" className={isListening ? "recitation-coach__pulse" : "recitation-coach__mic"}>{isListening ? "●" : "◉"}</span>
          {isListening ? "Stop listening" : "Start reciting"}
        </button>
        <button type="button" className="recitation-coach__secondary" onClick={resetPractice} disabled={!transcript && !isListening}>Start fresh</button>
      </> : null}
      <span className="recitation-coach__state" role="status" aria-live="polite">{status}</span>
    </div>

    {error ? <p className="recitation-coach__error" role="alert">{error}</p> : null}

    <div className="recitation-coach__grid">
      <article className="recitation-coach__card recitation-coach__target-card">
        <div className="recitation-coach__card-heading"><span>Reference sequence</span><small>{comparison.expected.length} words</small></div>
        {hasTarget ? <p className="recitation-coach__word-line" dir="rtl" lang="ar">
          {comparison.expectedWords.map(({ word, status: wordStatus }, index) => <span key={`${word}-${index}`} className={`recitation-coach__word is-${wordStatus}`} title={wordStatus === "matched" ? "Recognized in order" : wordStatus === "order" ? "Recognized, but out of sequence" : "Not recognized yet"}>{word}</span>)}
        </p> : <p className="recitation-coach__empty">Arabic text will appear here when the ayah has loaded.</p>}
        <div className="recitation-coach__legend" aria-label="Word comparison legend"><span><i className="is-matched" />Recognized</span><span><i className="is-order" />Out of order</span><span><i className="is-missed" />Try again</span></div>
      </article>

      <article className="recitation-coach__card recitation-coach__transcript-card">
        <div className="recitation-coach__card-heading"><span>What your browser heard</span><small>{isListening ? "Live" : "Ready"}</small></div>
        <p className={`recitation-coach__transcript ${transcript ? "has-text" : ""}`} dir="rtl" lang="ar">{transcript || "Your live Arabic transcript will appear here."}</p>
        <p className="recitation-coach__privacy">This component does not save a recording or update your learning progress. Your browser may use its own speech service to recognize live words.</p>
      </article>
    </div>

    {transcript ? <section className="recitation-coach__feedback" aria-labelledby="recitation-feedback-title">
      <div className="recitation-coach__feedback-title"><div><p className="recitation-coach__eyebrow">YOUR NEXT MOVE</p><h3 id="recitation-feedback-title">{comparison.score >= 90 ? "Strong word flow" : comparison.score >= 55 ? "You are building the sequence" : "Let’s make it smaller"}</h3></div><span>{comparison.matched} / {comparison.expected.length} matched</span></div>
      <div className="recitation-coach__metrics">
        <div><strong>{comparison.missed.length}</strong><span>missed</span></div>
        <div><strong>{comparison.outOfOrder.length}</strong><span>out of order</span></div>
        <div><strong>{comparison.extras.length}</strong><span>extra heard</span></div>
      </div>
      <ul>{tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      <p className="recitation-coach__teacher-note"><strong>For accurate tajweed feedback:</strong> practise with the reference first, then ask a qualified teacher to check articulation, elongation, and stopping points.</p>
    </section> : null}

    <style jsx>{`
      .recitation-coach{position:relative;overflow:hidden;padding:clamp(18px,3.6vw,30px);border:1px solid rgba(130,231,255,.35);border-radius:28px;color:#10213c;background:linear-gradient(142deg,#0a1636 0%,#182d68 48%,#112454 100%);box-shadow:0 24px 65px rgba(5,10,37,.35),inset 0 1px rgba(255,255,255,.2);isolation:isolate}.recitation-coach:before{content:"";position:absolute;z-index:-1;inset:-70% -15% auto auto;width:58%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(132,246,223,.27),rgba(135,146,255,.1) 37%,transparent 68%);filter:blur(4px)}.recitation-coach__cosmos{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none}.recitation-coach__cosmos i{position:absolute;width:4px;height:4px;border-radius:50%;background:#e6faff;box-shadow:0 0 12px #a8eaff;opacity:.8;animation:recitation-star 4.5s ease-in-out infinite}.recitation-coach__cosmos i:nth-child(1){top:14%;left:8%;animation-delay:-.6s}.recitation-coach__cosmos i:nth-child(2){top:62%;left:19%;width:2px;height:2px;animation-delay:-2.2s}.recitation-coach__cosmos i:nth-child(3){top:19%;right:11%;width:3px;height:3px;animation-delay:-1.4s}.recitation-coach__cosmos i:nth-child(4){right:32%;bottom:12%;animation-delay:-3.3s}.recitation-coach__cosmos i:nth-child(5){left:46%;bottom:8%;width:2px;height:2px;animation-delay:-.9s}.recitation-coach__cosmos i:nth-child(6){left:72%;top:44%;width:3px;height:3px;animation-delay:-2.8s}.recitation-coach__header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.recitation-coach__eyebrow{margin:0;color:#8ffff0;font-size:.68rem;font-weight:950;letter-spacing:.14em}.recitation-coach h2,.recitation-coach h3{margin:7px 0 0;color:#fff;letter-spacing:-.045em}.recitation-coach h2{font-size:clamp(1.45rem,3vw,2rem)}.recitation-coach h3{font-size:clamp(1.2rem,2.4vw,1.55rem)}.recitation-coach__header p:not(.recitation-coach__eyebrow){max-width:590px;margin:9px 0 0;color:#c9dbf5;line-height:1.5;font-size:.9rem}.recitation-coach__score-ring{--recitation-score:0deg;display:grid;place-content:center;flex:0 0 80px;width:80px;height:80px;border-radius:50%;text-align:center;background:radial-gradient(circle at center,#eafcff 0 55%,transparent 56%),conic-gradient(#71eed7 var(--recitation-score),rgba(226,245,255,.2) 0);box-shadow:0 0 0 5px rgba(201,250,246,.1),0 0 28px rgba(124,239,221,.35)}.recitation-coach__score-ring strong{color:#14294e;font-size:1rem;line-height:1}.recitation-coach__score-ring span{margin-top:2px;color:#4c6585;font-size:.55rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}.recitation-coach__translation{margin-top:19px;padding:12px 14px;border-radius:15px;border:1px solid rgba(214,239,255,.45);background:rgba(239,250,255,.95);box-shadow:0 8px 20px rgba(0,0,0,.12)}.recitation-coach__translation span{color:#47709a;font-size:.66rem;font-weight:950;letter-spacing:.1em;text-transform:uppercase}.recitation-coach__translation p{margin:4px 0 0;color:#173255;font-size:.9rem;line-height:1.45}.recitation-coach__controls{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:17px}.recitation-coach button{font:inherit}.recitation-coach__primary,.recitation-coach__secondary{min-height:42px;border-radius:13px;padding:0 14px;cursor:pointer;font-size:.84rem;font-weight:950;transition:transform .18s cubic-bezier(.16,1,.3,1),box-shadow .18s ease,filter .18s ease}.recitation-coach__primary{display:inline-flex;align-items:center;gap:8px;border:0;color:#082443;background:linear-gradient(135deg,#89f6d3,#7ce9ff);box-shadow:0 9px 22px rgba(103,235,217,.28)}.recitation-coach__secondary{border:1px solid rgba(218,243,255,.48);color:#ecfaff;background:rgba(9,25,61,.45)}.recitation-coach__primary:hover:not(:disabled),.recitation-coach__secondary:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.06)}.recitation-coach__primary:focus-visible,.recitation-coach__secondary:focus-visible{outline:3px solid #ffe587;outline-offset:3px}.recitation-coach button:disabled{cursor:not-allowed;opacity:.54}.recitation-coach__mic{font-size:1.1rem;line-height:1}.recitation-coach__pulse{color:#fb5175;font-size:1rem;line-height:1;animation:recitation-pulse .9s ease-in-out infinite}.recitation-coach__state{flex:1 1 220px;color:#cbe4ff;font-size:.78rem;line-height:1.4}.recitation-coach__checking,.recitation-coach__unsupported,.recitation-coach__error{margin:0;padding:10px 12px;border-radius:12px;font-size:.8rem;line-height:1.45}.recitation-coach__checking{color:#dcefff;background:rgba(255,255,255,.1)}.recitation-coach__unsupported{color:#fff1c6;border:1px solid rgba(255,214,124,.45);background:rgba(105,75,18,.32)}.recitation-coach__error{margin-top:12px;color:#fff0f3;border:1px solid rgba(255,139,162,.54);background:rgba(119,21,55,.48)}.recitation-coach__grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:19px}.recitation-coach__card{min-width:0;padding:16px;border:1px solid rgba(213,236,255,.38);border-radius:19px;background:linear-gradient(150deg,rgba(250,253,255,.98),rgba(215,238,255,.94));box-shadow:0 14px 30px rgba(5,13,42,.18)}.recitation-coach__card-heading,.recitation-coach__feedback-title{display:flex;align-items:center;justify-content:space-between;gap:10px}.recitation-coach__card-heading span{color:#183b65;font-size:.72rem;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.recitation-coach__card-heading small{padding:4px 7px;border-radius:999px;color:#567795;background:#dceefe;font-size:.65rem;font-weight:900}.recitation-coach__word-line,.recitation-coach__transcript{min-height:88px;margin:12px 0 0;line-height:2.25;text-align:right;font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.36rem,3.1vw,1.8rem)}.recitation-coach__word{display:inline-block;margin:0 0 6px 7px;padding:0 6px;border-radius:8px;color:#38516f;transition:background .25s ease,color .25s ease,box-shadow .25s ease}.recitation-coach__word.is-matched{color:#12644e;background:#c9f8df;box-shadow:0 3px 8px rgba(70,214,161,.2)}.recitation-coach__word.is-order{color:#70520a;background:#fff0b5;box-shadow:0 3px 8px rgba(233,184,56,.16)}.recitation-coach__word.is-missed{color:#39516d;background:#e9f2fa}.recitation-coach__empty{margin:15px 0;color:#58748f;font-size:.84rem;line-height:1.5}.recitation-coach__legend{display:flex;gap:11px;flex-wrap:wrap;margin-top:8px;color:#56718e;font-size:.68rem;font-weight:800}.recitation-coach__legend span{display:inline-flex;align-items:center;gap:5px}.recitation-coach__legend i{width:8px;height:8px;border-radius:50%}.recitation-coach__legend .is-matched{background:#5add9d}.recitation-coach__legend .is-order{background:#e8bb44}.recitation-coach__legend .is-missed{background:#bfd4e6}.recitation-coach__transcript{display:grid;place-items:center;min-height:104px;padding:8px 0;color:#7c95ac;font-family:Georgia,"Times New Roman",serif;font-size:1.1rem;text-align:center;line-height:1.7}.recitation-coach__transcript.has-text{display:block;color:#133d64;text-align:right;font-size:clamp(1.36rem,3.1vw,1.8rem);line-height:2.25}.recitation-coach__privacy{margin:8px 0 0;color:#5a7895;font-size:.68rem;line-height:1.45}.recitation-coach__feedback{margin-top:14px;padding:17px;border:1px solid rgba(168,248,219,.54);border-radius:20px;background:linear-gradient(135deg,rgba(230,255,245,.98),rgba(224,246,255,.98));box-shadow:0 14px 35px rgba(2,19,49,.18)}.recitation-coach__feedback-title>span{padding:7px 10px;border-radius:999px;color:#0f6653;background:#b9f7d9;font-size:.73rem;font-weight:950}.recitation-coach__feedback .recitation-coach__eyebrow{color:#248c74}.recitation-coach__feedback h3{color:#153e57}.recitation-coach__metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}.recitation-coach__metrics div{padding:10px;border-radius:12px;background:rgba(255,255,255,.7);text-align:center}.recitation-coach__metrics strong{display:block;color:#1d5679;font-size:1.15rem}.recitation-coach__metrics span{display:block;margin-top:2px;color:#5d7890;font-size:.65rem;font-weight:850;text-transform:uppercase}.recitation-coach__feedback ul{display:grid;gap:8px;margin:14px 0 0;padding:0;list-style:none}.recitation-coach__feedback li{position:relative;padding:10px 10px 10px 27px;border-radius:12px;color:#23435e;background:rgba(255,255,255,.74);font-size:.82rem;line-height:1.48}.recitation-coach__feedback li:before{content:"✦";position:absolute;left:10px;color:#27ac8b}.recitation-coach__teacher-note{margin:13px 0 0;color:#52718c;font-size:.73rem;line-height:1.48}.recitation-coach__teacher-note strong{color:#265774}@keyframes recitation-star{0%,100%{transform:translateY(0) scale(.75);opacity:.25}50%{transform:translateY(-7px) scale(1.2);opacity:1}}@keyframes recitation-pulse{0%,100%{transform:scale(.82);text-shadow:0 0 0 rgba(255,81,117,0)}50%{transform:scale(1.15);text-shadow:0 0 14px rgba(255,81,117,.9)}}@media(max-width:700px){.recitation-coach{padding:17px;border-radius:22px}.recitation-coach__header{gap:12px}.recitation-coach__score-ring{flex-basis:64px;width:64px;height:64px}.recitation-coach__grid{grid-template-columns:1fr}.recitation-coach__word-line,.recitation-coach__transcript{min-height:auto}.recitation-coach__metrics{gap:6px}.recitation-coach__metrics div{padding:8px 5px}.recitation-coach__state{flex-basis:100%}}@media(prefers-reduced-motion:reduce){.recitation-coach *{animation:none!important;transition:none!important}}
    `}</style>
  </section>;
}

export { compareRecitation, normaliseArabic };
