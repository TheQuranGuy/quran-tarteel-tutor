import { surahList } from "./quran";
import { getUser, updateUser } from "./user";

/**
 * A data-only adaptive curriculum for CosmicDuo.
 *
 * This module deliberately does not award XP, alter streaks, mark ayahs as
 * mastered, or change any existing route. It only stores its own small
 * `adaptivePath` object on the existing user record. Screens can use these
 * helpers to decide what to show and then continue to rely on the existing
 * lesson and progress systems for completion/rewards.
 */

export const ADAPTIVE_PROFILE_FIELD = "adaptivePath";
export const ADAPTIVE_PROFILE_VERSION = 1;

const SURAH_BY_ID = new Map(surahList.map((surah) => [Number(surah.id), surah]));

const chapterBlueprints = [
  {
    id: 1,
    title: "First Light",
    subtitle: "Begin with the prayer for guidance",
    difficulty: "Gentle start",
    difficultyRank: 1,
    focus: ["Listening", "Reading", "Meaning"],
    rewardLabel: "Guidance Beacon",
    surahIds: [1],
  },
  {
    id: 2,
    title: "Daily Shields",
    subtitle: "Short, familiar surahs for daily practice",
    difficulty: "Easy",
    difficultyRank: 2,
    focus: ["Short recitation", "Memory habits", "Protection"],
    rewardLabel: "Starlight Shield",
    surahIds: [112, 113, 114, 109, 108, 110, 111, 107, 106, 105, 104, 103, 102, 101, 100, 99],
  },
  {
    id: 3,
    title: "Juz Amma Foundations",
    subtitle: "Build confidence one short surah at a time",
    difficulty: "Easy to steady",
    difficultyRank: 3,
    focus: ["Vocabulary", "Fluency", "Connection"],
    rewardLabel: "Constellation Key",
    surahIds: [98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78],
  },
  {
    id: 4,
    title: "Voices of the Hereafter",
    subtitle: "Longer passages with clear themes and rhythm",
    difficulty: "Steady",
    difficultyRank: 4,
    focus: ["Theme recognition", "Longer passages", "Revision"],
    rewardLabel: "Orbit Compass",
    surahIds: [77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67],
  },
  {
    id: 5,
    title: "Mercy and Creation",
    subtitle: "Notice the signs of Allah across creation",
    difficulty: "Growing",
    difficultyRank: 5,
    focus: ["Meaning", "Reflection", "Consistent review"],
    rewardLabel: "Aurora Lens",
    surahIds: [66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56],
  },
  {
    id: 6,
    title: "Signs on the Horizon",
    subtitle: "Develop focus through vivid Makkan themes",
    difficulty: "Focused",
    difficultyRank: 6,
    focus: ["Context", "Recitation stamina", "Meaning"],
    rewardLabel: "Nova Map",
    surahIds: [55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43],
  },
  {
    id: 7,
    title: "Stories that Guide",
    subtitle: "Learn recurring lessons from the Qur'anic stories",
    difficulty: "Committed",
    difficultyRank: 7,
    focus: ["Narrative flow", "Reflection", "Revision"],
    rewardLabel: "Story Lantern",
    surahIds: [42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29],
  },
  {
    id: 8,
    title: "Prophets and Turning Points",
    subtitle: "Meet the people and moments that shape the message",
    difficulty: "Advanced",
    difficultyRank: 8,
    focus: ["Long-form listening", "Themes", "Recall"],
    rewardLabel: "Comet Chronicle",
    surahIds: [28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17],
  },
  {
    id: 9,
    title: "Faith in Community",
    subtitle: "Explore guidance for life, faith, and community",
    difficulty: "Deep practice",
    difficultyRank: 9,
    focus: ["Study habits", "Longer themes", "Mastery"],
    rewardLabel: "Galaxy Standard",
    surahIds: [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3],
  },
  {
    id: 10,
    title: "The Great Foundation",
    subtitle: "A patient journey through Al-Baqarah",
    difficulty: "Marathon",
    difficultyRank: 10,
    focus: ["Study blocks", "Spaced review", "Long-term mastery"],
    rewardLabel: "Horizon Crown",
    surahIds: [2],
  },
];

function compactSurah(surah) {
  return {
    id: Number(surah.id),
    number: surah.number,
    name: surah.name,
    translation: surah.translation,
    ayahCount: surah.ayahCount,
    summary: surah.summary,
  };
}

