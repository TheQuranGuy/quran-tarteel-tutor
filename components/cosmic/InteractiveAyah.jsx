"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const HTML_TAGS = /<[^>]*>/g;
const ENGLISH_WORDS = /[A-Za-z]+(?:[’'-][A-Za-z]+)?/g;

const FATIHA_GLOSSES = {
  "بسم": "In the name",
  "الله": "Allah",
  "الرحمن": "The Most Compassionate",
  "الرحيم": "The Most Merciful",
  "الحمد": "All praise",
  "لله": "For Allah",
  "رب": "Lord and Sustainer",
  "العالمين": "The worlds",
  "مالك": "Master",
  "يوم": "Day",
  "الدين": "The Judgement",
  "اياك": "You alone",
  "نعبد": "We worship",
  "نستعين": "We ask for help",
  "اهدنا": "Guide us",
  "الصراط": "The path",
  "المستقيم": "The straight",
  "صراط": "Path",
  "الذين": "Those who",
  "انعمت": "You have favoured",
  "عليهم": "Upon them",
  "غير": "Other than / not",
  "المغضوب": "Those who earned anger",
  "الضالين": "Those who went astray",
};

function cleanText(value) {
  return String(value || "").replace(HTML_TAGS, "").replace(/\s+/g, " ").trim();
}

function normaliseArabic(value) {
  return cleanText(value)
    .replace(ARABIC_DIACRITICS, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .replace(/[^\u0621-\u063A\u0641-\u064A]/g, "");
}

function isVerseMarker(word) {
  const text = cleanText(word?.text || word);
  return !text || !/[\u0621-\u063A\u0641-\u064A]/.test(text);
}

function createFallbackWords(arabicText) {
  return cleanText(arabicText)
    .split(/\s+/)
    .filter((text) => !isVerseMarker(text))
    .map((text, index) => ({
      text,
      position: index + 1,
      type: "word",
    }));
}

function getPlayableWordUrl(word) {
  const audioUrl = cleanText(word?.audioUrl);
  if (!audioUrl) return null;
  return audioUrl.startsWith("http") ? audioUrl : `https://audio.qurancdn.com/${audioUrl.replace(/^\/+/, "")}`;
}

function getGloss(word, wordIndex, translation) {
  const providedMeaning = cleanText(word?.meaning || word?.translation);
  if (providedMeaning && !/^word-by-word meaning is temporarily unavailable\.?$/i.test(providedMeaning)) return providedMeaning;

  const knownGloss = FATIHA_GLOSSES[normaliseArabic(word?.text)];
  if (knownGloss) return knownGloss;

  const englishTokens = cleanText(translation).match(ENGLISH_WORDS) || [];
  const clue = englishTokens[Math.min(wordIndex, Math.max(0, englishTokens.length - 1))];
  return clue ? `Translation clue: “${clue}”` : `Word ${wordIndex + 1} of this ayah`;
}

function speakWord(text, onEnd) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return false;
  const spokenText = cleanText(text);
  if (!spokenText) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = "ar-SA";
  utterance.rate = 0.76;
  utterance.pitch = 1;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
  return true;
}

export default function InteractiveAyah({
  arabicText,
  translation,
  ayahId,
  words = [],
  onWordPlay,
  showTranslation = true,
}) {
  const audioRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const ayahWords = useMemo(() => {
    const suppliedWords = Array.isArray(words)
      ? words.filter((word) => word && word.text && word.type !== "end" && word.char_type_name !== "end" && !isVerseMarker(word))
      : [];
    return suppliedWords.length ? suppliedWords : createFallbackWords(arabicText);
  }, [arabicText, words]);

  const detailIndex = hoveredIndex ?? selectedIndex;
  const detailWord = detailIndex === null ? null : ayahWords[detailIndex];

  useEffect(() => () => {
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  async function playWord(word, index) {
    setSelectedIndex(index);
    const payload = {
      ayahId,
      word,
      wordIndex: index,
      text: word.text,
      meaning: getGloss(word, index, translation),
    };

    try {
      const handled = await onWordPlay?.(payload);
      if (handled === true) return;
    } catch {}

    const url = getPlayableWordUrl(word);
    if (url) {
      audioRef.current?.pause();
      const audio = new Audio(url);
      let fallbackUsed = false;
      const useSpeechFallback = () => {
        if (fallbackUsed) return;
        fallbackUsed = true;
        if (speakWord(word.text, () => setSpeakingIndex((current) => current === index ? null : current))) setSpeakingIndex(index);
        else setSpeakingIndex((current) => current === index ? null : current);
      };
      audioRef.current = audio;
      audio.onplay = () => setSpeakingIndex(index);
      audio.onended = () => setSpeakingIndex((current) => current === index ? null : current);
      audio.onerror = useSpeechFallback;
      try {
        await audio.play();
        return;
      } catch {
        useSpeechFallback();
        return;
      }
    }

    if (speakWord(word.text, () => setSpeakingIndex((current) => current === index ? null : current))) setSpeakingIndex(index);
  }

  if (!ayahWords.length) return null;

  return (
    <section className="interactive-ayah" aria-label={`Interactive words for ayah ${ayahId || ""}`.trim()}>
      <div className="interactive-ayah__words" lang="ar" dir="rtl">
        {ayahWords.map((word, index) => {
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const isSpeaking = speakingIndex === index;
          return (
            <button
              aria-describedby={detailIndex === index ? "interactive-ayah-detail" : undefined}
              aria-pressed={isSelected}
              className={`interactive-ayah__word${isHovered ? " is-hovered" : ""}${isSelected ? " is-selected" : ""}${isSpeaking ? " is-speaking" : ""}`}
              key={`${word.position || index}-${word.text}`}
              onBlur={() => setHoveredIndex((current) => current === index ? null : current)}
              onClick={() => playWord(word, index)}
              onFocus={() => setHoveredIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex((current) => current === index ? null : current)}
              type="button"
            >
              {word.text}
            </button>
          );
        })}
      </div>

      <div className={`interactive-ayah__detail${detailWord ? " is-visible" : ""}`} id="interactive-ayah-detail" role="status" aria-live="polite">
        {detailWord ? (
          <>
            <div className="interactive-ayah__detail-orbit" aria-hidden="true" />
            <span className="interactive-ayah__detail-word" lang="ar">{detailWord.text}</span>
            <div className="interactive-ayah__detail-copy">
              <strong>{getGloss(detailWord, detailIndex, translation)}</strong>
              {cleanText(detailWord.transliteration) ? <span>{cleanText(detailWord.transliteration)}</span> : null}
              <small>Word {(detailIndex || 0) + 1} · click to pin and hear it</small>
            </div>
          </>
        ) : <span>Hover a word to see a translation clue. Click one to pin its meaning and hear it.</span>}
      </div>

      {showTranslation ? (
        <div className="interactive-ayah__translation">
          <span>FULL TRANSLATION</span>
          <p>{cleanText(translation) || "English translation is unavailable for this ayah."}</p>
        </div>
      ) : null}

      <style jsx>{`
        .interactive-ayah {
          display: grid;
          gap: 14px;
          color: #ecf5ff;
        }

        .interactive-ayah__words {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 8px 10px;
          padding: clamp(15px, 3vw, 24px);
          border: 1px solid rgba(161, 222, 255, 0.22);
          border-radius: 22px;
          background:
            radial-gradient(circle at 18% 8%, rgba(112, 225, 255, 0.17), transparent 34%),
            linear-gradient(135deg, rgba(13, 33, 84, 0.9), rgba(16, 12, 63, 0.9));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 18px 45px rgba(4, 8, 36, 0.24);
        }

        .interactive-ayah__word {
          position: relative;
          min-width: 0;
          border: 1px solid transparent;
          border-radius: 13px;
          padding: 4px 7px 6px;
          color: #f4fbff;
          background: transparent;
          cursor: pointer;
          font-family: "Noto Naskh Arabic", "Amiri", Georgia, serif;
          font-size: clamp(2rem, 5.5vw, 3.55rem);
          line-height: 1.34;
          transition: transform 170ms cubic-bezier(.2, .8, .2, 1), border-color 170ms ease, background 170ms ease, box-shadow 170ms ease, color 170ms ease;
        }

        .interactive-ayah__word::after {
          position: absolute;
          inset: auto 18% 3px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #75edff, transparent);
          opacity: 0;
          content: "";
          transform: scaleX(0.35);
          transition: opacity 170ms ease, transform 170ms ease;
        }

        .interactive-ayah__word:hover,
        .interactive-ayah__word:focus-visible,
        .interactive-ayah__word.is-hovered,
        .interactive-ayah__word.is-selected {
          z-index: 1;
          border-color: rgba(117, 237, 255, 0.7);
          color: #ffffff;
          background: radial-gradient(circle at 50% 55%, rgba(117, 237, 255, 0.28), rgba(154, 113, 255, 0.08) 68%);
          box-shadow: 0 0 0 2px rgba(117, 237, 255, 0.09), 0 0 26px rgba(83, 218, 255, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          outline: none;
          transform: translateY(-4px) scale(1.045);
        }

        .interactive-ayah__word:hover::after,
        .interactive-ayah__word:focus-visible::after,
        .interactive-ayah__word.is-hovered::after,
        .interactive-ayah__word.is-selected::after {
          opacity: 1;
          transform: scaleX(1);
        }

        .interactive-ayah__word.is-speaking {
          animation: wordPulse 1.05s ease-in-out infinite;
        }

        .interactive-ayah__detail {
          position: relative;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          min-height: 72px;
          overflow: hidden;
          border: 1px solid rgba(150, 118, 255, 0.36);
          border-radius: 18px;
          padding: 13px 16px;
          color: #dbeaff;
          background: linear-gradient(125deg, rgba(76, 46, 157, 0.64), rgba(13, 48, 103, 0.74));
          box-shadow: 0 14px 38px rgba(7, 12, 52, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          opacity: 0.86;
          transition: transform 200ms cubic-bezier(.2, .85, .25, 1), opacity 180ms ease, border-color 180ms ease;
        }

        .interactive-ayah__detail.is-visible {
          border-color: rgba(116, 237, 255, 0.72);
          opacity: 1;
          transform: translateY(-2px);
        }

        .interactive-ayah__detail-orbit {
          position: absolute;
          width: 130px;
          height: 130px;
          border: 1px solid rgba(134, 238, 255, 0.29);
          border-radius: 50%;
          right: -48px;
          top: -35px;
          box-shadow: 0 0 35px rgba(121, 101, 255, 0.25);
          pointer-events: none;
          transform: rotate(-23deg);
        }

        .interactive-ayah__detail-word {
          position: relative;
          margin-inline-end: 12px;
          color: #ffffff;
          font-family: "Noto Naskh Arabic", "Amiri", Georgia, serif;
          font-size: 2.05rem;
          line-height: 1;
          text-shadow: 0 0 18px rgba(126, 238, 255, 0.75);
        }

        .interactive-ayah__detail-copy {
          position: relative;
          display: grid;
          gap: 2px;
          min-width: 0;
        }

        .interactive-ayah__detail-copy strong {
          color: #ffffff;
          font-size: 0.97rem;
        }

        .interactive-ayah__detail-copy span,
        .interactive-ayah__detail-copy small {
          color: #c7dbff;
          font-size: 0.78rem;
        }

        .interactive-ayah__translation {
          border-radius: 14px;
          border-left: 2px solid rgba(115, 237, 255, 0.68);
          padding: 11px 13px;
          background: linear-gradient(135deg, rgba(233, 248, 255, 0.96), rgba(214, 240, 255, 0.91));
          box-shadow: 0 9px 20px rgba(8, 25, 66, 0.12);
        }

        .interactive-ayah__translation span {
          color: #1f6f96;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .interactive-ayah__translation p {
          margin: 5px 0 0;
          color: #18385d;
          font-size: 1rem;
          line-height: 1.62;
        }

        @keyframes wordPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(117, 237, 255, 0.12), 0 0 20px rgba(83, 218, 255, 0.34); }
          50% { box-shadow: 0 0 0 4px rgba(117, 237, 255, 0.22), 0 0 40px rgba(83, 218, 255, 0.72); }
        }

        @media (max-width: 520px) {
          .interactive-ayah__words { gap: 5px 6px; padding: 13px; }
          .interactive-ayah__word { font-size: clamp(1.75rem, 9.5vw, 2.45rem); padding: 3px 4px 5px; }
          .interactive-ayah__detail { grid-template-columns: 1fr; gap: 7px; }
          .interactive-ayah__detail-word { margin-inline-end: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .interactive-ayah__word,
          .interactive-ayah__detail { transition: none; }
          .interactive-ayah__word.is-speaking { animation: none; }
        }
      `}</style>
    </section>
  );
}
