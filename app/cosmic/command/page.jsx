"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import CosmicCompanion from "../../../components/cosmic/CosmicCompanion";
import CosmicOSPanel from "../../../components/cosmic/CosmicOSPanel";
import CosmicParallax from "../../../components/cosmic/CosmicParallax";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";

const systems = [
  { href: "/cosmic/path", mark: "01", title: "Learning path", copy: "Follow every surah and ayah in a calm, visible progression.", tint: "#8ff1c7" },
  { href: "/cosmic/review", mark: "02", title: "Memory orbit", copy: "Return to weak ayahs with a focused reinforcement session.", tint: "#c9a8ff" },
  { href: "/cosmic/recitation", mark: "03", title: "Recitation studio", copy: "Use reference audio and a private browser waveform for mindful practice.", tint: "#87edff" },
  { href: "/cosmic/story", mark: "04", title: "Story mode", copy: "Explore all 114 surahs as living chapters and ayah fragments.", tint: "#ffabd8" },
  { href: "/cosmic/skill-tree", mark: "05", title: "Skill tree", copy: "See your visual pathways for meaning, memorisation, grammar, and more.", tint: "#ffdc8c" },
  { href: "/cosmic/worlds", mark: "06", title: "Cosmic worlds", copy: "Choose a galaxy that matches the way you want to learn today.", tint: "#ad9bff" },
];

function Stat({ label, value, tone }) {
  return <div className="cd-surface cd-surface--soft cd-stat"><strong style={{ color: tone }}>{value}</strong><span>{label}</span></div>;
}

