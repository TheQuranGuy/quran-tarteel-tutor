"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COSMIC_UNITS, getCosmicProgress, getSurahWorldStyle } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import StoryHeader from "./components/StoryHeader";
import StoryChapterRail from "./components/StoryChapterRail";
import StoryProgress from "./components/StoryProgress";
import MemoryFragment from "./components/MemoryFragment";
import StoryLorePanel from "./components/StoryLorePanel";

const FRAGMENTS_PER_PAGE = 18;

export default function CosmicStoryPage() {
  const user = useCosmicUser();
  const reduceMotion = useReducedMotion();
  const [chapterId, setChapterId] = useState(1);
  const [fragmentPage, setFragmentPage] = useState(0);

  const progressByChapter = useMemo(
    () => new Map(COSMIC_UNITS.map((unit) => [unit.id, getCosmicProgress(user, unit)])),
    [user],
  );
  const chapter = COSMIC_UNITS.find((unit) => unit.id === chapterId) || COSMIC_UNITS[0];
  const progress = progressByChapter.get(chapter.id) || { complete: 0, total: chapter.ayahCount, percent: 0 };
  const pageCount = Math.max(1, Math.ceil(chapter.ayahs.length / FRAGMENTS_PER_PAGE));
  const safePage = Math.min(fragmentPage, pageCount - 1);
  const fragments = chapter.ayahs.slice(safePage * FRAGMENTS_PER_PAGE, (safePage + 1) * FRAGMENTS_PER_PAGE);
  const mastered = useMemo(() => new Set(user.ayahsMastered || []), [user.ayahsMastered]);
  const weak = useMemo(() => new Set(user.weakAyahs || []), [user.weakAyahs]);
  const completedChapters = useMemo(
    () => Array.from(progressByChapter.values()).filter((item) => item.percent === 100).length,
    [progressByChapter],
  );
  const world = getSurahWorldStyle(chapter);

  function chooseChapter(id) {
    setChapterId(id);
    setFragmentPage(0);
  }

  return (
    <main
      className="cosmic-dark cd-story-v2"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 64px)",
        overflow: "hidden",
        padding: "42px 16px 94px",
        background: world.background,
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.62, background: "linear-gradient(180deg,rgba(3,5,25,.2),rgba(3,5,25,.74))", pointerEvents: "none" }} />
      <StarParticles count={58} color={world.accent} />
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="cd-story-shell"
        style={{ position: "relative", width: "min(1160px, 100%)", margin: "0 auto", display: "grid", gap: 18 }}
      >
        <StoryHeader
          completedChapters={completedChapters}
          xp={user.xp || 0}
          streak={user.streak || 0}
          dailyGoal={user.dailyGoal || 10}
        />
        <StoryChapterRail
          chapters={COSMIC_UNITS}
          selectedId={chapter.id}
          progressByChapter={progressByChapter}
          onSelect={chooseChapter}
        />
        <section className="cd-story-stage" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,310px),1fr))", gap: 18, alignItems: "start" }}>
          <div className="cosmic-bright-card cd-story-fragments" style={{ padding: "clamp(18px,3vw,30px)", borderRadius: 28, overflow: "hidden" }}>
            <StoryProgress chapter={chapter} progress={progress} accent={world.accent} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", margin: "18px 0 14px" }}>
              <p style={{ margin: 0, color: "#cbd9ee", fontSize: 13 }}>Each fragment opens the existing lesson engine with the real ayah data.</p>
              {pageCount > 1 ? (
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <button type="button" className="cosmic-button cosmic-button--outline" style={{ padding: "8px 11px", fontSize: 12 }} disabled={safePage === 0} onClick={() => setFragmentPage((current) => Math.max(0, current - 1))}>Previous</button>
                  <span style={{ color: "#b9cbe4", fontSize: 12, fontWeight: 800 }}>Orbit {safePage + 1} / {pageCount}</span>
                  <button type="button" className="cosmic-button cosmic-button--outline" style={{ padding: "8px 11px", fontSize: 12 }} disabled={safePage === pageCount - 1} onClick={() => setFragmentPage((current) => Math.min(pageCount - 1, current + 1))}>Next</button>
                </div>
              ) : null}
            </div>
            <div className="cd-story-fragment-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(132px,1fr))", gap: 12 }}>
              <div aria-hidden="true" style={{ position: "absolute", left: "4%", right: "4%", top: "50%", height: 1, background: `linear-gradient(90deg,transparent,${world.accent},transparent)`, opacity: 0.38 }} />
              {fragments.map((ayah, index) => (
                <MemoryFragment
                  key={ayah.id}
                  ayah={ayah}
                  index={index}
                  accent={world.accent}
                  mastered={mastered.has(ayah.id)}
                  weak={weak.has(ayah.id)}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
          <StoryLorePanel chapter={chapter} progress={progress} accent={world.accent} />
        </section>
      </motion.section><style jsx global>{`
        .cd-story-v2{isolation:isolate;background:radial-gradient(circle at 50% -8%,rgba(124,104,252,.29),transparent 31%),radial-gradient(circle at 94% 74%,rgba(255,124,206,.12),transparent 33%),#07091a!important}.cd-story-v2:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(112deg,rgba(255,255,255,.03),transparent 29%,rgba(144,110,255,.07) 72%,transparent)}.cd-story-shell{z-index:1}.cd-story-header{padding:12px 2px 6px}.cd-story-header>div:first-child>p{color:#92f0d0!important;font-size:11px!important;letter-spacing:.18em!important}.cd-story-header h1{max-width:720px;font-size:clamp(2.6rem,6vw,5.1rem)!important;line-height:.93!important}.cd-story-header>div:first-child>p:last-child{max-width:605px!important;color:#b6c8e5!important;font-size:14px}.cd-story-header .cosmic-button{min-height:39px!important;border-radius:13px!important;font-size:12px!important}.cd-story-rail{padding:13px!important;border:1px solid rgba(217,229,255,.22)!important;border-radius:25px!important;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(99,104,195,.07))!important;box-shadow:0 20px 48px rgba(0,0,0,.2),inset 0 1px rgba(255,255,255,.14)!important}.cd-story-rail>div:first-child{padding:3px 5px 12px!important}.cd-story-chapter-card{position:relative;overflow:hidden;border:1px solid rgba(224,232,255,.31)!important;border-radius:17px!important;background:linear-gradient(150deg,rgba(255,255,255,.93),rgba(220,229,253,.9))!important;color:#17233f!important;box-shadow:0 10px 22px rgba(0,0,0,.16)!important}.cd-story-chapter-card:before{content:"";position:absolute;inset:auto -18% -86%;height:115%;border-radius:50%;background:radial-gradient(ellipse,rgba(120,233,214,.28),transparent 69%);pointer-events:none}.cd-story-chapter-card strong,.cd-story-chapter-card span{position:relative}.cd-story-chapter-card>span:nth-of-type(2){color:#58719c!important}.cd-story-chapter-card>span:last-child{background:rgba(35,77,132,.15)!important}.cd-story-stage{align-items:stretch!important}.cd-story-fragments{border:1px solid rgba(218,230,255,.22)!important;border-radius:28px!important;background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(81,88,171,.08))!important;box-shadow:0 25px 58px rgba(0,0,0,.23)!important}.cd-story-progress h2{line-height:.95}.cd-story-progress>div:last-child{box-shadow:inset 0 1px rgba(255,255,255,.13)}.cd-story-fragment-grid:before{opacity:.22!important}.cd-story-fragment>a{position:relative;overflow:hidden;border-radius:16px!important;background:rgba(255,255,255,.09)!important;transition:transform .18s cubic-bezier(.16,1,.3,1),box-shadow .18s ease,background .18s ease!important}.cd-story-fragment>a:hover{transform:translateY(-4px);background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(136,231,220,.12))!important;box-shadow:0 17px 30px rgba(0,0,0,.22)!important}.cd-story-lore{border:1px solid rgba(217,229,255,.24)!important;border-radius:27px!important;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(88,91,174,.09))!important;box-shadow:0 24px 56px rgba(0,0,0,.23)!important}.cd-story-lore .cosmic-button{border-radius:13px!important;font-size:12px!important}@media(max-width:720px){.cd-story-v2{padding-inline:12px!important}.cd-story-header{padding:3px 0;text-align:left}.cd-story-header>div:last-child{justify-items:start!important}.cd-story-header>div:last-child>div{justify-content:flex-start!important}.cd-story-fragment-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.cd-story-fragment>a{min-height:103px!important}.cd-story-stage{grid-template-columns:1fr!important}}@media(prefers-reduced-motion:reduce){.cd-story-chapter-card,.cd-story-fragment>a{transition:none!important}}
      `}</style>
    </main>
  );
}
