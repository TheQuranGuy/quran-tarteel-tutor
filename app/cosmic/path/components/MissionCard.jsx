"use client";

import { motion } from "framer-motion";

const TYPE_ICON = {
  listen: "◖",
  read: "Aa",
  memorise: "✦",
  memorize: "✦",
  meaning: "?",
  quiz: "?",
  review: "↻",
  recite: "◉",
};

/**
 * The next actionable lesson inside a chapter. It accepts all state as props,
 * which keeps adaptive placement and reward logic outside the UI layer.
 */
export default function MissionCard({
  mission = {},
  onStart,
  className = "",
  state = "current",
  chapterLabel,
  actionLabel,
}) {
  const locked = state === "locked" || mission.locked;
  const complete = state === "completed" || mission.completed;
  const title = mission.title || "Your next mission";
  const description = mission.description || mission.subtitle || "A focused step toward confident Qur'an learning.";
  const kind = mission.kind || mission.type || "listen";
  const icon = mission.icon || TYPE_ICON[String(kind).toLowerCase()] || "✦";
  const ayahLabel = mission.ayahLabel || mission.ayah || mission.label;
  const action = actionLabel || (complete ? "Practise again" : locked ? "Locked" : "Start mission");
  const reward = mission.reward ?? mission.xp;
  const duration = mission.duration;

  return <motion.article
    className={`mission-card mission-card--${locked ? "locked" : complete ? "completed" : "current"} ${className}`.trim()}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.36, ease: [0.22, 0.76, 0.24, 1] }}
  >
    <div className="mission-card__shine" aria-hidden="true" />
    <div className="mission-card__eyebrow">
      <span>{chapterLabel || "NEXT ON YOUR PATH"}</span>
      <span className="mission-card__status">{locked ? "LOCKED" : complete ? "COMPLETE" : "READY"}</span>
    </div>
    <div className="mission-card__body">
      <span className="mission-card__icon" aria-hidden="true">{icon}</span>
      <div className="mission-card__copy">
        {ayahLabel ? <small>{ayahLabel}</small> : null}
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="mission-card__meta">
          {duration ? <span>◷ {duration}</span> : null}
          {reward !== undefined ? <span>✦ +{reward} XP</span> : null}
          {mission.badge ? <span>{mission.badge}</span> : null}
        </div>
      </div>
    </div>
    <div className="mission-card__footer">
      <span className="mission-card__hint">{complete ? "Keep the rhythm going." : locked ? "Complete the previous step first." : "A small win is waiting for you."}</span>
      {onStart && !locked ? <motion.button type="button" onClick={onStart} whileTap={{ scale: 0.97 }}>{action}<span aria-hidden="true">›</span></motion.button> : <span className="mission-card__locked-label">{action}</span>}
    </div>
    <style jsx global>{`
      .mission-card { position: relative; overflow: hidden; isolation: isolate; border: 2px solid rgba(255,255,255,.86); border-bottom: 5px solid #359a90; border-radius: 26px; padding: 18px; color: #193551; background: linear-gradient(135deg, #efffff, #ddf7f0 55%, #edf5ff); box-shadow: 0 20px 45px rgba(5, 42, 71, .23), inset 0 2px rgba(255,255,255,.96); }
      .mission-card__shine { position: absolute; z-index: -1; top: -140px; right: -78px; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(134, 243, 212, .65), rgba(158, 210, 255, .18) 49%, transparent 70%); pointer-events: none; }
      .mission-card__eyebrow { display: flex; align-items: center; justify-content: space-between; gap: 11px; color: #2b8e92; font-size: .64rem; font-weight: 950; letter-spacing: .14em; }
      .mission-card__status { border: 1px solid rgba(43, 153, 143, .24); border-radius: 999px; padding: 5px 7px; color: #16756f; background: rgba(255,255,255,.58); letter-spacing: .08em; }
      .mission-card__body { display: grid; grid-template-columns: 66px minmax(0,1fr); gap: 13px; align-items: center; margin: 15px 0; }
      .mission-card__icon { display: grid; width: 63px; height: 63px; place-items: center; border: 2px solid rgba(255,255,255,.92); border-bottom: 4px solid #238d8a; border-radius: 21px; color: #fff; background: linear-gradient(145deg, #70df19, #43c9a2 63%, #55b5ee); box-shadow: 0 9px 16px rgba(44, 170, 151, .24), inset 0 1px rgba(255,255,255,.58); font-size: 1.55rem; font-weight: 950; }
      .mission-card__copy small { display: block; margin-bottom: 3px; color: #4a8093; font-size: .68rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .mission-card h2 { margin: 0; color: #1d3954; font-family: ui-rounded, var(--cd-font-display, sans-serif); font-size: clamp(1.12rem, 2.5vw, 1.48rem); line-height: 1.02; letter-spacing: -.045em; }
      .mission-card p { margin: 5px 0 0; color: #5a7890; font-size: .79rem; line-height: 1.42; }
      .mission-card__meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
      .mission-card__meta span { border: 1px solid rgba(63, 142, 166, .16); border-radius: 999px; padding: 4px 7px; color: #41758c; background: rgba(255,255,255,.65); font-size: .65rem; font-weight: 850; }
      .mission-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 13px; border-top: 1px solid rgba(38, 139, 145, .17); }
      .mission-card__hint { color: #4b7e83; font-size: .7rem; font-weight: 750; line-height: 1.35; }
      .mission-card button { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 6px; min-height: 40px; border: 0; border-bottom: 4px solid #419800; border-radius: 13px; padding: 8px 12px; color: #fff; background: linear-gradient(180deg, #6be01a, #58cc02); box-shadow: 0 9px 18px rgba(74, 178, 15, .22); cursor: pointer; font: 900 .75rem/1 ui-rounded, var(--cd-font-display, sans-serif); letter-spacing: .01em; }
      .mission-card button span { font-size: 1.25rem; line-height: .6; }
      .mission-card__locked-label { flex: 0 0 auto; border: 1px solid #d0d9e5; border-radius: 13px; padding: 10px 12px; color: #7b899e; background: #edf1f6; font-size: .72rem; font-weight: 900; }
      .mission-card--completed { border-bottom-color: #bd8e2d; background: linear-gradient(135deg, #fffdf0, #fff4c9 54%, #eef8ff); }
      .mission-card--completed .mission-card__shine { background: radial-gradient(circle, rgba(255, 221, 100, .55), rgba(255, 220, 147, .16) 49%, transparent 70%); }
      .mission-card--completed .mission-card__eyebrow { color: #957123; }
      .mission-card--completed .mission-card__status { color: #816017; border-color: #f0d78f; }
      .mission-card--completed .mission-card__icon { color: #855f10; background: linear-gradient(145deg, #fff1a1, #ffcc5a 66%, #eaa33c); border-bottom-color: #c88e22; }
      .mission-card--locked { border-color: #d2dbe6; border-bottom-color: #acbacb; color: #728095; background: linear-gradient(135deg, #f5f7fa, #e7edf4); box-shadow: 0 14px 28px rgba(5,25,50,.12); filter: grayscale(.45); }
      .mission-card--locked .mission-card__shine { opacity: .25; }
      .mission-card--locked .mission-card__eyebrow, .mission-card--locked .mission-card__copy small { color: #77869a; }
      .mission-card--locked .mission-card__status { color: #758399; border-color: #d4dde7; background: #eef2f6; }
      .mission-card--locked h2 { color: #64748a; }
      .mission-card--locked p, .mission-card--locked .mission-card__hint { color: #8090a4; }
      .mission-card--locked .mission-card__icon { color: #77869a; background: linear-gradient(145deg,#e8edf3,#c5cfdb); border-bottom-color: #a9b7c7; box-shadow: none; }
      @media (hover: hover) { .mission-card button:hover { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 12px 20px rgba(74,178,15,.28); } }
      .mission-card button:active { transform: translateY(2px); border-bottom-width: 2px; }
      .mission-card button:focus-visible { outline: 3px solid #266f9c; outline-offset: 3px; }
      @media (max-width: 470px) { .mission-card { border-radius: 22px; padding: 15px; } .mission-card__body { grid-template-columns: 53px minmax(0,1fr); gap: 11px; margin: 12px 0; } .mission-card__icon { width: 51px; height: 51px; border-radius: 17px; } .mission-card__footer { align-items: flex-start; flex-direction: column; } .mission-card__footer button, .mission-card__locked-label { width: 100%; justify-content: center; } }
      @media (prefers-reduced-motion: reduce) { .mission-card button { transition: none; } }
    `}</style>
  </motion.article>;
}