function buildChapter(blueprint) {
  const surahs = blueprint.surahIds.map((id) => SURAH_BY_ID.get(id)).filter(Boolean).map(compactSurah);
  return Object.freeze({
    ...blueprint,
    surahIds: Object.freeze([...blueprint.surahIds]),
    surahs: Object.freeze(surahs),
    ayahCount: surahs.reduce((total, surah) => total + surah.ayahCount, 0),
  });
}

/** Ordered from the gentlest on-ramp to the longest study chapter. */
export const ADAPTIVE_CHAPTERS = Object.freeze(chapterBlueprints.map(buildChapter));
export const LEARNING_CHAPTERS = ADAPTIVE_CHAPTERS;

export const PLACEMENT_LEVELS = Object.freeze([
  {
    id: "new-moon",
    label: "New Moon",
    description: "A calm guided beginning with the essential short surahs.",
    minScore: 0,
    maxScore: 7,
    startChapterId: 1,
  },
  {
    id: "rising-star",
    label: "Rising Star",
    description: "You know some foundations and can build a daily rhythm.",
    minScore: 8,
    maxScore: 15,
    startChapterId: 2,
  },
  {
    id: "steady-orbit",
    label: "Steady Orbit",
    description: "You are ready for connected short-surah practice and review.",
    minScore: 16,
    maxScore: 23,
    startChapterId: 3,
  },
  {
    id: "pathfinder",
    label: "Pathfinder",
    description: "You can begin deeper study while keeping earlier chapters available.",
    minScore: 24,
    maxScore: Number.POSITIVE_INFINITY,
    startChapterId: 4,
  },
]);

/**
 * This is a confidence check, not a religious test. Each question is a
 * deterministic multiple-choice item so placement never depends on a model,
 * network request, or random result.
 */
