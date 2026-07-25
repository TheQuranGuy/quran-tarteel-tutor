"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import PlacementResult from "./PlacementResult";

export const PLACEMENT_QUESTION_COUNT = 12;

function getOptionId(option, index) {
  return String(option?.id ?? option?.value ?? index);
}

function getQuestionSeed(question, fallback) {
  return String(question?.id || fallback).split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function shuffleOptions(options, question, fallback) {
  const copy = [...options];
  let seed = getQuestionSeed(question, fallback);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = seed % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  if (copy.length > 1 && question?.correctOptionId && String(copy[0]?.id) === String(question.correctOptionId)) {
    const targetIndex = (Number(fallback) % (copy.length - 1)) + 1;
    [copy[0], copy[targetIndex]] = [copy[targetIndex], copy[0]];
  }
  return copy;
}

/**
 * A controlled placement quiz shell. The parent decides how many questions
 * are supplied so the curriculum can remain accurate as it evolves.
 *
 * Question shape: { id, prompt, helper?, arabic?, options: [{ id, label, description? }] }
 * Feedback shape: { status: "correct" | "incorrect" | "info", title?, message?, explanation?, correctOptionId? }
 */
export default function PlacementQuiz({
  questions = [],
  currentIndex = 0,
  totalQuestions = PLACEMENT_QUESTION_COUNT,
  selectedOptionId = null,
  answerState = "idle",
  feedback = null,
  isLoading = false,
  result = null,
  onSelectOption,
  onContinue,
  onBack,
  onExit,
  onBegin,
  onRetake,
  onExplore,
}) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const count = Math.max(1, Math.min(safeQuestions.length || PLACEMENT_QUESTION_COUNT, Number(totalQuestions) || safeQuestions.length || PLACEMENT_QUESTION_COUNT));
  const safeIndex = Math.max(0, Math.min(count - 1, Number(currentIndex) || 0));
  const question = safeQuestions[safeIndex];
  const choices = useMemo(() => shuffleOptions(Array.isArray(question?.options) ? question.options : [], question, safeIndex), [question, safeIndex]);
  const checking = isLoading || answerState === "checking";
  const hasSelection = selectedOptionId !== null && selectedOptionId !== undefined && selectedOptionId !== "";
  const hasAnswerFeedback = Boolean(feedback?.status);
  const hasFeedbackContent = Boolean(feedback && (feedback.title || feedback.message || feedback.explanation));

  if (result) {
    return <PlacementResult result={result} onBegin={onBegin} onRetake={onRetake} onExplore={onExplore} isLoading={isLoading} />;
  }

  return (
    <motion.section
      aria-labelledby="placement-quiz-title"
      className="placement-quiz"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.22, 0.76, 0.24, 1] }}
    >
      <div className="placement-quiz__topline">
        <button className="placement-quiz__exit" type="button" onClick={onExit} aria-label="Leave placement quiz">
          <span aria-hidden="true">×</span>
          <span>Save for later</span>
        </button>
        <span className="placement-quiz__step">QUESTION {safeIndex + 1} OF {count}</span>
      </div>

      <div className="placement-quiz__progress" role="progressbar" aria-label="Placement quiz progress" aria-valuemin={0} aria-valuemax={count} aria-valuenow={safeIndex + 1}>
        {Array.from({ length: count }, (_, index) => <span className={index <= safeIndex ? "is-complete" : ""} key={index} />)}
      </div>

      <header className="placement-quiz__header">
        <span className="placement-quiz__orb" aria-hidden="true">✦</span>
        <p className="placement-quiz__eyebrow">COSMIC STARTING POINT</p>
        <h2 id="placement-quiz-title">A few quick signals, then your path is ready.</h2>
        <p>There are no grades here. Choose the answer that feels most familiar to you.</p>
      </header>

      <AnimatePresence mode="wait">
        {question ? (
          <motion.div
            className="placement-quiz__question-card"
            key={question.id ?? safeIndex}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <fieldset disabled={checking}>
              <legend>{question.prompt}</legend>
              {question.helper ? <p className="placement-quiz__helper">{question.helper}</p> : null}
              {question.arabic ? <p className="placement-quiz__arabic" dir="rtl">{question.arabic}</p> : null}

              <div className="placement-quiz__answers" role="radiogroup" aria-label={question.prompt}>
                {choices.map((option, index) => {
                  const optionId = getOptionId(option, index);
                  const selected = String(selectedOptionId ?? "") === optionId;
                  const isCorrect = hasAnswerFeedback && String(feedback.correctOptionId ?? "") === optionId;
                  const isWrong = hasAnswerFeedback && selected && feedback.status === "incorrect";
                  const state = isCorrect ? "is-correct" : isWrong ? "is-wrong" : selected ? "is-selected" : "";

                  return (
                    <motion.button
                      key={optionId}
                      className={`placement-answer ${state}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={option.description ? `${option.label}. ${option.description}` : option.label}
                      onClick={() => onSelectOption?.(option, optionId, safeIndex)}
                      disabled={checking || Boolean(hasAnswerFeedback && feedback.status !== "info")}
                      whileHover={!checking ? { y: -2 } : {}}
                      whileTap={!checking ? { scale: 0.992 } : {}}
                    >
                      <span className="placement-answer__letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                      <span>
                        <strong>{option.label}</strong>
                        {option.description ? <small>{option.description}</small> : null}
                      </span>
                      <span className="placement-answer__mark" aria-hidden="true">{isCorrect ? "✓" : isWrong ? "•" : selected ? "✓" : ""}</span>
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>
          </motion.div>
        ) : (
          <motion.div className="placement-quiz__loading" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="placement-quiz__loader" aria-hidden="true" />
            <div><strong>{isLoading ? "Finding your first signal…" : "Your quiz is ready when its questions arrive."}</strong><p>Every signal helps shape a calmer, more useful starting point.</p></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasFeedbackContent ? (
          <motion.div
            className={`placement-feedback placement-feedback--${feedback.status || "info"}`}
            role={feedback.status === "incorrect" ? "alert" : "status"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <span className="placement-feedback__icon" aria-hidden="true">{feedback.status === "correct" ? "✦" : feedback.status === "incorrect" ? "↗" : "i"}</span>
            <div>
              {feedback.title ? <strong>{feedback.title}</strong> : null}
              {feedback.message ? <p>{feedback.message}</p> : null}
              {feedback.explanation ? <small>{feedback.explanation}</small> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <footer className="placement-quiz__footer">
        <button className="placement-quiz__back" type="button" onClick={() => onBack?.(safeIndex)} disabled={checking || safeIndex === 0}>
          <span aria-hidden="true">←</span> Back
        </button>
        <button className="placement-button placement-button--primary" type="button" onClick={() => onContinue?.(safeIndex)} disabled={!question || !hasSelection || checking}>
          {checking ? "Checking…" : hasAnswerFeedback ? safeIndex === count - 1 ? "See my pathway" : "Next signal" : "Check answer"}
          {!checking ? <span aria-hidden="true">→</span> : null}
        </button>
      </footer>

      <style jsx global>{`
        .placement-quiz {
          width: min(100%, 720px);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 30px;
          color: #26344f;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.99), rgba(237, 246, 255, 0.98));
          box-shadow: 0 28px 72px rgba(1, 10, 39, 0.32), inset 0 2px 0 rgba(255, 255, 255, 0.92);
        }
        .placement-quiz__topline { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 17px 21px 12px; }
        .placement-quiz__exit { display: inline-flex; align-items: center; gap: 7px; border: 0; padding: 5px; cursor: pointer; color: #6d7d98; background: transparent; font-size: 12px; font-weight: 850; }
        .placement-quiz__exit span:first-child { display: grid; width: 21px; height: 21px; place-items: center; border: 1px solid #cfdae8; border-radius: 50%; color: #60708c; font-size: 17px; line-height: 1; }
        .placement-quiz__exit:hover { color: #255b84; }
        .placement-quiz__step { color: #6584a4; font-size: 11px; font-weight: 950; letter-spacing: .11em; }
        .placement-quiz__progress { display: grid; grid-template-columns: repeat(${count}, minmax(0, 1fr)); gap: 5px; padding: 0 21px; }
        .placement-quiz__progress span { height: 8px; border-radius: 999px; background: #dce6f1; transition: background .25s ease, box-shadow .25s ease; }
        .placement-quiz__progress span.is-complete { background: linear-gradient(90deg, #64dce8, #74d449); box-shadow: 0 2px 7px rgba(75, 197, 166, .28); }
        .placement-quiz__header { position: relative; margin: 22px 21px 0; padding: 22px 78px 22px 22px; overflow: hidden; border: 1px solid #dceaf7; border-radius: 22px; background: linear-gradient(130deg, #ebf9ff, #f0edff); }
        .placement-quiz__header::after { position: absolute; right: -61px; bottom: -61px; width: 170px; height: 170px; border: 1px solid rgba(110, 160, 243, .25); border-radius: 50%; content: ""; box-shadow: 0 0 0 24px rgba(132, 203, 255, .12), 0 0 0 49px rgba(180, 148, 255, .08); }
        .placement-quiz__orb { position: absolute; z-index: 1; top: 24px; right: 30px; display: grid; width: 40px; height: 40px; place-items: center; border-radius: 50%; color: #fff; background: radial-gradient(circle at 30% 27%, #fff, #9feaff 28%, #8775ed 70%); box-shadow: 0 7px 18px rgba(98, 109, 221, .35); }
        .placement-quiz__eyebrow { margin: 0 0 7px; color: #287ead; font-size: 10px; font-weight: 950; letter-spacing: .14em; }
        .placement-quiz__header h2 { max-width: 15ch; margin: 0; color: #1c3655; font-family: ui-rounded, "Avenir Next", "Nunito", system-ui, sans-serif; font-size: clamp(1.55rem, 4vw, 2.35rem); line-height: 1; letter-spacing: -.052em; }
        .placement-quiz__header p:last-child { max-width: 45ch; margin: 10px 0 0; color: #62748f; font-size: 13px; line-height: 1.55; }
        .placement-quiz__question-card { margin: 21px; }
        .placement-quiz fieldset { min-width: 0; margin: 0; border: 0; padding: 0; }
        .placement-quiz legend { width: 100%; color: #263b59; font-size: clamp(1.1rem, 3vw, 1.36rem); font-weight: 900; line-height: 1.25; }
        .placement-quiz__helper { margin: 7px 0 0; color: #72829b; font-size: 13px; line-height: 1.5; }
        .placement-quiz__arabic { margin: 15px 0 0; border: 1px solid #dce8f4; border-radius: 16px; padding: 13px 15px; color: #27435d; background: #fff; font-family: "Noto Naskh Arabic", Amiri, Georgia, serif; font-size: 25px; line-height: 1.7; text-align: right; }
        .placement-quiz__answers { display: grid; gap: 10px; margin-top: 17px; }
        .placement-answer { display: grid; grid-template-columns: 32px minmax(0, 1fr) 18px; align-items: center; gap: 11px; width: 100%; min-height: 64px; border: 2px solid #dce5f0; border-bottom-width: 4px; border-radius: 16px; padding: 11px 13px; cursor: pointer; color: #3c4e69; background: #fff; text-align: left; box-shadow: none; transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease, transform 160ms ease; }
        .placement-answer:hover:not(:disabled) { border-color: #9ddcf0; background: #f4fcff; box-shadow: 0 8px 16px rgba(53, 167, 210, .1); }
        .placement-answer:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
        .placement-answer:disabled { cursor: default; }
        .placement-answer__letter { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid #d8e4f0; border-radius: 10px; color: #7290ac; background: #f6faff; font-size: 12px; font-weight: 950; }
        .placement-answer strong { display: block; color: inherit; font-size: 14px; }
        .placement-answer small { display: block; margin-top: 3px; color: #7c8ba2; font-size: 12px; font-weight: 650; line-height: 1.35; }
        .placement-answer__mark { display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid #d6e2ed; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 950; }
        .placement-answer.is-selected { border-color: #77cfe9; background: #effbff; }
        .placement-answer.is-selected .placement-answer__letter { border-color: #68bee2; color: #1677a9; background: #dcf5ff; }
        .placement-answer.is-selected .placement-answer__mark { border-color: #4eb9df; background: #4eb9df; }
        .placement-answer.is-correct { border-color: #65cf7e; background: #edfff2; }
        .placement-answer.is-correct .placement-answer__mark { border-color: #54c473; background: #54c473; }
        .placement-answer.is-wrong { border-color: #f2a5ad; color: #9b4353; background: #fff3f4; }
        .placement-answer.is-wrong .placement-answer__mark { border-color: #f08c9b; background: #f08c9b; }
        .placement-quiz__loading { display: flex; align-items: center; gap: 13px; margin: 21px; border: 1px dashed #cbddea; border-radius: 18px; padding: 22px; color: #61718b; background: #f8fcff; }
        .placement-quiz__loading strong { display: block; color: #334966; font-size: 14px; }
        .placement-quiz__loading p { margin: 4px 0 0; font-size: 12px; }
        .placement-quiz__loader { width: 26px; height: 26px; flex: 0 0 auto; border: 3px solid #c9ecf7; border-top-color: #47afd8; border-radius: 50%; animation: placement-spin .85s linear infinite; }
        .placement-feedback { display: flex; align-items: flex-start; gap: 10px; margin: 0 21px 18px; border: 1px solid #d8e6f3; border-radius: 17px; padding: 13px; color: #47617b; background: #f4faff; }
        .placement-feedback--correct { border-color: #b8ebc5; color: #36754a; background: #effff2; }
        .placement-feedback--incorrect { border-color: #f3c5ca; color: #954b58; background: #fff5f6; }
        .placement-feedback__icon { display: grid; width: 24px; height: 24px; flex: 0 0 auto; place-items: center; border-radius: 9px; color: #fff; background: #66bde0; font-size: 13px; font-weight: 950; }
        .placement-feedback--correct .placement-feedback__icon { background: #5ac675; }
        .placement-feedback--incorrect .placement-feedback__icon { background: #ee8591; }
        .placement-feedback strong { display: block; color: inherit; font-size: 13px; }
        .placement-feedback p { margin: 2px 0 0; color: inherit; font-size: 13px; line-height: 1.45; }
        .placement-feedback small { display: block; margin-top: 5px; color: inherit; font-size: 12px; line-height: 1.45; opacity: .86; }
        .placement-quiz__footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid #e4ebf3; padding: 16px 21px 20px; background: rgba(248, 252, 255, .7); }
        .placement-quiz__back { display: inline-flex; align-items: center; gap: 7px; border: 0; padding: 9px 4px; cursor: pointer; color: #71819a; background: transparent; font-size: 13px; font-weight: 900; }
        .placement-quiz__back:hover:not(:disabled) { color: #286f99; }
        .placement-quiz__back:disabled { cursor: not-allowed; opacity: .42; }
        .placement-button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 46px; border: 0; border-bottom: 4px solid #42a32e; border-radius: 15px; padding: 11px 16px; cursor: pointer; color: #fff; background: linear-gradient(180deg, #72df2b, #58c909); box-shadow: 0 9px 18px rgba(73, 190, 23, .2); font: 900 14px/1 ui-rounded, "Avenir Next", "Nunito", system-ui, sans-serif; transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease; }
        .placement-button:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 13px 22px rgba(73, 190, 23, .27); }
        .placement-button:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
        .placement-button:disabled { cursor: not-allowed; opacity: .48; box-shadow: none; }
        .placement-quiz__exit:focus-visible, .placement-answer:focus-visible, .placement-button:focus-visible, .placement-quiz__back:focus-visible { outline: 3px solid #45c4f2; outline-offset: 3px; }
        @keyframes placement-spin { to { transform: rotate(360deg); } }
        @media (max-width: 540px) {
          .placement-quiz { border-radius: 24px; }
          .placement-quiz__topline, .placement-quiz__progress, .placement-quiz__header, .placement-quiz__question-card, .placement-feedback, .placement-quiz__footer { margin-left: 14px; margin-right: 14px; }
          .placement-quiz__topline { padding-left: 0; padding-right: 0; }
          .placement-quiz__progress { padding-left: 0; padding-right: 0; }
          .placement-quiz__header { padding: 19px 62px 19px 18px; }
          .placement-quiz__orb { right: 21px; width: 34px; height: 34px; }
          .placement-quiz__footer { padding-left: 0; padding-right: 0; }
          .placement-quiz__exit span:last-child { display: none; }
          .placement-quiz__exit span:first-child { width: 25px; height: 25px; }
        }
        @media (prefers-reduced-motion: reduce) { .placement-quiz *, .placement-quiz *::before, .placement-quiz *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; } }
      `}</style>
    </motion.section>
  );
}
