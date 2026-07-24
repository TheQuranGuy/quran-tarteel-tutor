"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * A deliberately small first step for learners who are new to the adaptive
 * path. It is presentational: routing and placement persistence stay in the
 * parent page and existing learning systems continue to own progress.
 */
export default function BeginnerStartCard({ onTakePlacement }) {
  return <motion.section
    className="beginner-start-card"
    aria-labelledby="beginner-start-title"
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.38, ease: [0.22, 0.76, 0.24, 1] }}
  >
    <div className="beginner-start-card__halo" aria-hidden="true" />
    <div className="beginner-start-card__header">
      <span className="beginner-start-card__orb" aria-hidden="true">1</span>
      <div>
        <p>START HERE</p>
        <h2 id="beginner-start-title">Begin with Al-Fatiha.</h2>
        <span>One familiar surah. One ayah at a time. No rush.</span>
      </div>
    </div>

    <div className="beginner-start-card__goal">
      <strong>Your first gentle goal</strong>
      <span>Spend a few calm minutes with Ayah 1: listen, read, then repeat.</span>
    </div>

    <ol className="beginner-start-card__steps" aria-label="Your first Al-Fatiha lesson steps">
      <li><span>1</span><div><strong>Listen</strong><small>Hear the ayah at a comfortable pace.</small></div></li>
      <li><span>2</span><div><strong>Read</strong><small>Follow the Arabic and its meaning.</small></div></li>
      <li><span>3</span><div><strong>Repeat</strong><small>Try it once more when you feel ready.</small></div></li>
    </ol>

    <div className="beginner-start-card__actions">
      <Link href="/cosmic/path/1">Start Al-Fatiha <span aria-hidden="true">→</span></Link>
      {onTakePlacement ? <button type="button" onClick={onTakePlacement}>I already know some Qur&apos;an</button> : null}
    </div>

    <style jsx global>{`
      .beginner-start-card { position: relative; overflow: hidden; isolation: isolate; margin-bottom: 25px; border: 2px solid rgba(255,255,255,.9); border-bottom: 5px solid #4aa482; border-radius: 28px; padding: clamp(18px, 3vw, 25px); color: #24435e; background: linear-gradient(135deg, #f6fffb, #e5fff4 48%, #edf9ff); box-shadow: 0 20px 42px rgba(1,16,43,.23), inset 0 2px rgba(255,255,255,.96); }
      .beginner-start-card__halo { position: absolute; z-index: -1; top: -122px; right: -74px; width: 295px; height: 295px; border-radius: 50%; background: radial-gradient(circle, rgba(126,242,195,.55), rgba(113,208,255,.16) 49%, transparent 71%); pointer-events: none; }
      .beginner-start-card__header { display: grid; grid-template-columns: 60px minmax(0, 1fr); gap: 14px; align-items: center; }
      .beginner-start-card__orb { display: grid; width: 58px; height: 58px; place-items: center; border: 2px solid rgba(255,255,255,.9); border-bottom: 4px solid #2d967b; border-radius: 20px; color: #fff; background: linear-gradient(145deg, #71df18, #40c9a1 63%, #55b9ed); box-shadow: 0 9px 17px rgba(38,150,119,.24); font-family: var(--cd-font-number, ui-monospace, monospace); font-size: 1.35rem; font-weight: 950; }
      .beginner-start-card__header p { margin: 0 0 4px; color: #298978; font-size: .64rem; font-weight: 950; letter-spacing: .15em; }
      .beginner-start-card h2 { margin: 0; color: #1e3953; font-family: ui-rounded, var(--cd-font-display, sans-serif); font-size: clamp(1.35rem, 3vw, 1.95rem); line-height: 1; letter-spacing: -.052em; }
      .beginner-start-card__header > div > span { display: block; margin-top: 6px; color: #658198; font-size: .8rem; font-weight: 700; }
      .beginner-start-card__goal { display: grid; gap: 4px; margin-top: 18px; border: 1px solid rgba(66,162,136,.2); border-radius: 16px; padding: 12px 13px; background: rgba(255,255,255,.71); }
      .beginner-start-card__goal strong { color: #286253; font-size: .78rem; }
      .beginner-start-card__goal span { color: #607b92; font-size: .76rem; line-height: 1.42; }
      .beginner-start-card__steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 15px 0 18px; padding: 0; list-style: none; }
      .beginner-start-card__steps li { display: grid; grid-template-columns: 25px minmax(0, 1fr); gap: 7px; align-items: start; border-top: 1px solid rgba(51,143,129,.16); padding: 10px 4px 0; }
      .beginner-start-card__steps li > span { display: grid; width: 23px; height: 23px; place-items: center; border-radius: 8px; color: #fff; background: #4aa88c; font-family: var(--cd-font-number, ui-monospace, monospace); font-size: .66rem; font-weight: 950; }
      .beginner-start-card__steps strong { display: block; color: #304e68; font-size: .72rem; }
      .beginner-start-card__steps small { display: block; margin-top: 3px; color: #718799; font-size: .68rem; line-height: 1.35; }
      .beginner-start-card__actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
      .beginner-start-card__actions a, .beginner-start-card__actions button { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; gap: 7px; border: 0; border-radius: 13px; padding: 9px 13px; cursor: pointer; font: 900 .75rem/1 ui-rounded, var(--cd-font-display, sans-serif); text-decoration: none; }
      .beginner-start-card__actions a { border-bottom: 4px solid #3e9800; color: #fff; background: linear-gradient(180deg, #71e11b, #58cc02); box-shadow: 0 8px 15px rgba(70,179,13,.22); }
      .beginner-start-card__actions a span { font-size: 1.05rem; }
      .beginner-start-card__actions button { border: 1px solid #c7dce9; border-bottom: 3px solid #abc8da; color: #3d708d; background: rgba(255,255,255,.82); }
      @media (hover: hover) { .beginner-start-card__actions a:hover, .beginner-start-card__actions button:hover { transform: translateY(-2px); filter: brightness(1.03); } }
      .beginner-start-card__actions a:active, .beginner-start-card__actions button:active { transform: translateY(2px); }
      .beginner-start-card__actions a:focus-visible, .beginner-start-card__actions button:focus-visible { outline: 3px solid #2f7ca3; outline-offset: 3px; }
      @media (max-width: 650px) { .beginner-start-card { border-radius: 23px; padding: 16px; } .beginner-start-card__steps { grid-template-columns: 1fr; gap: 3px; } .beginner-start-card__steps li { border: 0; padding-top: 6px; } }
      @media (max-width: 420px) { .beginner-start-card__actions { display: grid; grid-template-columns: 1fr; } .beginner-start-card__actions a, .beginner-start-card__actions button { width: 100%; } }
      @media (prefers-reduced-motion: reduce) { .beginner-start-card__actions a, .beginner-start-card__actions button { transition: none; } }
    `}</style>
  </motion.section>;
}