export const PLACEMENT_QUESTIONS = Object.freeze([
  {
    id: "opening-name",
    weight: 1,
    difficulty: 1,
    skill: "Foundations",
    prompt: "What is Al-Fatiha commonly translated as?",
    options: [
      { id: "opening", label: "The Opening" },
      { id: "light", label: "The Light" },
      { id: "victory", label: "The Victory" },
      { id: "morning", label: "The Morning" },
    ],
    correctOptionId: "opening",
    explanation: "Al-Fatiha means The Opening and begins the Qur'an.",
    reference: "Surah Al-Fatiha (1)",
  },
  {
    id: "praise",
    weight: 1,
    difficulty: 1,
    skill: "Meaning",
    prompt: "In Al-Fatiha, all praise is for whom?",
    options: [
      { id: "allah", label: "Allah" },
      { id: "angels", label: "The angels" },
      { id: "prophets", label: "The prophets" },
      { id: "people", label: "All people" },
    ],
    correctOptionId: "allah",
    explanation: "Al-Fatiha opens by praising Allah, Lord of all worlds.",
    reference: "Surah Al-Fatiha (1:2)",
  },
  {
    id: "ikhlas-theme",
    weight: 1,
    difficulty: 1,
    skill: "Surah themes",
    prompt: "What central truth does Al-Ikhlas teach?",
    options: [
      { id: "oneness", label: "Allah is One and uniquely perfect" },
      { id: "trade", label: "Rules of trade" },
      { id: "travel", label: "How to travel" },
      { id: "fasting", label: "How to fast" },
    ],
    correctOptionId: "oneness",
    explanation: "Al-Ikhlas centres on the absolute oneness and perfection of Allah.",
    reference: "Surah Al-Ikhlas (112)",
  },
  {
    id: "protection-pair",
    weight: 1,
    difficulty: 1,
    skill: "Daily practice",
    prompt: "Al-Falaq and An-Nas are often recited to seek what?",
    options: [
      { id: "protection", label: "Allah's protection" },
      { id: "wealth", label: "More wealth" },
      { id: "travel", label: "A safe journey only" },
      { id: "sleep", label: "More sleep" },
    ],
    correctOptionId: "protection",
    explanation: "These two short surahs teach us to seek refuge with Allah.",
    reference: "Surah Al-Falaq (113) and Surah An-Nas (114)",
  },
  {
    id: "learning-order",
    weight: 2,
    difficulty: 2,
    skill: "Study habits",
    prompt: "Which routine is most helpful when learning a new ayah?",
    options: [
      { id: "repeat", label: "Listen, read slowly, then repeat in small pieces" },
      { id: "rush", label: "Rush through it once and move on" },
      { id: "skip", label: "Skip the meaning completely" },
      { id: "wait", label: "Wait until the end of the month" },
    ],
    correctOptionId: "repeat",
    explanation: "Small, repeated practice helps both recitation and recall.",
    reference: "Learning habit",
  },
  {
    id: "straight-path",
    weight: 2,
    difficulty: 2,
    skill: "Meaning",
    prompt: "What does Al-Fatiha ask Allah to show us?",
    options: [
      { id: "guidance", label: "The straight path" },
      { id: "weather", label: "Tomorrow's weather" },
      { id: "distance", label: "The fastest road" },
      { id: "wealth", label: "The greatest treasure" },
    ],
    correctOptionId: "guidance",
    explanation: "A central supplication in Al-Fatiha is for guidance to the straight path.",
    reference: "Surah Al-Fatiha (1:6)",
  },
  {
    id: "kawthar-meaning",
    weight: 2,
    difficulty: 2,
    skill: "Vocabulary",
    prompt: "What does Al-Kawthar refer to?",
    options: [
      { id: "abundance", label: "Abundance" },
      { id: "mountain", label: "A mountain" },
      { id: "elephant", label: "An elephant" },
      { id: "city", label: "A city" },
    ],
    correctOptionId: "abundance",
    explanation: "Al-Kawthar means abundant goodness.",
    reference: "Surah Al-Kawthar (108)",
  },
  {
    id: "review-choice",
    weight: 2,
    difficulty: 2,
    skill: "Revision",
    prompt: "If you can recite an ayah today but forget it two days later, what should your plan become?",
    options: [
      { id: "review", label: "Move it into spaced review until recall becomes stable" },
      { id: "avoid", label: "Avoid that ayah until it feels easy again" },
      { id: "guess", label: "Recite from memory without checking mistakes" },
      { id: "replace", label: "Replace it with a different surah every session" },
    ],
    correctOptionId: "review",
    explanation: "Spaced, kind review is how weak recall becomes strong recall.",
    reference: "Learning habit",
  },
  {
    id: "qadr-theme",
    weight: 3,
    difficulty: 3,
    skill: "Surah themes",
    prompt: "Which surah is known as The Night of Decree?",
    options: [
      { id: "qadr", label: "Al-Qadr" },
      { id: "fil", label: "Al-Fil" },
      { id: "asr", label: "Al-Asr" },
      { id: "nasr", label: "An-Nasr" },
    ],
    correctOptionId: "qadr",
    explanation: "Al-Qadr is the chapter of the Night of Decree.",
    reference: "Surah Al-Qadr (97)",
  },
  {
    id: "rahman-theme",
    weight: 3,
    difficulty: 3,
    skill: "Surah themes",
    prompt: "Which surah repeatedly asks, 'Which of your Lord's favours will you both deny?'",
    options: [
      { id: "rahman", label: "Ar-Rahman" },
      { id: "masad", label: "Al-Masad" },
      { id: "humazah", label: "Al-Humazah" },
      { id: "quraysh", label: "Quraysh" },
    ],
    correctOptionId: "rahman",
    explanation: "Ar-Rahman repeatedly invites reflection on Allah's blessings.",
    reference: "Surah Ar-Rahman (55)",
  },
  {
    id: "long-surah-rhythm",
    weight: 3,
    difficulty: 3,
    skill: "Study habits",
    prompt: "You are starting a long surah such as Al-Baqarah. Which method best protects accuracy and motivation?",
    options: [
      { id: "blocks", label: "Use short connected blocks and revisit them often" },
      { id: "single", label: "Memorise the whole surah in one sitting" },
      { id: "meaningless", label: "Never check the meaning" },
      { id: "random", label: "Choose ayahs at random without review" },
    ],
    correctOptionId: "blocks",
    explanation: "Small connected blocks plus regular review make long study manageable.",
    reference: "Learning habit",
  },
  {
    id: "recitation-reset",
    weight: 3,
    difficulty: 3,
    skill: "Recitation practice",
    prompt: "You keep blending two Arabic words together in the same place. What is the best correction loop?",
    options: [
      { id: "slow", label: "Slow down, listen carefully, and repeat the small section" },
      { id: "hide", label: "Hide the mistake and continue" },
      { id: "faster", label: "Recite faster to get past it" },
      { id: "quit", label: "Stop practising altogether" },
    ],
    correctOptionId: "slow",
    explanation: "Slower, deliberate repetition is the most useful reset for a tricky phrase.",
    reference: "Learning habit",
  },
  {
    id: "tajweed-shaddah",
    weight: 4,
    difficulty: 4,
    skill: "Tajweed",
    prompt: "In a word with shaddah, what does the mark usually tell the reciter to do?",
    options: [
      { id: "double", label: "Give the letter a doubled sound with care" },
      { id: "skip", label: "Skip the letter completely" },
      { id: "whisper", label: "Whisper the whole word silently" },
      { id: "lengthen", label: "Lengthen every vowel after it equally" },
    ],
    correctOptionId: "double",
    explanation: "A shaddah indicates that the consonant is strengthened or doubled in pronunciation.",
    reference: "Basic tajweed sign",
  },
  {
    id: "surah-order",
    weight: 4,
    difficulty: 4,
    skill: "Qur'an navigation",
    prompt: "Which sequence is in correct Qur'an order?",
    options: [
      { id: "correct", label: "Al-Fatiha, Al-Baqarah, Ali 'Imran, An-Nisa" },
      { id: "juzamma", label: "Al-Ikhlas, Al-Falaq, An-Nas, Al-Baqarah" },
      { id: "reverse", label: "An-Nisa, Ali 'Imran, Al-Baqarah, Al-Fatiha" },
      { id: "mixed", label: "Al-Kawthar, Maryam, Al-Fatiha, Ya-Sin" },
    ],
    correctOptionId: "correct",
    explanation: "The first four surahs are Al-Fatiha, Al-Baqarah, Ali 'Imran, and An-Nisa.",
    reference: "Qur'an surah order",
  },
]);

