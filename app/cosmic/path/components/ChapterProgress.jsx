"use client";

import { motion } from "framer-motion";

/**
 * Presentational progress meter for a chapter. The parent owns all mastery
 * calculations and passes the final percentage in.
 */
export default function ChapterProgress({
  value = 0,
  label = "Chapter progress",
  detail,
  size = "regular",
  showValue = true,
  className = "",
}) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  const compact = size === "compact";

  return <div className={`chapter-progress chapter-progress--${compact ? "compact" : "regular"} ${className}`.trim()}>
    <div className="chapter-progress__labels">
      <span>{label}</span>
      {showValue ? <strong>{progress}%</strong> : null}
    </div>
    <div
      className="chapter-progress__track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <motion.span
        className="chapter-progress__fill"
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.52, ease: [0.22, 0.76, 0.24, 1] }}
      />
    </div>
    {detail ? <small>{detail}</small> : null}
    <style jsx>{`
      .chapter-progress { min-width: 0; color: #5d6f8d; }
      .chapter-progress__labels { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 7px; font-size: 0.72rem; font-weight: 850; letter-spacing: .01em; }
      .chapter-progress__labels strong { color: #176f8e; font-family: var(--cd-font-number, ui-monospace, monospace); font-size: .78rem; }
      .chapter-progress__track { height: 11px; overflow: hidden; border: 1px solid rgba(70, 101, 143, .13); border-radius: 999px; background: #e8eef7; box-shadow: inset 0 1px 2px rgba(16, 43, 76, .1); }
      .chapter-progress__fill { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #58cc02, #70d9dd 58%, #71bbf5); box-shadow: 0 0 13px rgba(77, 204, 194, .48); }
      .chapter-progress small { display: block; margin-top: 6px; color: #7787a1; font-size: .68rem; line-height: 1.35; }
      .chapter-progress--compact .chapter-progress__labels { margin-bottom: 5px; font-size: .66rem; }
      .chapter-progress--compact .chapter-progress__track { height: 8px; }
    `}</style>
  </div>;
}
