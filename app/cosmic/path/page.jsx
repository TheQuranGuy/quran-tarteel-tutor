"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import {
  ADAPTIVE_CHAPTERS,
  PLACEMENT_QUESTIONS,
  completePlacement,
  getAdaptiveProfile,
  getChapterProgress,
  getChapterUnlockState,
  getNextAdaptiveMission,
  scorePlacement,
  setCurrentAdaptiveChapter,
} from "../../../lib/adaptive-path";
import ChapterCard from "./components/ChapterCard";
import ChapterProgress from "./components/ChapterProgress";
import ChapterRail from "./components/ChapterRail";
import BeginnerStartCard from "./components/BeginnerStartCard";
import MissionCard from "./components/MissionCard";
import PlacementQuiz from "./components/PlacementQuiz";

const EMPTY_QUIZ = {
  index: 0,
  answers: {},
  selectedOptionId: null,
  feedback: null,
  result: null,
};

const LEVEL_TITLES = {
  "new-moon": "Your gentle beginning is ready",
  "rising-star": "Your daily rhythm is ready",
  "steady-orbit": "Your steady path is ready",
  pathfinder: "Your deeper path is ready",
};

function getPlacementPresentation(answers) {
  const scored = scorePlacement(answers);
  const startingChapter = ADAPTIVE_CHAPTERS.find((chapter) => chapter.id === scored.recommendedChapterId) || ADAPTIVE_CHAPTERS[0];
  const strengths = scored.results
    .filter((result) => result.correct)
    .map((result) => PLACEMENT_QUESTIONS.find((question) => question.id === result.questionId)?.skill)
    .filter(Boolean)
    .filter((skill, index, values) => values.indexOf(skill) === index)
    .slice(0, 3);

  return {
    scored,
    view: {
      level: scored.level.label,
      title: LEVEL_TITLES[scored.level.id] || "Your pathway is ready",
      description: scored.level.description,
      startingChapter: `Chapter ${startingChapter.id} · ${startingChapter.title}`,
      score: scored.score,
      total: scored.maxScore,
      strengths: strengths.length ? strengths : ["Listen first", "Take one ayah at a time", "Build a gentle rhythm"],
    },
  };
}

function getMissionView(mission) {
  if (mission?.type === "celebration") {
    return {
      title: "Your available route is glowing",
      description: mission.reason,
      kind: "memorise",
      chapterLabel: "A BEAUTIFUL MILESTONE",
      actionLabel: "Open review",
    };
  }

  if (mission?.type === "chapter-unlock") {
    return {
      title: `Unlock ${mission.chapterTitle}`,
      description: mission.reason,
      kind: "review",
      chapterLabel: "NEXT UNLOCK",
      actionLabel: "View my chapters",
    };
  }

  return {
    title: mission ? `${mission.surahName} · Ayah ${mission.ayahNumber}` : "Your next ayah is waiting",
    description: mission?.reason || "Continue with a calm, focused Qur'an lesson.",
    kind: mission?.type === "review" ? "review" : "listen",
    ayahLabel: mission ? `${mission.chapterTitle} · ${mission.difficulty}` : undefined,
    chapterLabel: mission?.type === "review" ? "A QUICK STRENGTHENING REVIEW" : "YOUR NEXT COSMIC STEP",
    duration: mission?.type === "anchor" ? "3 min" : "4 min",
    actionLabel: mission?.type === "review" ? "Review ayah" : "Start ayah",
  };
}

function PlacementInvite({ onStart }) {
  return <section className="adaptive-placement-invite" aria-labelledby="placement-invite-title">
    <div className="adaptive-placement-invite__orb" aria-hidden="true">✦</div>
    <div>
      <p>OPTIONAL PLACEMENT</p>
      <h2 id="placement-invite-title">Find a chapter that feels just right.</h2>
      <span>Take a calm 12-question check-in, or begin with Al-Fatiha right away. It is not a test—there is no wrong place to begin.</span>
    </div>
    <button type="button" onClick={onStart}>Find my starting point <span aria-hidden="true">→</span></button>
  </section>;
}