export const PLACEMENT_MAX_SCORE = PLACEMENT_QUESTIONS.reduce((total, question) => total + question.weight, 0);

function asPositiveInteger(value, fallback = 0) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function uniqueNumbers(values) {
  return [...new Set((Array.isArray(values) ? values : []).map(Number).filter((value) => Number.isInteger(value) && value > 0))];
}

function validChapterId(value) {
  const chapterId = Number(value);
  return ADAPTIVE_CHAPTERS.some((chapter) => chapter.id === chapterId) ? chapterId : 1;
}

function validAyahId(value) {
  const match = String(value || "").match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  const surah = SURAH_BY_ID.get(Number(match[1]));
  const ayahNumber = Number(match[2]);
  if (!surah || ayahNumber < 1 || ayahNumber > surah.ayahCount) return null;
  return `${Number(match[1])}-${ayahNumber}`;
}

function compactMissionHistory(history) {
  if (!history || typeof history !== "object" || Array.isArray(history)) return {};
  return Object.entries(history).reduce((next, [missionId, entry]) => {
    const ayahId = validAyahId(missionId);
    if (!ayahId || !entry || typeof entry !== "object") return next;
    next[ayahId] = {
      attempts: Math.max(0, Number(entry.attempts) || 0),
      correctAttempts: Math.max(0, Number(entry.correctAttempts) || 0),
      lastResult: entry.lastResult === "correct" ? "correct" : entry.lastResult === "incorrect" ? "incorrect" : null,
      lastAttemptAt: typeof entry.lastAttemptAt === "string" ? entry.lastAttemptAt : null,
    };
    return next;
  }, {});
}

function defaultPlacement() {
  return {
    status: "not-started",
    score: null,
    maxScore: PLACEMENT_MAX_SCORE,
    correctCount: 0,
    levelId: null,
    completedAt: null,
    answers: {},
  };
}

export function createAdaptiveProfile() {
  return {
    version: ADAPTIVE_PROFILE_VERSION,
    placement: defaultPlacement(),
    currentChapterId: 1,
    unlockedChapterIds: [1],
    missionHistory: {},
    completedChapterIds: [],
    lastRecommendationAt: null,
  };
}

