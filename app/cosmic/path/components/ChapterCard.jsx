"use client";

import { motion } from "framer-motion";
import ChapterProgress from "./ChapterProgress";

const STATUS_COPY = {
  locked: "Locked",
  unlocked: "Ready",
  current: "Continue",
  completed: "Mastered",
};

/**
 * A single, fully presentational chapter node. The caller supplies the status,
 * progress and click behaviour; this component never decides what is unlocked.
 */
export default function ChapterCard({
  chapter = {},
  status = "unlocked",
  progress = 0,
  onClick,
  className = "",
  index,
  compact = false,
}) {
  const locked = status === "locked";
  const completed = status === "completed";
  const current = status === "current";
  const title = chapter.title || chapter.name || "Chapter";
  const number = chapter.number ?? index ?? "";
  const theme = chapter.theme || chapter.description || "Build your Qur'an learning foundation.";
  const missionCount = chapter.missionCount ?? chapter.ayahCount;
  const completedCount = chapter.completedCount ?? chapter.missionsCompleted;
  const interactionProps = onClick && !locked ? { onClick } : {};
  const accessibleLabel = `${title}. ${STATUS_COPY[status] || STATUS_COPY.unlocked}. ${progress}% complete.`;

  const content = <>
    <span className="chapter-card__orbit chapter-card__orbit--outer" aria-hidden="true" />
    <span className="chapter-card__orbit chapter-card__orbit--inner" aria-hidden="true" />
    <div className="chapter-card__topline">
      <span className="chapter-card__number">{number === "" ? "CHAPTER" : `CHAPTER ${number}`}</span>
      <span className="chapter-card__state">
        <span aria-hidden="true">{locked ? "🔒" : completed ? "✦" : current ? "▶" : "◌"}</span>
        {STATUS_COPY[status] || STATUS_COPY.unlocked}
      </span>
    </div>
    <div className="chapter-card__main">
      <span className="chapter-card__icon" aria-hidden="true">{chapter.icon || (completed ? "✦" : locked ? "◒" : "◉")}</span>
      <div>
        <h2>{title}</h2>
        <p>{theme}</p>
      </div>
    </div>
    {!compact ? <div className="chapter-card__footer">
      <ChapterProgress
        value={progress}
        label={completed ? "Mastery" : "Chapter progress"}
        detail={missionCount !== undefined ? `${completedCount || 0} of ${missionCount} lessons complete` : undefined}
        size="compact"
      />
      <span className="chapter-card__arrow" aria-hidden="true">›</span>
    </div> : null}
  </>;

  const styles = <style jsx global>{`
    .chapter-card { position: relative; display: block; width: min(100%, 520px); overflow: hidden; isolation: isolate; border: 2px solid rgba(255, 255, 255, .88); border-bottom: 5px solid #bad1e9; border-radius: 26px; padding: 17px 18px 15px; color: #203653; background: linear-gradient(135deg, rgba(255,255,255,.99), rgba(235,245,255,.97)); box-shadow: 0 17px 34px rgba(2, 15, 48, .22), inset 0 2px rgba(255,255,255,.96); text-align: left; transition: transform 180ms cubic-bezier(.2,.8,.25,1), box-shadow 180ms ease, filter 180ms ease; }
    button.chapter-card { cursor: pointer; font: inherit; }
    .chapter-card::before { position: absolute; inset: 0; z-index: -1; content: ""; opacity: .82; background: linear-gradient(118deg, rgba(102, 222, 240, .15), transparent 34%, transparent 70%, rgba(164, 116, 255, .15)); }
    .chapter-card::after { position: absolute; top: -72px; right: -70px; z-index: -1; width: 190px; height: 190px; content: ""; border-radius: 50%; background: radial-gradient(circle, rgba(143, 232, 255, .52), rgba(143, 232, 255, .05) 58%, transparent 70%); }
    .chapter-card__topline, .chapter-card__main, .chapter-card__footer { position: relative; z-index: 1; }
    .chapter-card__topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .chapter-card__number { color: #5880a8; font-size: .65rem; font-weight: 950; letter-spacing: .14em; }
    .chapter-card__state { display: inline-flex; align-items: center; gap: 5px; min-height: 27px; border: 1px solid #cde3f7; border-radius: 999px; padding: 4px 8px; color: #297598; background: #eaf9ff; font-size: .67rem; font-weight: 900; }
    .chapter-card__main { display: grid; grid-template-columns: 61px minmax(0, 1fr); align-items: center; gap: 13px; margin: 12px 0 14px; }
    .chapter-card__icon { display: grid; width: 59px; height: 59px; place-items: center; border: 2px solid rgba(255,255,255,.9); border-bottom: 4px solid #77b9dc; border-radius: 20px; color: #fff; background: linear-gradient(145deg, #58d7e2, #6b9df2 62%, #8c7df3); box-shadow: 0 8px 15px rgba(61, 132, 190, .23), inset 0 1px rgba(255,255,255,.55); font-size: 1.45rem; }
    .chapter-card h2 { margin: 0; color: #1e3350; font-family: ui-rounded, var(--cd-font-display, sans-serif); font-size: clamp(1.05rem, 2.2vw, 1.35rem); line-height: 1; letter-spacing: -.045em; }
    .chapter-card p { display: -webkit-box; margin: 5px 0 0; overflow: hidden; color: #637896; font-size: .78rem; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
    .chapter-card__footer { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 13px; padding-top: 12px; border-top: 1px solid #dce8f4; }
    .chapter-card__arrow { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 11px; color: #fff; background: #58cc02; box-shadow: 0 3px 0 #3f9f02; font-size: 1.48rem; font-weight: 900; line-height: 1; }
    .chapter-card__orbit { position: absolute; z-index: -1; border: 1px solid rgba(78, 167, 219, .17); border-radius: 50%; pointer-events: none; }
    .chapter-card__orbit--outer { right: -72px; bottom: -104px; width: 235px; height: 139px; rotate: -24deg; }
    .chapter-card__orbit--inner { right: -35px; bottom: -76px; width: 145px; height: 87px; border-color: rgba(146, 108, 244, .2); rotate: -24deg; }
    .chapter-card--current { border-color: #a1ebd3; border-bottom-color: #49aa8d; background: linear-gradient(135deg, #fff, #eafff4 58%, #effaff); box-shadow: 0 19px 40px rgba(46, 199, 146, .24), 0 0 0 5px rgba(102, 242, 190, .11); }
    .chapter-card--current .chapter-card__state { color: #1e755d; background: #dfffee; border-color: #a6efd0; }
    .chapter-card--current .chapter-card__icon { background: linear-gradient(145deg, #72df17, #40c995 64%, #59bdeb); border-bottom-color: #329b75; }
    .chapter-card--completed { border-color: #f4d785; border-bottom-color: #c99b34; background: linear-gradient(135deg, #fffef4, #fff7d7 58%, #edfaff); box-shadow: 0 18px 40px rgba(231, 185, 61, .22), 0 0 0 4px rgba(255, 225, 136, .12); }
    .chapter-card--completed .chapter-card__state { color: #8a6317; background: #fff5c9; border-color: #f3dc8b; }
    .chapter-card--completed .chapter-card__icon { color: #7f5708; background: linear-gradient(145deg, #fff3aa, #ffc958 66%, #efaa3d); border-bottom-color: #c48e21; }
    .chapter-card--locked { border-color: #cbd6e5; border-bottom-color: #a8b6c9; color: #8290a4; background: linear-gradient(135deg, #f5f7fa, #e6ecf3); box-shadow: 0 11px 22px rgba(13, 28, 55, .12); filter: grayscale(.35); }
    .chapter-card--locked::before { opacity: .32; }
    .chapter-card--locked h2 { color: #66758a; }
    .chapter-card--locked p { color: #8490a1; }
    .chapter-card--locked .chapter-card__icon { color: #77879c; background: linear-gradient(145deg, #e8edf4, #bdc9d8); border-bottom-color: #9daec0; box-shadow: none; }
    .chapter-card--locked .chapter-card__state { color: #748399; background: #eff2f6; border-color: #d5dde8; }
    .chapter-card--locked .chapter-card__arrow { color: #8392a5; background: #e4eaf1; box-shadow: 0 3px 0 #b6c1cf; }
    .chapter-card--compact { padding-bottom: 15px; }
    @media (hover: hover) { button.chapter-card:not(.chapter-card--locked):hover { transform: translateY(-5px) rotate(-.2deg); box-shadow: 0 24px 43px rgba(2,15,48,.26), 0 0 0 5px rgba(129,226,243,.13); } button.chapter-card--current:hover { box-shadow: 0 25px 47px rgba(42,191,140,.3), 0 0 0 6px rgba(102,242,190,.14); } }
    button.chapter-card:active { transform: translateY(2px) scale(.992); border-bottom-width: 3px; }
    button.chapter-card:focus-visible { outline: 3px solid #347cab; outline-offset: 4px; }
    @media (max-width: 520px) { .chapter-card { border-radius: 22px; padding: 15px 14px 13px; } .chapter-card__main { grid-template-columns: 53px minmax(0, 1fr); gap: 11px; } .chapter-card__icon { width: 51px; height: 51px; border-radius: 17px; } .chapter-card__number { font-size: .58rem; } }
    @media (prefers-reduced-motion: reduce) { .chapter-card { transition: none; } }
  `}</style>;

  if (onClick && !locked) {
    return <motion.button
      type="button"
      className={`chapter-card chapter-card--${status} ${compact ? "chapter-card--compact" : ""} ${className}`.trim()}
      aria-label={accessibleLabel}
      whileTap={{ scale: 0.985 }}
      {...interactionProps}
    >{content}{styles}</motion.button>;
  }

  return <article
    className={`chapter-card chapter-card--${status} ${compact ? "chapter-card--compact" : ""} ${className}`.trim()}
    aria-label={accessibleLabel}
    aria-disabled={locked || undefined}
  >{content}{styles}</article>;
}