function RouteSnapshot({ profile, onRetake }) {
  const level = profile.placement?.levelId?.replaceAll("-", " ") || "first steps";
  return <section className="adaptive-route-snapshot" aria-label="Your placement summary">
    <span className="adaptive-route-snapshot__spark" aria-hidden="true">✦</span>
    <div>
      <p>YOUR ADAPTIVE ROUTE</p>
      <strong>{level}</strong>
      <span>Your chapter order grows from easy, familiar material into deeper, longer study.</span>
    </div>
    <button type="button" onClick={onRetake}>Re-check my level</button>
  </section>;
}

function ChapterFocus({ chapter, onToggleStations, showAllStations }) {
  if (!chapter) return null;
  const visibleSurahs = showAllStations ? chapter.surahs : chapter.surahs.slice(0, 6);
  const locked = chapter.status === "locked";
  const firstSurah = chapter.surahs[0];

  return <section className={`adaptive-chapter-focus adaptive-chapter-focus--${chapter.status}`} aria-labelledby="chapter-focus-title">
    <div className="adaptive-chapter-focus__glow" aria-hidden="true" />
    <div className="adaptive-chapter-focus__topline">
      <span>CHAPTER {chapter.id} · {chapter.difficulty.toUpperCase()}</span>
      <span className="adaptive-chapter-focus__status">{chapter.status === "completed" ? "MASTERED" : locked ? "LOCKED" : "READY TO EXPLORE"}</span>
    </div>
    <div className="adaptive-chapter-focus__heading">
      <div className="adaptive-chapter-focus__icon" aria-hidden="true">{chapter.icon}</div>
      <div>
        <h2 id="chapter-focus-title">{chapter.title}</h2>
        <p>{chapter.subtitle}</p>
      </div>
    </div>
    <ChapterProgress
      value={chapter.progress}
      label="Core ayah progress"
      detail={`${chapter.completedCount} of ${chapter.missionCount} key ayahs mastered`}
    />
    <div className="adaptive-chapter-focus__surahs">
      <div className="adaptive-chapter-focus__surah-heading">
        <div>
          <strong>Surah worlds in this chapter</strong>
          <span>{chapter.surahs.length} surahs · {chapter.ayahCount.toLocaleString()} ayahs</span>
        </div>
        {chapter.surahs.length > 6 ? <button type="button" onClick={onToggleStations}>{showAllStations ? "Show fewer" : `Show all ${chapter.surahs.length}`}</button> : null}
      </div>
      <div className="adaptive-surah-stations">
        {visibleSurahs.map((surah) => locked ? <div className="adaptive-surah-station adaptive-surah-station--locked" key={surah.id} aria-disabled="true">
          <span>{surah.number}</span><div><strong>{surah.name}</strong><small>{surah.translation} · locked</small></div>
        </div> : <Link className="adaptive-surah-station" href={`/cosmic/path/${surah.id}`} key={surah.id}>
          <span>{surah.number}</span><div><strong>{surah.name}</strong><small>{surah.translation} · {surah.ayahCount} ayahs</small></div><b aria-hidden="true">›</b>
        </Link>)}
      </div>
    </div>
    {!locked && firstSurah ? <Link className="adaptive-chapter-focus__cta" href={`/cosmic/path/${firstSurah.id}`}>Enter {firstSurah.name} world <span aria-hidden="true">→</span></Link> : <p className="adaptive-chapter-focus__locked-copy">Complete the key ayahs in the previous chapter to open this route.</p>}
  </section>;
}