/** Safely normalizes old, partial, or malformed stored adaptive data. */
export function normalizeAdaptiveProfile(value) {
  const defaults = createAdaptiveProfile();
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const rawPlacement = source.placement && typeof source.placement === "object" ? source.placement : {};
  const placementLevel = PLACEMENT_LEVELS.find((level) => level.id === rawPlacement.levelId);
  const completed = rawPlacement.status === "complete" && placementLevel;

  return {
    version: ADAPTIVE_PROFILE_VERSION,
    placement: {
      ...defaults.placement,
      status: completed ? "complete" : "not-started",
      score: completed ? Math.max(0, Math.min(PLACEMENT_MAX_SCORE, Number(rawPlacement.score) || 0)) : null,
      correctCount: completed ? Math.max(0, Math.min(PLACEMENT_QUESTIONS.length, Number(rawPlacement.correctCount) || 0)) : 0,
      levelId: completed ? placementLevel.id : null,
      completedAt: completed && typeof rawPlacement.completedAt === "string" ? rawPlacement.completedAt : null,
      answers: completed && rawPlacement.answers && typeof rawPlacement.answers === "object" && !Array.isArray(rawPlacement.answers) ? { ...rawPlacement.answers } : {},
    },
    currentChapterId: validChapterId(source.currentChapterId),
    unlockedChapterIds: uniqueNumbers([1, ...(source.unlockedChapterIds || [])]).filter((id) => ADAPTIVE_CHAPTERS.some((chapter) => chapter.id === id)),
    missionHistory: compactMissionHistory(source.missionHistory),
    completedChapterIds: uniqueNumbers(source.completedChapterIds).filter((id) => ADAPTIVE_CHAPTERS.some((chapter) => chapter.id === id)),
    lastRecommendationAt: typeof source.lastRecommendationAt === "string" ? source.lastRecommendationAt : null,
  };
}

/** Reads only the adaptive namespace from the existing user profile. */
export function getAdaptiveProfile(user = getUser()) {
  return normalizeAdaptiveProfile(user?.[ADAPTIVE_PROFILE_FIELD]);
}

/**
 * Writes only `adaptivePath` via the existing user persistence helper. No
 * reward, streak, daily-goal, mastery, or review field is touched.
 */
export function updateAdaptiveProfile(updates) {
  const current = getAdaptiveProfile();
  const candidate = typeof updates === "function" ? updates(current) : { ...current, ...(updates || {}) };
  const next = normalizeAdaptiveProfile(candidate);
  updateUser({ [ADAPTIVE_PROFILE_FIELD]: next });
  return next;
}

export function getChapterById(id) {
  return ADAPTIVE_CHAPTERS.find((chapter) => chapter.id === Number(id));
}

export function getSurahForAdaptivePath(id) {
  const surah = SURAH_BY_ID.get(Number(id));
  return surah ? compactSurah(surah) : undefined;
}

export function getPlacementLevel(score) {
  const numericScore = Math.max(0, Number(score) || 0);
  return PLACEMENT_LEVELS.find((level) => numericScore >= level.minScore && numericScore <= level.maxScore) || PLACEMENT_LEVELS[0];
}

function answerForQuestion(answers, questionId) {
  if (Array.isArray(answers)) {
    const found = answers.find((answer) => answer?.questionId === questionId || answer?.id === questionId);
    return found?.selectedOptionId ?? found?.optionId ?? found?.answer ?? found?.value;
  }
  if (!answers || typeof answers !== "object") return undefined;
  const answer = answers[questionId];
  return answer?.selectedOptionId ?? answer?.optionId ?? answer?.answer ?? answer?.value ?? answer;
}

/** Scores a placement attempt without saving or awarding anything. */
export function scorePlacement(answers = {}) {
  const results = PLACEMENT_QUESTIONS.map((question) => {
    const selectedOptionId = String(answerForQuestion(answers, question.id) || "");
    const correct = selectedOptionId === question.correctOptionId;
    return {
      questionId: question.id,
      selectedOptionId: selectedOptionId || null,
      correct,
      score: correct ? question.weight : 0,
      possibleScore: question.weight,
      explanation: question.explanation,
      reference: question.reference,
    };
  });
  const score = results.reduce((total, result) => total + result.score, 0);
  const correctCount = results.filter((result) => result.correct).length;
  const level = getPlacementLevel(score);

  return {
    score,
    maxScore: PLACEMENT_MAX_SCORE,
    percent: Math.round((score / PLACEMENT_MAX_SCORE) * 100),
    correctCount,
    totalQuestions: PLACEMENT_QUESTIONS.length,
    level,
    recommendedChapterId: level.startChapterId,
    results,
  };
}