export default function CosmicCommandPage() {
  const user = useCosmicUser();
  const reducedMotion = useReducedMotion();
  const goal = Math.max(1, Number(user.dailyGoal) || 10);
  const dailyXp = Math.max(0, Number(user.dailyXp) || 0);
  const percent = Math.min(100, Math.round((dailyXp / goal) * 100));

  return <main className="cosmic-dark cd-command-v2" style={{ minHeight: "calc(100vh - 64px)" }}>
    <CosmicParallax stars={54} style={{ minHeight: "calc(100vh - 64px)", padding: "clamp(30px, 5vw, 62px) 0 96px" }}>
      <section className="cd-shell cd-page-enter" style={{ display: "grid", gap: 18 }}>
        <header className="cd-command-hero" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(300px, .75fr)", gap: 18, alignItems: "end" }}>
          <div>
            <p className="cd-kicker">QURAN TARTEEL · LEARNING COMMAND</p>
            <h1 className="cd-title" style={{ marginTop: 9 }}>Your learning universe, in one clear orbit.</h1>
            <p className="cd-copy" style={{ maxWidth: 650, margin: "17px 0 0" }}>This is your adaptive learning layer. It reads your existing progress to suggest a next step, while the Qur&apos;an, XP, streak, and lesson systems stay exactly as they are.</p>
          </div>
          <CosmicCompanion user={user} compact showAction />
        </header>

        <section className="cd-grid cd-stat-grid" aria-label="Current learning signals">
          <Stat label="total XP" value={user.xp || 0} tone="#ffdc8c" />
          <Stat label="day streak" value={`${user.streak || 0} days`} tone="#ffabd8" />
          <Stat label="today's goal" value={`${dailyXp}/${goal} XP`} tone="#8ff1c7" />
          <Stat label="goal progress" value={`${percent}%`} tone="#87edff" />
        </section>

        <section className="cd-command-split" style={{ display: "grid", gridTemplateColumns: "minmax(0, .9fr) minmax(0, 1.1fr)", gap: 18, alignItems: "start" }}>
          <CosmicOSPanel user={user} />
          <aside className="cd-surface" style={{ position: "relative", overflow: "hidden", padding: "clamp(18px, 3vw, 28px)", minHeight: 350 }}>
            <div className="cd-orbit cd-orbit--one" style={{ right: -125, top: -95 }} />
            <div className="cd-orbit cd-orbit--two" style={{ right: -215, top: -180 }} />
            <p className="cd-kicker">PERSONALIZATION, EXPLAINED</p>
            <h2 style={{ position: "relative", margin: "8px 0 10px", maxWidth: 420, fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: .98, letterSpacing: "-.06em" }}>A guide that shows its work.</h2>
            <p className="cd-copy" style={{ position: "relative", maxWidth: 500, margin: 0 }}>The Learning OS uses only your existing local progress, weak-ayah list, and optional answer history to choose a gentler or more challenging practice rhythm. It does not invent a score, make religious rulings, or send your learning data anywhere.</p>
            <div style={{ position: "relative", display: "flex", gap: 9, flexWrap: "wrap", marginTop: 19 }}><span className="cd-status">Local-first</span><span className="cd-status">Adaptive hints</span><span className="cd-status">Spaced review</span></div>
            <Link href="/cosmic/tutor" className="cd-button cd-button--quiet" style={{ position: "relative", width: "fit-content", marginTop: 19 }}>Ask the study tutor →</Link>
          </aside>
        </section>

        <section aria-label="Quran Tarteel systems" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 13 }}>
          {systems.map((system, index) => <motion.div key={system.href} initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .05, .24) }} whileHover={reducedMotion ? undefined : { y: -5 }} className="cd-surface cd-surface--soft" style={{ padding: 17, minHeight: 173, display: "grid", alignContent: "space-between", gap: 15, borderColor: `${system.tint}39` }}>
            <div><span style={{ color: system.tint, fontSize: 12, fontWeight: 950, letterSpacing: ".12em" }}>{system.mark}</span><h2 style={{ margin: "8px 0 6px", fontSize: "1.18rem", letterSpacing: "-.04em" }}>{system.title}</h2><p className="cd-copy" style={{ margin: 0, fontSize: 13 }}>{system.copy}</p></div>
            <Link href={system.href} style={{ color: system.tint, fontSize: 13, fontWeight: 900, textDecoration: "none" }}>Enter system →</Link>
          </motion.div>)}
        </section>
      </section><style jsx global>{`
        .cd-command-v2{isolation:isolate;background:radial-gradient(circle at 52% -10%,rgba(122,104,250,.32),transparent 32%),radial-gradient(circle at 4% 70%,rgba(38,222,225,.13),transparent 33%),#07091a!important}.cd-command-v2:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(116deg,rgba(255,255,255,.03),transparent 34%,rgba(154,108,255,.065) 73%,transparent)}.cd-command-v2 .cd-shell{position:relative;z-index:1}.cd-command-v2 .cd-command-hero{padding:4px 3px 8px}.cd-command-v2 .cd-kicker{color:#90efcf!important;font-size:11px!important;letter-spacing:.18em!important}.cd-command-v2 .cd-title{max-width:720px;font-size:clamp(2.5rem,6vw,5.05rem)!important;line-height:.93!important}.cd-command-v2 .cd-copy{color:#b9cae5!important}.cd-command-v2 .cd-surface{border:1px solid rgba(216,229,255,.22)!important;border-radius:25px!important;background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(87,92,178,.075))!important;box-shadow:0 22px 54px rgba(0,0,0,.22),inset 0 1px rgba(255,255,255,.13)!important}.cd-command-v2 .cd-surface--soft{border-radius:19px!important;background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(31,35,84,.54))!important;box-shadow:inset 0 1px rgba(255,255,255,.1),0 13px 29px rgba(0,0,0,.13)!important}.cd-command-v2 .cd-stat{min-height:99px;padding:15px!important;position:relative;overflow:hidden}.cd-command-v2 .cd-stat:after{content:"";position:absolute;right:-19%;bottom:-115%;width:85%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(128,236,217,.18),transparent 65%);pointer-events:none}.cd-command-v2 .cd-stat strong,.cd-command-v2 .cd-stat span{position:relative}.cd-command-v2 .cd-stat strong{font-size:1.58rem!important;letter-spacing:-.05em}.cd-command-v2 .cd-stat span{color:#b7c8e5!important;font-size:11px!important;font-weight:850!important}.cd-command-v2 .cd-button{border-radius:13px!important;min-height:40px!important;font-size:12px!important;font-weight:900!important;transition:transform .18s cubic-bezier(.16,1,.3,1),filter .18s ease,box-shadow .18s ease}.cd-command-v2 .cd-button:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 15px 30px rgba(126,183,255,.24)}.cd-command-v2 [aria-label="Quran Tarteel systems"]>div{position:relative;overflow:hidden;min-height:184px!important;border-radius:19px!important;transition:transform .18s cubic-bezier(.16,1,.3,1),box-shadow .18s ease!important}.cd-command-v2 [aria-label="Quran Tarteel systems"]>div:after{content:"";position:absolute;inset:auto -23% -111%;height:130%;border-radius:50%;background:radial-gradient(ellipse,rgba(127,237,216,.15),transparent 67%);pointer-events:none}.cd-command-v2 [aria-label="Quran Tarteel systems"]>div>*{position:relative}.cd-command-v2 [aria-label="Quran Tarteel systems"]>div:hover{transform:translateY(-5px)!important;box-shadow:0 22px 40px rgba(0,0,0,.22)!important}.cd-command-v2 .cd-status{border:1px solid rgba(216,229,255,.18)!important;border-radius:999px!important;background:rgba(255,255,255,.08)!important;color:#cad8ef!important;font-size:11px!important}@media(max-width:780px){.cd-command-v2 .cd-command-hero,.cd-command-v2 .cd-command-split{grid-template-columns:1fr!important}.cd-command-v2 .cd-command-hero>.cd-surface{order:-1}.cd-command-v2 .cd-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.cd-command-v2 .cd-title{font-size:clamp(2.25rem,10vw,3.8rem)!important}.cd-command-v2 [aria-label="Quran Tarteel systems"]{grid-template-columns:1fr!important}.cd-command-v2 .cd-shell{padding-inline:12px!important}}@media(prefers-reduced-motion:reduce){.cd-command-v2 .cd-button,.cd-command-v2 [aria-label="Quran Tarteel systems"]>div{transition:none!important}}
      `}</style>
    </CosmicParallax>
  </main>;
}
