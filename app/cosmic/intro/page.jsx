"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setDailyGoal, updateUser } from "../../../lib/user";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import WelcomeScreen from "./WelcomeScreen";
import MascotSelection from "./MascotSelection";
import DailyGoalSetup from "./DailyGoalSetup";
import IntroAnimation from "./IntroAnimation";
import HomeIntroScreen from "./HomeIntroScreen";
import FirstTimeLessonIntro from "./FirstTimeLessonIntro";
import TransitionToLearningPath from "./TransitionToLearningPath";

export default function CosmicIntroPage() {
  const router = useRouter();
  const user = useCosmicUser();
  const [step, setStep] = useState("welcome");
  const [guide, setGuide] = useState("");
  const [goal, setGoal] = useState(10);
  function saveGuide() { updateUser({ cosmicGuide: guide }); setStep("goal"); }
  function saveGoal() { setDailyGoal(goal); setStep("animation"); }
  function continueFromHome() { if (user.cosmicFirstLessonSeen) finishIntro(); else setStep("lesson"); }
  function finishFirstLesson() { updateUser({ cosmicFirstLessonSeen: true }); setStep("transition"); }
  function finishIntro() { updateUser({ cosmicIntroComplete: true }); router.push("/cosmic/path"); }
  if (user.cosmicIntroComplete && step === "welcome") return <HomeIntroScreen />;
  if (step === "welcome") return <WelcomeScreen onStart={() => setStep("guide")} />;
  if (step === "guide") return <MascotSelection value={guide} onChange={setGuide} onContinue={saveGuide} />;
  if (step === "goal") return <DailyGoalSetup value={goal} onChange={setGoal} onContinue={saveGoal} />;
  if (step === "animation") return <IntroAnimation guide={guide} onDone={() => setStep("home")} />;
  if (step === "home") return <HomeIntroScreen onContinue={continueFromHome} />;
  if (step === "lesson") return <FirstTimeLessonIntro guide={guide} onContinue={finishFirstLesson} />;
  if (step === "transition") return <TransitionToLearningPath onDone={finishIntro} />;
  return <HomeIntroScreen user={user} />;
}