/** Saves the result in the adaptive namespace only and unlocks prior chapters. */
export function completePlacement(answers = {}, completedAt = new Date().toISOString()) {
  const result = scorePlacement(answers);
  const unlockedChapterIds = ADAPTIVE_CHAPTERS
    .filter((chapter) => chapter.id <= result.recommendedChapterId)
    .map((chapter) => chapter.id);
  const answerMap = result.results.reduce((next, item) => {
    next[item.questionId] = item.selectedOptionId;
    return next;
  }, {});

  const profile = updateAdaptiveProfile((current) => ({
    ...current,
    placement: {
      status: "complete",
      score: result.score,
      maxScore: result.maxScore,
      correctCount: result.correctCount,
      levelId: result.level.id,
      completedAt,
      answers: answerMap,
    },
    currentChapterId: result.recommendedChapterId,
    unlockedChapterIds: uniqueNumbers([...current.unlockedChapterIds, ...unlockedChapterIds]),
  }));

  return { ...result, profile };
}

/** A gentle opt-out that starts the learner at the beginning without a score. */
export function skipPlacement(completedAt = new Date().toISOString()) {
  const level = PLACEMENT_LEVELS[0];
  return updateAdaptiveProfile((current) => ({
    ...current,
    placement: {
      status: "complete",
      score: 0,
      maxScore: PLACEMENT_MAX_SCORE,
      correctCount: 0,
      levelId: level.id,
      completedAt,
      answers: {},
    },
    currentChapterId: 1,
    unlockedChapterIds: uniqueNumbers([...current.unlockedChapterIds, 1]),
  }));
}

export function shouldShowPlacementQuiz(user = getUser()) {
  return getAdaptiveProfile(user).placement.status !== "complete";
}

export function getAnchorAyahNumbers(surahOrId) {
  const surah = typeof surahOrId === "object" ? surahOrId : SURAH_BY_ID.get(Number(surahOrId));
  const ayahCount = asPositiveInteger(surah?.ayahCount);
  if (!ayahCount) return [];
  if (ayahCount <= 12) return Array.from({ length: ayahCount }, (_, index) => index + 1);
  if (ayahCount <= 30) return uniqueNumbers([1, 2, 3, Math.ceil(ayahCount / 2), ayahCount]);
  if (ayahCount <= 60) return uniqueNumbers([1, 2, Math.ceil(ayahCount / 3), Math.ceil((ayahCount * 2) / 3), ayahCount - 1, ayahCount]);
  return uniqueNumbers([1, 2, 3, Math.ceil(ayahCount / 4), Math.ceil(ayahCount / 2), Math.ceil((ayahCount * 3) / 4), ayahCount]);
}

export function getChapterAnchorAyahIds(chapterOrId) {
  const chapter = typeof chapterOrId === "object" ? chapterOrId : getChapterById(chapterOrId);
  if (!chapter) return [];
  return chapter.surahIds.flatMap((surahId) => getAnchorAyahNumbers(surahId).map((ayahNumber) => `${surahId}-${ayahNumber}`));
}

export function getChapterAyahIds(chapterOrId) {
  const chapter = typeof chapterOrId === "object" ? chapterOrId : getChapterById(chapterOrId);
  if (!chapter) return [];
  return chapter.surahIds.flatMap((surahId) => {
    const ayahCount = SURAH_BY_ID.get(surahId)?.ayahCount || 0;
    return Array.from({ length: ayahCount }, (_, index) => `${surahId}-${index + 1}`);
  });
}

function masteredAyahSet(user) {
  return new Set((user?.ayahsMastered || []).map(validAyahId).filter(Boolean));
}

