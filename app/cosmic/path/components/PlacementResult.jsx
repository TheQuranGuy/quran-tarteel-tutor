"use client";

import { motion } from "framer-motion";

const DEFAULT_RESULT = {
  level: "Explorer",
  title: "A calm place to begin",
  description: "We will start with a short, confidence-building chapter and build from there.",
  startingChapter: "Chapter 1 · Foundations",
  score: 0,
  total: 6,
  strengths: ["Listen first", "Build one ayah at a time", "Keep your streak gentle"],
};

/**
 * Presentational result screen for the Cosmic Path placement quiz.
 * The owning page decides how a result is calculated and what happens after a callback.
 */
export default function PlacementResult({
  result = DEFAULT_RESULT,
  onBegin,
  onRetake,
  onExplore,
  isLoading = false,
}) {
  const details = { ...DEFAULT_RESULT, ...result };
  const total = Math.max(1, Number(details.total) || DEFAULT_RESULT.total);
  const score = Math.max(0, Math.min(total, Number(details.score) || 0));
  const percentage = Math.round((score / total) * 100);
  const strengths = Array.isArray(details.strengths) ? details.strengths.slice(0, 3) : [];

  return (
    <motion.section
      aria-labelledby="placement-result-title"
      className="placement-result"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 210, damping: 22 }}
    >
      <div className="placement-result__halo" aria-hidden="true" />
      <div className="placement-result__stars" aria-hidden="true">✦ · ✧ · ✦</div>

      <p className="placement-result__eyebrow">YOUR COSMIC START</p>
      <div className="placement-result__badge" aria-label={`${details.level} level`}>
        <span aria-hidden="true">✦</span>
        {details.level}
      </div>
      <h2 id="placement-result-title">{details.title}</h2>
      <p className="placement-result__description">{details.description}</p>

      <div className="placement-result__score" aria-label={`${score} out of ${total} confidence signals`}>
        <div className="placement-result__score-ring" style={{ "--placement-progress": `${percentage}%` }}>
          <div>
            <strong>{score}/{total}</strong>
            <span>signals</span>
          </div>
        </div>
        <div>
          <span className="placement-result__label">RECOMMENDED FIRST STOP</span>
          <strong className="placement-result__chapter">{details.startingChapter}</strong>
          <span className="placement-result__caption">A path that feels challenging, never overwhelming.</span>
        </div>
      </div>

      {strengths.length ? (
        <ul className="placement-result__strengths" aria-label="Your path focus">
          {strengths.map((strength) => <li key={strength}><span aria-hidden="true">✓</span>{strength}</li>)}
        </ul>
      ) : null}

      <div className="placement-result__actions">
        <button className="placement-button placement-button--primary" type="button" onClick={onBegin} disabled={isLoading}>
          {isLoading ? "Preparing your path…" : "Begin my pathway"}
          {!isLoading ? <span aria-hidden="true">→</span> : null}
        </button>
        <div className="placement-result__secondary-actions">
          {onRetake ? <button className="placement-text-button" type="button" onClick={onRetake} disabled={isLoading}>Try the quiz again</button> : null}
          {onExplore ? <button className="placement-text-button" type="button" onClick={onExplore} disabled={isLoading}>Explore all chapters</button> : null}
        </div>
      </div>

      <style jsx global>{`
        .placement-result {
          position: relative;
          width: min(100%, 680px);
          overflow: hidden;
          padding: clamp(25px, 5vw, 46px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 30px;
          color: #26344f;
          text-align: center;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.99), rgba(236, 246, 255, 0.98));
          box-shadow: 0 28px 72px rgba(1, 10, 39, 0.32), inset 0 2px 0 rgba(255, 255, 255, 0.9);
          isolation: isolate;
        }
        .placement-result__halo {
          position: absolute;
          z-index: -1;
          top: -13rem;
          left: 50%;
          width: 32rem;
          height: 32rem;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(120, 222, 255, 0.62), rgba(177, 143, 255, 0.25) 45%, transparent 70%);
          filter: blur(3px);
          transform: translateX(-50%);
        }
        .placement-result__stars {
          position: absolute;
          top: 19px;
          right: 22px;
          color: #8f78ff;
          font-size: 14px;
          letter-spacing: 5px;
          opacity: .78;
        }
        .placement-result__eyebrow,
        .placement-result__label {
          margin: 0;
          color: #5684ae;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .14em;
        }
        .placement-result__badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 12px;
          border: 1px solid #cdebe0;
          border-radius: 999px;
          padding: 7px 11px;
          color: #1e6d5b;
          background: #e9fff6;
          font-size: 13px;
          font-weight: 900;
        }
        .placement-result__badge span { color: #e9a821; }
        .placement-result h2 {
          max-width: 16ch;
          margin: 15px auto 9px;
          color: #1b2d4b;
          font-family: ui-rounded, "Avenir Next", "Nunito", system-ui, sans-serif;
          font-size: clamp(2rem, 5vw, 3.35rem);
          line-height: .98;
          letter-spacing: -.055em;
        }
        .placement-result__description {
          max-width: 46ch;
          margin: 0 auto;
          color: #667691;
          font-size: 15px;
          line-height: 1.65;
        }
        .placement-result__score {
          display: grid;
          grid-template-columns: 106px minmax(0, 1fr);
          align-items: center;
          gap: 17px;
          margin: 26px 0 17px;
          border: 1px solid #dce8f4;
          border-radius: 21px;
          padding: 15px;
          text-align: left;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.9);
        }
        .placement-result__score-ring {
          display: grid;
          width: 100px;
          height: 100px;
          place-items: center;
          border-radius: 50%;
          background: conic-gradient(#62cf86 var(--placement-progress), #dce8f4 0);
          box-shadow: 0 8px 18px rgba(47, 172, 125, 0.2);
        }
        .placement-result__score-ring > div {
          display: grid;
          width: 79px;
          height: 79px;
          place-items: center;
          border-radius: 50%;
          background: #fff;
          line-height: 1;
        }
        .placement-result__score-ring strong { color: #254464; font-size: 19px; letter-spacing: -.05em; }
        .placement-result__score-ring span { color: #7890aa; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .placement-result__chapter { display: block; margin-top: 5px; color: #264264; font-size: 18px; letter-spacing: -.025em; }
        .placement-result__caption { display: block; margin-top: 4px; color: #71809a; font-size: 13px; line-height: 1.45; }
        .placement-result__strengths {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin: 0 0 25px;
          padding: 0;
          list-style: none;
        }
        .placement-result__strengths li {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          border: 1px solid #dce9f3;
          border-radius: 14px;
          padding: 10px;
          color: #586b85;
          text-align: left;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.35;
          background: #f9fcff;
        }
        .placement-result__strengths span { color: #4ebb77; font-size: 14px; }
        .placement-result__actions { display: grid; gap: 14px; }
        .placement-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 50px;
          border: 0;
          border-bottom: 4px solid #42a32e;
          border-radius: 16px;
          padding: 12px 18px;
          cursor: pointer;
          color: #fff;
          background: linear-gradient(180deg, #72df2b, #58c909);
          box-shadow: 0 10px 21px rgba(73, 190, 23, 0.22);
          font: 900 15px/1 ui-rounded, "Avenir Next", "Nunito", system-ui, sans-serif;
          transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
        }
        .placement-button:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 14px 24px rgba(73, 190, 23, 0.28); }
        .placement-button:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
        .placement-button:disabled,
        .placement-text-button:disabled { cursor: wait; opacity: .64; }
        .placement-result__secondary-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .placement-text-button { border: 0; padding: 3px; cursor: pointer; color: #557ba3; background: transparent; font-size: 12px; font-weight: 850; text-decoration: underline; text-underline-offset: 3px; }
        .placement-text-button:hover:not(:disabled) { color: #177ba8; }
        .placement-button:focus-visible,
        .placement-text-button:focus-visible { outline: 3px solid #40c4f5; outline-offset: 3px; }
        @media (max-width: 560px) {
          .placement-result { border-radius: 24px; }
          .placement-result__score { grid-template-columns: 88px minmax(0, 1fr); gap: 12px; padding: 12px; }
          .placement-result__score-ring { width: 82px; height: 82px; }
          .placement-result__score-ring > div { width: 65px; height: 65px; }
          .placement-result__strengths { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .placement-result { transition: none !important; }
        }
      `}</style>
    </motion.section>
  );
}
