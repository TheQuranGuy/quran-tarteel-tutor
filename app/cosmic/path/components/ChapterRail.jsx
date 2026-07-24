"use client";

import { motion } from "framer-motion";
import ChapterCard from "./ChapterCard";

/**
 * A responsive, diagonal progression rail. It intentionally contains no
 * placement, unlock, storage, XP or routing logic: provide those through data
 * and callbacks from the path page.
 */
export default function ChapterRail({
  chapters = [],
  activeChapterId,
  onSelectChapter,
  renderChapter,
  title = "Your learning route",
  subtitle = "Start small, build confidence, then travel deeper.",
  children,
  className = "",
}) {
  const hasChapters = Array.isArray(chapters) && chapters.length > 0;

  return <section className={`chapter-rail ${className}`.trim()} aria-label={title}>
    <header className="chapter-rail__header">
      <span className="chapter-rail__eyebrow">CHAPTER JOURNEY</span>
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </header>

    <div className="chapter-rail__track">
      <span className="chapter-rail__line" aria-hidden="true" />
      {hasChapters ? chapters.map((chapter, index) => {
        const chapterId = chapter.id ?? index;
        const status = chapter.status || (chapterId === activeChapterId ? "current" : "unlocked");
        const side = index % 2 === 0 ? "left" : "right";
        const select = () => onSelectChapter?.(chapter, index);
        return <motion.div
          key={chapterId}
          className={`chapter-rail__node chapter-rail__node--${side}`}
          initial={{ opacity: 0, x: side === "left" ? -24 : 24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: Math.min(index * 0.045, 0.4), duration: 0.38, ease: [0.22, 0.76, 0.24, 1] }}
        >
          <span className={`chapter-rail__waypoint chapter-rail__waypoint--${status}`} aria-hidden="true">{status === "completed" ? "✦" : status === "locked" ? "•" : index + 1}</span>
          {renderChapter
            ? renderChapter({ chapter, index, status, isActive: chapterId === activeChapterId, onSelect: select })
            : <ChapterCard chapter={chapter} index={index + 1} status={status} progress={chapter.progress ?? 0} onClick={status === "locked" ? undefined : select} />}
        </motion.div>;
      }) : children}
    </div>
    <style jsx>{`
      .chapter-rail { position: relative; width: min(100%, 1000px); margin-inline: auto; color: #eff7ff; }
      .chapter-rail__header { display: grid; gap: 8px; max-width: 600px; margin: 0 0 28px; }
      .chapter-rail__eyebrow { color: #91f1d2; font-size: .67rem; font-weight: 950; letter-spacing: .16em; }
      h1 { margin: 0; color: #fff; font-family: ui-rounded, var(--cd-font-display, sans-serif); font-size: clamp(1.9rem, 5vw, 3.5rem); line-height: .98; letter-spacing: -.06em; }
      p { max-width: 510px; margin: 8px 0 0; color: #bdd0e9; font-size: .9rem; line-height: 1.52; }
      .chapter-rail__track { position: relative; display: grid; gap: 32px; padding: 9px 0 24px; }
      .chapter-rail__line { position: absolute; top: 0; bottom: 0; left: 50%; width: 7px; border-radius: 999px; background: linear-gradient(180deg, rgba(124,242,222,0), #8ff1c7 7%, #9e99ff 49%, #8fdcff 92%, rgba(124,242,222,0)); box-shadow: 0 0 22px rgba(143,220,255,.52); transform: translateX(-50%); }
      .chapter-rail__line::after { position: absolute; inset: 4% -5px; content: ""; border-radius: inherit; background: linear-gradient(180deg, transparent, rgba(255,255,255,.85), transparent); background-size: 100% 52px; opacity: .55; animation: chapter-rail-flow 3.2s linear infinite; }
      .chapter-rail__node { position: relative; z-index: 1; display: flex; width: calc(50% - 35px); }
      .chapter-rail__node--left { justify-content: flex-end; margin-right: auto; }
      .chapter-rail__node--right { justify-content: flex-start; margin-left: auto; }
      .chapter-rail__waypoint { position: absolute; top: 50%; z-index: 2; display: grid; width: 33px; height: 33px; place-items: center; border: 3px solid #f5fbff; border-radius: 50%; color: #1a3150; background: #9ef1dc; box-shadow: 0 0 0 5px rgba(91,220,202,.15), 0 6px 12px rgba(2,12,37,.2); font-family: var(--cd-font-number, monospace); font-size: .69rem; font-weight: 950; transform: translateY(-50%); }
      .chapter-rail__node--left .chapter-rail__waypoint { right: -51px; }
      .chapter-rail__node--right .chapter-rail__waypoint { left: -51px; }
      .chapter-rail__waypoint--current { color: #fff; background: #58cc02; box-shadow: 0 0 0 6px rgba(102,229,47,.18), 0 0 24px rgba(105,224,53,.76); animation: chapter-waypoint-pulse 2.1s ease-in-out infinite; }
      .chapter-rail__waypoint--completed { color: #80550a; background: #ffdd70; box-shadow: 0 0 0 5px rgba(255,211,86,.15), 0 0 19px rgba(255,209,78,.6); }
      .chapter-rail__waypoint--locked { color: #68778d; background: #b8c4d3; box-shadow: 0 0 0 5px rgba(178,195,213,.11); }
      @keyframes chapter-rail-flow { from { background-position: 0 -52px; } to { background-position: 0 52px; } }
      @keyframes chapter-waypoint-pulse { 0%,100% { box-shadow: 0 0 0 6px rgba(102,229,47,.15), 0 0 17px rgba(105,224,53,.58); } 50% { box-shadow: 0 0 0 10px rgba(102,229,47,.04), 0 0 27px rgba(105,224,53,.82); } }
      @media (max-width: 720px) { .chapter-rail__header { margin-bottom: 22px; } .chapter-rail__track { gap: 24px; padding-left: 47px; } .chapter-rail__line { left: 17px; } .chapter-rail__node, .chapter-rail__node--left, .chapter-rail__node--right { width: 100%; margin: 0; } .chapter-rail__waypoint, .chapter-rail__node--left .chapter-rail__waypoint, .chapter-rail__node--right .chapter-rail__waypoint { top: 32px; left: 0; right: auto; transform: translate(-50%, 0); } }
      @media (prefers-reduced-motion: reduce) { .chapter-rail__line::after, .chapter-rail__waypoint--current { animation: none; } }
    `}</style>
  </section>;
}