export function getChapterProgress(user = getUser(), chapterOrId) {
  const chapter = typeof chapterOrId === "object" ? chapterOrId : getChapterById(chapterOrId);
  if (!chapter) {
    return { chapter: undefined, anchorComplete: 0, anchorTotal: 0, anchorPercent: 0, masteredAyahs: 0, ayahTotal: 0, fullPercent: 0, complete: false };
  }

  const mastered = masteredAyahSet(user);
  const anchorIds = getChapterAnchorAyahIds(chapter);
  const allAyahIds = getChapterAyahIds(chapter);
  const anchorComplete = anchorIds.filter((id) => mastered.has(id)).length;
  const masteredAyahs = allAyahIds.filter((id) => mastered.has(id)).length;
  const anchorPercent = anchorIds.length ? Math.round((anchorComplete / anchorIds.length) * 100) : 0;
  const fullPercent = allAyahIds.length ? Math.round((masteredAyahs / allAyahIds.length) * 100) : 0;
  return {
    chapter,
    anchorComplete,
    anchorTotal: anchorIds.length,
    anchorPercent,
    masteredAyahs,
    ayahTotal: allAyahIds.length,
    fullPercent,
    complete: anchorIds.length > 0 && anchorComplete === anchorIds.length,
  };
}

export function isChapterComplete(user = getUser(), chapterOrId) {
  return getChapterProgress(user, chapterOrId).complete;
}

/**
 * A chapter unlocks when the previous chapter's anchor ayahs are mastered.
 * Placement can additionally open early chapters so returning learners do not
 * have to repeat a level they already know.
 */
export function getChapterUnlockState(user = getUser(), chapterOrId) {
  const chapter = typeof chapterOrId === "object" ? chapterOrId : getChapterById(chapterOrId);
  if (!chapter) return { unlocked: false, reason: "This chapter does not exist.", chapter: undefined };
  const profile = getAdaptiveProfile(user);
  const placementUnlocked = new Set(profile.unlockedChapterIds || []);
  const previous = getChapterById(chapter.id - 1);
  const unlockedByProgress = chapter.id === 1 || Boolean(previous && isChapterComplete(user, previous));
  const unlocked = placementUnlocked.has(chapter.id) || unlockedByProgress;

  return {
    chapter,
    unlocked,
    unlockedBy: placementUnlocked.has(chapter.id) ? "placement" : unlockedByProgress ? "progress" : null,
    reason: unlocked ? "Ready to explore." : `Master the ${previous?.title || "previous chapter"} anchor ayahs to unlock this chapter.`,
    previousChapter: previous,
    previousProgress: previous ? getChapterProgress(user, previous) : null,
  };
}

export function getUnlockedChapters(user = getUser()) {
  return ADAPTIVE_CHAPTERS.filter((chapter) => getChapterUnlockState(user, chapter).unlocked);
}

/** Persists only automatically-earned chapter unlocks to the adaptive namespace. */
export function synchronizeChapterUnlocks(user = getUser()) {
  const unlockedChapterIds = getUnlockedChapters(user).map((chapter) => chapter.id);
  return updateAdaptiveProfile((current) => ({
    ...current,
    unlockedChapterIds: uniqueNumbers([...current.unlockedChapterIds, ...unlockedChapterIds]),
    completedChapterIds: uniqueNumbers([
      ...current.completedChapterIds,
      ...ADAPTIVE_CHAPTERS.filter((chapter) => isChapterComplete(user, chapter)).map((chapter) => chapter.id),
    ]),
  }));
}

export function setCurrentAdaptiveChapter(chapterId, user = getUser()) {
  const state = getChapterUnlockState(user, chapterId);
  if (!state.unlocked) return { saved: false, reason: state.reason, profile: getAdaptiveProfile(user) };
  const profile = updateAdaptiveProfile({ currentChapterId: state.chapter.id });
  return { saved: true, reason: "Chapter selected.", profile };
}

function parseAyahId(ayahId) {
  const normalized = validAyahId(ayahId);
  if (!normalized) return undefined;
  const [surahId, ayahNumber] = normalized.split("-").map(Number);
  const surah = getSurahForAdaptivePath(surahId);
  return { id: normalized, surahId, ayahNumber, surah };
}

function missionForAyah(ayahId, chapter, type = "learn", reason = "Continue your current chapter.") {
  const ayah = parseAyahId(ayahId);
  if (!ayah || !chapter) return null;
  return {
    id: ayah.id,
    missionId: ayah.id,
    type,
    reason,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    difficulty: chapter.difficulty,
    surahId: ayah.surahId,
    ayahNumber: ayah.ayahNumber,
    surahName: ayah.surah?.name || `Surah ${ayah.surahId}`,
    surahTranslation: ayah.surah?.translation || "",
    href: `/cosmic/lessons/${ayah.surahId}/${ayah.ayahNumber}`,
  };
}

function findFirstUnmastered(ids, mastered) {
  return ids.find((id) => !mastered.has(id));
}