export default function CosmicPathPage() {
  const router = useRouter();
  const user = useCosmicUser();
  const [hydrated, setHydrated] = useState(false);
  const [quiz, setQuiz] = useState(EMPTY_QUIZ);
  const [placementDismissed, setPlacementDismissed] = useState(false);
  const [forcePlacement, setForcePlacement] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [hasManuallySelectedChapter, setHasManuallySelectedChapter] = useState(false);
  const [showAllStations, setShowAllStations] = useState(false);
  const [showFullJourney, setShowFullJourney] = useState(false);

  useEffect(() => setHydrated(true), []);

  const profile = useMemo(() => getAdaptiveProfile(user), [user]);
  const chapterModels = useMemo(() => ADAPTIVE_CHAPTERS.map((chapter) => {
    const progress = getChapterProgress(user, chapter);
    const unlock = getChapterUnlockState(user, chapter);
    const completed = progress.complete;
    const status = completed ? "completed" : !unlock.unlocked ? "locked" : profile.currentChapterId === chapter.id ? "current" : "unlocked";

    return {
      ...chapter,
      number: chapter.id,
      theme: chapter.subtitle,
      icon: completed ? "✦" : !unlock.unlocked ? "◌" : chapter.id === profile.currentChapterId ? "◉" : "◒",
      status,
      progress: progress.anchorPercent,
      completedCount: progress.anchorComplete,
      missionCount: progress.anchorTotal,
      ayahCount: chapter.ayahCount,
      unlockReason: unlock.reason,
    };
  }), [profile.currentChapterId, user]);
  const nextMission = useMemo(() => getNextAdaptiveMission(user), [user]);
  const activeChapterId = hasManuallySelectedChapter ? selectedChapterId : profile.currentChapterId;
  const selectedChapter = chapterModels.find((chapter) => chapter.id === activeChapterId && chapter.status !== "locked") || chapterModels.find((chapter) => chapter.status === "current") || chapterModels.find((chapter) => chapter.status !== "locked") || chapterModels[0];
  const isBeginnerRoute = profile.placement.status !== "complete" || profile.placement.levelId === "new-moon";
  const visibleChapterModels = isBeginnerRoute && !showFullJourney ? chapterModels.slice(0, 3) : chapterModels;
  const quizVisible = hydrated && forcePlacement && !placementDismissed;
  const currentQuestion = PLACEMENT_QUESTIONS[quiz.index];

  useEffect(() => {
    setShowAllStations(false);
  }, [selectedChapter?.id]);

  function resetQuiz() {
    setQuiz(EMPTY_QUIZ);
  }

  function startPlacement() {
    resetQuiz();
    setPlacementDismissed(false);
    setForcePlacement(true);
  }

  function chooseAnswer(_option, optionId) {
    if (quiz.feedback) return;
    setQuiz((current) => ({ ...current, selectedOptionId: optionId }));
  }

  function moveBack() {
    if (quiz.feedback) {
      setQuiz((current) => ({ ...current, feedback: null }));
      return;
    }
    if (quiz.index === 0) return;
    const previousIndex = quiz.index - 1;
    const previousQuestion = PLACEMENT_QUESTIONS[previousIndex];
    setQuiz((current) => ({
      ...current,
      index: previousIndex,
      selectedOptionId: current.answers[previousQuestion.id] || null,
      feedback: null,
    }));
  }

  function continueQuiz() {
    if (!currentQuestion) return;

    if (!quiz.feedback) {
      const selectedOptionId = quiz.selectedOptionId;
      const correct = selectedOptionId === currentQuestion.correctOptionId;
      setQuiz((current) => ({
        ...current,
        answers: { ...current.answers, [currentQuestion.id]: selectedOptionId },
        feedback: {
          status: correct ? "correct" : "incorrect",
          title: correct ? "That is a strong signal." : "A helpful clue for your journey.",
          message: correct ? "We will use that to shape your starting chapter." : `The best answer is ${currentQuestion.options.find((option) => option.id === currentQuestion.correctOptionId)?.label}.`,
          explanation: `${currentQuestion.explanation} ${currentQuestion.reference ? `Reference: ${currentQuestion.reference}.` : ""}`,
          correctOptionId: currentQuestion.correctOptionId,
        },
      }));
      return;
    }

    if (quiz.index === PLACEMENT_QUESTIONS.length - 1) {
      const presentation = getPlacementPresentation(quiz.answers);
      setQuiz((current) => ({ ...current, result: presentation }));
      return;
    }

    const nextIndex = quiz.index + 1;
    const nextQuestion = PLACEMENT_QUESTIONS[nextIndex];
    setQuiz((current) => ({
      ...current,
      index: nextIndex,
      selectedOptionId: current.answers[nextQuestion.id] || null,
      feedback: null,
    }));
  }

  function savePlacement() {
    const result = completePlacement(quiz.answers);
    setSelectedChapterId(result.recommendedChapterId);
    setHasManuallySelectedChapter(true);
    setPlacementDismissed(true);
    setForcePlacement(false);
    resetQuiz();
  }

  function selectChapter(chapter) {
    if (chapter.status === "locked") return;
    setSelectedChapterId(chapter.id);
    setHasManuallySelectedChapter(true);
    if (profile.currentChapterId !== chapter.id) setCurrentAdaptiveChapter(chapter.id);
  }

  function startMission() {
    if (nextMission?.href) router.push(nextMission.href);
  }

  if (!hydrated) {
    return <main className="cosmic-dark adaptive-path adaptive-path--loading"><StarParticles count={36} color="#b8d9ff" /><span className="adaptive-path__loader" aria-label="Loading your pathway" /></main>;
  }

  return <main className="cosmic-dark adaptive-path">
    <StarParticles count={46} color="#b8d9ff" />
    <span className="adaptive-path__nebula adaptive-path__nebula--one" aria-hidden="true" />
    <span className="adaptive-path__nebula adaptive-path__nebula--two" aria-hidden="true" />
    <section className="adaptive-path__shell">
      <header className="adaptive-path__hero">
        <div>
          <p className="adaptive-path__eyebrow">COSMIC LEARNING JOURNEY</p>
          <h1>A Qur'an path that grows with you.</h1>
          <p className="adaptive-path__intro">Start with what feels familiar, build one ayah at a time, and move toward deeper chapters when you are ready.</p>
        </div>
        <div className="adaptive-path__stats" aria-label="Your learning stats">
          <span><strong>{user.xp || 0}</strong> XP</span>
          <span><strong>{user.streak || 0}</strong> day streak</span>
          <span><strong>{user.dailyXp || 0}/{user.dailyGoal || 10}</strong> daily goal</span>
        </div>
      </header>

      {quizVisible ? <div className="adaptive-path__quiz-wrap">
        <PlacementQuiz
          questions={PLACEMENT_QUESTIONS}
          totalQuestions={PLACEMENT_QUESTIONS.length}
          currentIndex={quiz.index}
          selectedOptionId={quiz.selectedOptionId}
          feedback={quiz.feedback}
          result={quiz.result?.view || null}
          onSelectOption={chooseAnswer}
          onContinue={continueQuiz}
          onBack={moveBack}
          onExit={() => {
            setPlacementDismissed(true);
            setForcePlacement(false);
          }}
          onBegin={savePlacement}
          onRetake={resetQuiz}
          onExplore={savePlacement}
        />
      </div> : <>
        {profile.placement.status === "complete" ? <RouteSnapshot profile={profile} onRetake={startPlacement} /> : <PlacementInvite onStart={startPlacement} />}

        {isBeginnerRoute ? <BeginnerStartCard onTakePlacement={startPlacement} /> : null}

        <section className="adaptive-path__mission-grid" aria-label="Your next learning step">
          <MissionCard
            mission={getMissionView(nextMission)}
            chapterLabel={getMissionView(nextMission).chapterLabel}
            actionLabel={getMissionView(nextMission).actionLabel}
            onStart={startMission}
            state={nextMission?.type === "chapter-unlock" ? "locked" : "current"}
          />
          <aside className="adaptive-path__how-it-works">
            <span aria-hidden="true">✦</span>
            <div>
              <p>YOUR PACE IS ENOUGH</p>
              <strong>One ayah is a real win.</strong>
              <small>Start small, revisit often, and let each chapter open when you feel ready.</small>
            </div>
          </aside>
        </section>

        <ChapterFocus
          chapter={selectedChapter}
          showAllStations={showAllStations}
          onToggleStations={() => setShowAllStations((value) => !value)}
        />

        <div id="chapter-journey" className="adaptive-path__chapter-journey">
          <ChapterRail
            chapters={visibleChapterModels}
            activeChapterId={selectedChapter?.id}
            onSelectChapter={selectChapter}
            title={isBeginnerRoute && !showFullJourney ? "Your first three chapters" : "Your chapter journey"}
            subtitle={isBeginnerRoute && !showFullJourney ? "Stay with these small, familiar steps first. The longer chapters will still be here when you want them." : "The route begins gently, then expands through themes, stories, reflection, and longer study."}
            renderChapter={({ chapter, index, status, onSelect }) => <ChapterCard
              chapter={chapter}
              index={index + 1}
              status={status}
              progress={chapter.progress}
              onClick={status === "locked" ? undefined : onSelect}
              className={chapter.id === selectedChapter?.id ? "adaptive-path__chapter-card--selected" : ""}
            />}
          />
          {isBeginnerRoute ? <div className="adaptive-path__journey-toggle">
            <span>{showFullJourney ? "All ten chapters are visible." : "Prefer to see the whole journey?"}</span>
            <button type="button" onClick={() => setShowFullJourney((value) => !value)}>{showFullJourney ? "Show a smaller path" : "Show all chapters"}</button>
          </div> : null}
        </div>
      </>}
    </section>
    <style jsx global>{`
      .adaptive-path { position: relative; isolation: isolate; min-height: calc(100svh - 64px); overflow: hidden; padding: 46px 16px 92px; background: radial-gradient(circle at 52% -11%, rgba(119, 101, 246, .42), transparent 31%), radial-gradient(circle at 4% 50%, rgba(46, 217, 232, .18), transparent 31%), radial-gradient(circle at 96% 72%, rgba(239, 117, 211, .17), transparent 30%), #060818 !important; }
      .adaptive-path::before { position: absolute; z-index: -1; inset: 0; content: ""; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px); background-size: 44px 44px; mask-image: linear-gradient(to bottom, black, transparent 72%); }
      .adaptive-path__shell { position: relative; z-index: 1; width: min(1120px, 100%); margin: 0 auto; }
      .adaptive-path__nebula { position: absolute; z-index: -1; width: 33rem; height: 33rem; border-radius: 50%; pointer-events: none; filter: blur(58px); opacity: .42; }
      .adaptive-path__nebula--one { top: 15%; left: -16rem; background: #356cc5; }
      .adaptive-path__nebula--two { right: -17rem; bottom: 8%; background: #8d47ba; }
      .adaptive-path__hero { display: flex; align-items: end; justify-content: space-between; gap: 25px; margin-bottom: 31px; border: 1px solid rgba(219, 237, 255, .17); border-radius: 30px; padding: clamp(23px, 4vw, 37px); color: #fff; background: linear-gradient(132deg, rgba(20, 27, 69, .84), rgba(20, 24, 61, .64)); box-shadow: 0 24px 55px rgba(0,0,0,.23), inset 0 1px rgba(255,255,255,.12); backdrop-filter: blur(18px); }
      .adaptive-path__eyebrow { margin: 0 0 9px; color: #94f5d6; font-size: 11px; font-weight: 950; letter-spacing: .16em; }
      .adaptive-path__hero h1 { max-width: 670px; margin: 0; color: #fff; font-family: ui-rounded, "Avenir Next", Nunito, system-ui, sans-serif; font-size: clamp(2.5rem, 6.3vw, 5.6rem); line-height: .91; letter-spacing: -.066em; }
      .adaptive-path__intro { max-width: 610px; margin: 16px 0 0; color: #bfd0eb; font-size: 14px; line-height: 1.6; }
      .adaptive-path__stats { display: grid; flex: 0 0 auto; min-width: 220px; gap: 9px; border: 1px solid rgba(153, 236, 214, .22); border-radius: 20px; padding: 14px 16px; color: #b4c7e4; background: linear-gradient(135deg, rgba(133, 241, 205, .11), rgba(131, 150, 255, .1)); box-shadow: inset 0 1px rgba(255,255,255,.1); font-size: 12px; font-weight: 800; }
      .adaptive-path__stats span { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
      .adaptive-path__stats strong { color: #fff7d7; font-family: var(--cd-font-number, ui-monospace, monospace); font-size: 17px; letter-spacing: -.04em; }
      .adaptive-path__quiz-wrap { display: grid; place-items: start center; padding: 4px 0 12px; }
      .adaptive-placement-invite, .adaptive-route-snapshot { display: flex; align-items: center; gap: 16px; margin-bottom: 25px; border: 2px solid rgba(255,255,255,.87); border-bottom: 5px solid #55b8bd; border-radius: 25px; padding: 16px 18px; color: #264563; background: linear-gradient(135deg, #f1ffff, #e5f5ff 62%, #f5f1ff); box-shadow: 0 18px 35px rgba(1, 15, 45, .2), inset 0 2px #fff; }
      .adaptive-placement-invite__orb { display: grid; width: 55px; height: 55px; flex: 0 0 auto; place-items: center; border: 2px solid rgba(255,255,255,.9); border-bottom: 4px solid #5d90db; border-radius: 19px; color: #fff; background: radial-gradient(circle at 30% 28%, #fff, #9beaff 25%, #7374e9 66%, #8f6ce0); box-shadow: 0 9px 17px rgba(75, 114, 211, .27); font-size: 20px; }
      .adaptive-placement-invite p, .adaptive-route-snapshot p { margin: 0 0 4px; color: #4a83ab; font-size: 10px; font-weight: 950; letter-spacing: .13em; }
      .adaptive-placement-invite h2 { margin: 0; color: #203956; font-family: ui-rounded, "Avenir Next", Nunito, system-ui, sans-serif; font-size: clamp(1.2rem, 2.5vw, 1.55rem); letter-spacing: -.04em; }
      .adaptive-placement-invite div > span, .adaptive-route-snapshot div > span { display: block; max-width: 690px; margin-top: 5px; color: #617a96; font-size: 13px; line-height: 1.45; }
      .adaptive-placement-invite button, .adaptive-route-snapshot button { min-height: 42px; flex: 0 0 auto; margin-left: auto; border: 0; border-bottom: 4px solid #3f9900; border-radius: 14px; padding: 9px 13px; cursor: pointer; color: #fff; background: linear-gradient(180deg, #71e21b, #58cc02); box-shadow: 0 8px 15px rgba(70,179,13,.2); font: 900 12px/1 ui-rounded, "Avenir Next", Nunito, system-ui, sans-serif; transition: transform .16s ease, filter .16s ease; }
      .adaptive-placement-invite button span { margin-left: 5px; font-size: 16px; }
      .adaptive-placement-invite button:hover, .adaptive-route-snapshot button:hover { transform: translateY(-2px); filter: brightness(1.04); }
      .adaptive-placement-invite button:active, .adaptive-route-snapshot button:active { transform: translateY(2px); border-bottom-width: 2px; }
      .adaptive-route-snapshot { border-bottom-color: #d2a039; background: linear-gradient(135deg, #fffdf3, #fff6d8 58%, #edf9ff); }
      .adaptive-route-snapshot__spark { display: grid; width: 43px; height: 43px; flex: 0 0 auto; place-items: center; border-radius: 15px; color: #896313; background: linear-gradient(145deg, #fff1a2, #ffc75b); box-shadow: 0 4px 0 #c8912e; font-size: 19px; }
      .adaptive-route-snapshot strong { display: block; color: #254460; font-family: ui-rounded, "Avenir Next", Nunito, system-ui, sans-serif; font-size: 16px; text-transform: capitalize; }
      .adaptive-route-snapshot button { color: #3f6283; background: #fff; border: 2px solid #cee0ef; border-bottom: 4px solid #b1c9dd; box-shadow: 0 6px 12px rgba(48,88,119,.1); }
      .adaptive-path__mission-grid { display: grid; grid-template-columns: minmax(0, 1.22fr) minmax(240px, .78fr); gap: 18px; align-items: stretch; margin-bottom: 27px; }
      .adaptive-path__how-it-works { display: flex; align-items: center; gap: 14px; border: 1px solid rgba(172, 207, 255, .2); border-radius: 26px; padding: 18px; color: #c2d4ec; background: linear-gradient(145deg, rgba(25, 42, 90, .7), rgba(28, 28, 70, .72)); box-shadow: inset 0 1px rgba(255,255,255,.1), 0 18px 36px rgba(0,0,0,.16); }
      .adaptive-path__how-it-works > span { display: grid; width: 48px; height: 48px; flex: 0 0 auto; place-items: center; border: 1px solid rgba(255,255,255,.42); border-radius: 17px; color: #fff8dc; background: linear-gradient(145deg, #8c76ee, #4daedd); box-shadow: 0 8px 18px rgba(77,118,211,.28); font-size: 19px; }
      .adaptive-path__how-it-works p { margin: 0 0 5px; color: #92efd8; font-size: 10px; font-weight: 950; letter-spacing: .13em; }
      .adaptive-path__how-it-works strong { display: block; color: #fff; font-size: 15px; line-height: 1.1; }
      .adaptive-path__how-it-works small { display: block; margin-top: 7px; color: #b9cce5; font-size: 12px; line-height: 1.45; }
      .adaptive-chapter-focus { position: relative; overflow: hidden; margin-bottom: 33px; border: 2px solid rgba(255,255,255,.9); border-bottom: 5px solid #4aaf96; border-radius: 28px; padding: clamp(18px, 3vw, 27px); color: #29415f; background: linear-gradient(135deg, #f5fffd, #e4faf3 56%, #edf6ff); box-shadow: 0 20px 44px rgba(1,16,43,.25), inset 0 2px #fff; isolation: isolate; }
      .adaptive-chapter-focus__glow { position: absolute; z-index: -1; top: -160px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(130,246,211,.68), rgba(117,202,255,.12) 48%, transparent 70%); }
      .adaptive-chapter-focus--locked { filter: grayscale(.38); border-bottom-color: #9eafc2; background: linear-gradient(135deg, #f4f6f9, #e8edf3); }
      .adaptive-chapter-focus--completed { border-bottom-color: #c2902f; background: linear-gradient(135deg, #fffdf3, #fff4cf 59%, #edfaff); }
      .adaptive-chapter-focus__topline { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #4e809d; font-size: 10px; font-weight: 950; letter-spacing: .13em; }
      .adaptive-chapter-focus__status { border: 1px solid #b9e6d5; border-radius: 999px; padding: 5px 8px; color: #28745f; background: rgba(255,255,255,.72); font-size: 9px; letter-spacing: .09em; }
      .adaptive-chapter-focus__heading { display: grid; grid-template-columns: 67px minmax(0, 1fr); gap: 15px; align-items: center; margin: 16px 0 20px; }
      .adaptive-chapter-focus__icon { display: grid; width: 64px; height: 64px; place-items: center; border: 2px solid rgba(255,255,255,.92); border-bottom: 4px solid #2d967b; border-radius: 22px; color: #fff; background: linear-gradient(145deg, #70df17, #40caa0 62%, #5bb9ef); box-shadow: 0 9px 18px rgba(34,159,129,.24); font-size: 24px; }
      .adaptive-chapter-focus h2 { margin: 0; color: #1e3854; font-family: ui-rounded, "Avenir Next", Nunito, system-ui, sans-serif; font-size: clamp(1.6rem, 3.4vw, 2.4rem); line-height: .98; letter-spacing: -.055em; }
      .adaptive-chapter-focus__heading p { margin: 7px 0 0; color: #637a94; font-size: 14px; line-height: 1.48; }
      .adaptive-chapter-focus__surahs { margin-top: 22px; border-top: 1px solid rgba(44,125,139,.17); padding-top: 17px; }
      .adaptive-chapter-focus__surah-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 12px; }
      .adaptive-chapter-focus__surah-heading strong { display: block; color: #264562; font-size: 14px; }
      .adaptive-chapter-focus__surah-heading span { display: block; margin-top: 3px; color: #71849b; font-size: 11px; font-weight: 700; }
      .adaptive-chapter-focus__surah-heading button { border: 1px solid #c8ddeb; border-bottom: 3px solid #adc8da; border-radius: 11px; padding: 7px 9px; cursor: pointer; color: #39728f; background: #fff; font-size: 11px; font-weight: 900; }
      .adaptive-surah-stations { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; }
      .adaptive-surah-station { display: grid; grid-template-columns: 29px minmax(0, 1fr) auto; gap: 8px; align-items: center; min-width: 0; border: 1px solid #d4e6ef; border-bottom: 3px solid #bbd9e3; border-radius: 14px; padding: 9px; color: inherit; background: rgba(255,255,255,.79); text-decoration: none; transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease; }
      .adaptive-surah-station:hover { transform: translateY(-2px); border-color: #98d9dc; box-shadow: 0 9px 16px rgba(36,111,123,.12); }
      .adaptive-surah-station > span { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 10px; color: #1e627e; background: #dbf5f6; font-family: var(--cd-font-number, ui-monospace, monospace); font-size: 10px; font-weight: 950; }
      .adaptive-surah-station strong { display: block; overflow: hidden; color: #294763; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
      .adaptive-surah-station small { display: block; overflow: hidden; margin-top: 2px; color: #71879d; font-size: 10px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
      .adaptive-surah-station b { color: #5fc53b; font-size: 19px; line-height: .6; }
      .adaptive-surah-station--locked { opacity: .65; }
      .adaptive-surah-station--locked > span { color: #77899d; background: #e8eef3; }
      .adaptive-chapter-focus__cta { display: inline-flex; align-items: center; gap: 8px; min-height: 43px; margin-top: 19px; border-bottom: 4px solid #3f9900; border-radius: 14px; padding: 10px 14px; color: #fff; background: linear-gradient(180deg, #72e01c, #58cc02); box-shadow: 0 9px 17px rgba(76,184,17,.2); font-size: 12px; font-weight: 900; text-decoration: none; transition: transform .16s ease, filter .16s ease; }
      .adaptive-chapter-focus__cta:hover { transform: translateY(-2px); filter: brightness(1.04); }
      .adaptive-chapter-focus__locked-copy { margin: 18px 0 0; color: #6f8094; font-size: 12px; font-weight: 800; }
      .adaptive-path__chapter-journey { position: relative; padding: 13px 0 0; }
      .adaptive-path__journey-toggle { display: flex; align-items: center; justify-content: center; gap: 11px; margin: 3px auto 0; color: #c4d6ec; font-size: 12px; font-weight: 750; text-align: center; }
      .adaptive-path__journey-toggle button { border: 1px solid rgba(185,226,248,.58); border-bottom: 3px solid #5e93ba; border-radius: 12px; padding: 8px 10px; cursor: pointer; color: #effcff; background: rgba(34,62,118,.64); box-shadow: inset 0 1px rgba(255,255,255,.12); font: 900 11px/1 ui-rounded, "Avenir Next", Nunito, system-ui, sans-serif; transition: transform .16s ease, background .16s ease; }
      .adaptive-path__journey-toggle button:hover { transform: translateY(-2px); background: rgba(50,88,150,.8); }
      .adaptive-path__journey-toggle button:active { transform: translateY(1px); }
      .adaptive-path__journey-toggle button:focus-visible { outline: 3px solid #a6f5d8; outline-offset: 3px; }
      .adaptive-path__chapter-card--selected { box-shadow: 0 0 0 5px rgba(117, 235, 209, .18), 0 23px 45px rgba(2,15,48,.27) !important; }
      .adaptive-path--loading { display: grid; place-items: center; }
      .adaptive-path__loader { position: relative; z-index: 1; width: 52px; height: 52px; border: 5px solid rgba(193,231,255,.24); border-top-color: #8ff1c7; border-radius: 50%; animation: adaptive-path-spin .85s linear infinite; }
      @keyframes adaptive-path-spin { to { transform: rotate(360deg); } }
      @media (max-width: 860px) { .adaptive-path__hero { align-items: flex-start; flex-direction: column; } .adaptive-path__stats { width: 100%; grid-template-columns: repeat(3, minmax(0, 1fr)); } .adaptive-path__stats span { align-items: center; flex-direction: column; text-align: center; } .adaptive-path__mission-grid { grid-template-columns: 1fr; } .adaptive-path__how-it-works { min-height: 120px; } .adaptive-surah-stations { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 620px) { .adaptive-path { padding: 22px 12px 70px; } .adaptive-path__hero { margin: 0 -2px 21px; border-radius: 24px; padding: 21px 18px; } .adaptive-path__hero h1 { font-size: clamp(2.25rem, 12vw, 3.6rem); } .adaptive-path__intro { font-size: 13px; } .adaptive-path__stats { gap: 6px; min-width: 0; padding: 11px 8px; } .adaptive-path__stats strong { font-size: 14px; } .adaptive-placement-invite, .adaptive-route-snapshot { align-items: flex-start; flex-wrap: wrap; border-radius: 21px; padding: 14px; } .adaptive-placement-invite__orb { width: 45px; height: 45px; border-radius: 15px; } .adaptive-placement-invite button, .adaptive-route-snapshot button { width: 100%; margin-left: 0; } .adaptive-path__how-it-works { align-items: flex-start; border-radius: 21px; padding: 15px; } .adaptive-chapter-focus { border-radius: 23px; padding: 16px; } .adaptive-chapter-focus__heading { grid-template-columns: 54px minmax(0, 1fr); gap: 11px; } .adaptive-chapter-focus__icon { width: 52px; height: 52px; border-radius: 18px; } .adaptive-chapter-focus__topline { align-items: flex-start; flex-direction: column; } .adaptive-chapter-focus__surah-heading { align-items: flex-start; flex-direction: column; } .adaptive-surah-stations { grid-template-columns: 1fr; } .adaptive-path__journey-toggle { align-items: stretch; flex-direction: column; } .adaptive-path__journey-toggle button { width: 100%; } }
      @media (prefers-reduced-motion: reduce) { .adaptive-path__loader { animation: none; } .adaptive-placement-invite button, .adaptive-route-snapshot button, .adaptive-surah-station, .adaptive-chapter-focus__cta, .adaptive-path__journey-toggle button { transition: none; } }
    `}</style>
  </main>;
}