function chapterForAyahId(ayahId) {
  const [surahId] = String(ayahId).split("-").map(Number);
  return ADAPTIVE_CHAPTERS.find((chapter) => chapter.surahIds.includes(surahId));
}

function orderedUnlockedChapters(user, profile) {
  const unlocked = getUnlockedChapters(user);
  const selected = unlocked.find((chapter) => chapter.id === profile.currentChapterId);
  return selected ? [selected, ...unlocked.filter((chapter) => chapter.id !== selected.id)] : unlocked;
}

/**
 * Returns the next useful lesson without mutating progress:
 * 1. an existing weak ayah in an unlocked chapter,
 * 2. an unmastered chapter anchor ayah,
 * 3. the next unmastered ayah for optional full coverage,
 * 4. an explicit completion state when everything available is complete.
 */
export function getNextAdaptiveMission(user = getUser()) {
  const profile = getAdaptiveProfile(user);
  const mastered = masteredAyahSet(user);
  const chapters = orderedUnlockedChapters(user, profile);
  const unlockedIds = new Set(chapters.map((chapter) => chapter.id));
  const weakAyahs = (user?.weakAyahs || []).map(validAyahId).filter(Boolean);

  const weakAyah = weakAyahs.find((ayahId) => {
    const chapter = chapterForAyahId(ayahId);
    return chapter && unlockedIds.has(chapter.id) && !mastered.has(ayahId);
  });
  if (weakAyah) {
    const chapter = chapterForAyahId(weakAyah);
    return missionForAyah(weakAyah, chapter, "review", "A quick review here will strengthen your recall.");
  }

  for (const chapter of chapters) {
    const anchorAyah = findFirstUnmastered(getChapterAnchorAyahIds(chapter), mastered);
    if (anchorAyah) return missionForAyah(anchorAyah, chapter, "anchor", "This is a key ayah for unlocking the next chapter.");
  }

  for (const chapter of chapters) {
    const nextAyah = findFirstUnmastered(getChapterAyahIds(chapter), mastered);
    if (nextAyah) return missionForAyah(nextAyah, chapter, "explore", "Keep building full-surah mastery at your own pace.");
  }

  const nextLocked = ADAPTIVE_CHAPTERS.find((chapter) => !unlockedIds.has(chapter.id));
  if (nextLocked) {
    return {
      id: `unlock-${nextLocked.id}`,
      type: "chapter-unlock",
      chapterId: nextLocked.id,
      chapterTitle: nextLocked.title,
      difficulty: nextLocked.difficulty,
      reason: getChapterUnlockState(user, nextLocked).reason,
      href: "/cosmic/path",
    };
  }

  return {
    id: "all-available-complete",
    type: "celebration",
    reason: "Your available pathway is complete. Revisit a chapter or take a review session.",
    href: "/cosmic/review",
  };
}

/**
 * Stores attempt telemetry for the adaptive UI only. It intentionally does
 * not call markAyahMastered, addXP, or modify weak-ayahs; the existing lesson
 * and review systems remain the source of truth for those systems.
 */
export function recordAdaptiveMissionAttempt(missionOrAyahId, outcome = {}, attemptedAt = new Date().toISOString()) {
  const ayahId = validAyahId(typeof missionOrAyahId === "object" ? missionOrAyahId?.missionId || missionOrAyahId?.id : missionOrAyahId);
  if (!ayahId) return getAdaptiveProfile();
  const correct = Boolean(outcome.correct);

  return updateAdaptiveProfile((current) => {
    const previous = current.missionHistory[ayahId] || { attempts: 0, correctAttempts: 0, lastResult: null, lastAttemptAt: null };
    return {
      ...current,
      missionHistory: {
        ...current.missionHistory,
        [ayahId]: {
          attempts: previous.attempts + 1,
          correctAttempts: previous.correctAttempts + (correct ? 1 : 0),
          lastResult: correct ? "correct" : "incorrect",
          lastAttemptAt: attemptedAt,
        },
      },
      lastRecommendationAt: attemptedAt,
    };
  });
}

/** Removes only the adaptive curriculum state; existing user progress remains untouched. */
export function resetAdaptivePath() {
  const profile = createAdaptiveProfile();
  updateUser({ [ADAPTIVE_PROFILE_FIELD]: profile });
  return profile;
}
