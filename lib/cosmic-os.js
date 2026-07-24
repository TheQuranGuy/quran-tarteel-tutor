import { COSMIC_UNITS, getCosmicAyah, getCosmicUnit } from "./cosmic";

export const COSMIC_OS_STORAGE_KEY = "sheikhduo-cosmic-os-v1";
export const COSMIC_OS_EVENT = "sheikhduo-cosmic-os-changed";
export const COSMIC_OS_VERSION = 1;

const DAY_MS = 86_400_000;
const MAX_ATTEMPTS = 240;

export const COSMIC_OS_EMPTY_ANALYTICS = Object.freeze({
  version: COSMIC_OS_VERSION,
  attempts: Object.freeze([]),
  updatedAt: "",
});

function isBrowser() {
  return typeof window !== "undefined";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normaliseAyahId(value) {
  const [surah, ayah] = String(value || "").split("-").map(Number);
  if (!Number.isInteger(surah) || !Number.isInteger(ayah) || surah < 1 || ayah < 1) return "";
  return `${surah}-${ayah}`;
}

function normaliseTimestamp(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
}

function normaliseAttempt(value) {
  if (!isPlainObject(value)) return null;
  const ayahId = normaliseAyahId(value.ayahId);
  if (!ayahId) return null;

  const kind = ["answer", "listen", "read", "memorise", "hint", "review"].includes(value.kind)
    ? value.kind
    : "answer";
  const correct = typeof value.correct === "boolean" ? value.correct : null;

  return {
    id: String(value.id || `${ayahId}-${value.timestamp || "saved"}`),
    ayahId,
    kind,
    correct,
    mode: String(value.mode || "lesson").slice(0, 40),
    durationMs: Math.max(0, Math.round(toNumber(value.durationMs))),
    timestamp: normaliseTimestamp(value.timestamp),
  };
}

function normaliseAnalytics(value) {
  const attempts = Array.isArray(value?.attempts)
    ? value.attempts.map(normaliseAttempt).filter(Boolean).slice(-MAX_ATTEMPTS)
    : [];

  return {
    version: COSMIC_OS_VERSION,
    attempts,
    updatedAt: normaliseTimestamp(value?.updatedAt),
  };
}

function resolveAnalytics(value) {
  return value ? normaliseAnalytics(value) : getCosmicAnalytics();
}

function resolveUnits(units) {
  return Array.isArray(units) && units.length ? units : COSMIC_UNITS;
}

function getAyahFromUnits(ayahId, units) {
  const normalised = normaliseAyahId(ayahId);
  if (!normalised) return undefined;
  if (units === COSMIC_UNITS) return getCosmicAyah(normalised);
  const [surahId, ayahNumber] = normalised.split("-").map(Number);
  return units.find((unit) => Number(unit.id) === surahId)?.ayahs?.[ayahNumber - 1];
}

function getRecentAnswers(analytics, ayahId, limit = 12) {
  const normalisedId = ayahId ? normaliseAyahId(ayahId) : "";
  return analytics.attempts
    .filter((attempt) => attempt.kind === "answer" && typeof attempt.correct === "boolean")
    .filter((attempt) => !normalisedId || attempt.ayahId === normalisedId)
    .slice(-limit);
}

function answerStats(attempts) {
  const total = attempts.length;
  const correct = attempts.reduce((count, attempt) => count + (attempt.correct ? 1 : 0), 0);
  const durationMs = attempts.reduce((totalDuration, attempt) => totalDuration + attempt.durationMs, 0);
  return {
    total,
    correct,
    accuracy: total ? Math.round((correct / total) * 100) : null,
    averageDurationMs: total ? Math.round(durationMs / total) : 0,
  };
}

function dateFromIso(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function firstUnmasteredAyah(user, units) {
  const mastered = new Set((user?.ayahsMastered || []).map(String));
  const preferredSurah = Number(user?.lastSurahId);
  const ordered = preferredSurah
    ? [...units.filter((unit) => Number(unit.id) === preferredSurah), ...units.filter((unit) => Number(unit.id) !== preferredSurah)]
    : units;

  for (const unit of ordered) {
    const candidate = unit.ayahs?.find((ayah) => !mastered.has(String(ayah.id)));
    if (candidate) return { ayah: candidate, unit };
  }

  return null;
}

function formatInterval(days) {
  if (days < 1) return "later today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

export function getCosmicAnalytics() {
  if (!isBrowser()) return COSMIC_OS_EMPTY_ANALYTICS;

  try {
    return normaliseAnalytics(JSON.parse(window.localStorage.getItem(COSMIC_OS_STORAGE_KEY) || "null"));
  } catch {
    return COSMIC_OS_EMPTY_ANALYTICS;
  }
}

export function saveCosmicAnalytics(value) {
  const analytics = normaliseAnalytics(value);
  const next = { ...analytics, updatedAt: new Date().toISOString() };

  if (!isBrowser()) return next;

  try {
    window.localStorage.setItem(COSMIC_OS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  window.dispatchEvent(new CustomEvent(COSMIC_OS_EVENT, { detail: next }));
  return next;
}

export function updateCosmicAnalytics(update) {
  const current = getCosmicAnalytics();
  const next = typeof update === "function" ? update(current) : { ...current, ...update };
  return saveCosmicAnalytics(next);
}

export function recordCosmicAttempt({ ayahId, correct, kind = "answer", mode = "lesson", durationMs = 0 } = {}) {
  const normalisedAyahId = normaliseAyahId(ayahId);
  if (!normalisedAyahId) return getCosmicAnalytics();

  const timestamp = new Date().toISOString();
  const attempt = normaliseAttempt({
    id: `${normalisedAyahId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ayahId: normalisedAyahId,
    correct,
    kind,
    mode,
    durationMs,
    timestamp,
  });

  return updateCosmicAnalytics((analytics) => ({
    ...analytics,
    attempts: [...analytics.attempts, attempt].slice(-MAX_ATTEMPTS),
  }));
}

export function resetCosmicAnalytics() {
  if (isBrowser()) {
    try {
      window.localStorage.removeItem(COSMIC_OS_STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new CustomEvent(COSMIC_OS_EVENT, { detail: COSMIC_OS_EMPTY_ANALYTICS }));
  }
  return COSMIC_OS_EMPTY_ANALYTICS;
}

export function deriveMasteryGaps(user = {}, units = COSMIC_UNITS, { limit = 6 } = {}) {
  const sourceUnits = resolveUnits(units);
  const mastered = new Set((user?.ayahsMastered || []).map(String));
  const weak = new Set((user?.weakAyahs || []).map(String));
  let totalAyahs = 0;
  let masteredAyahs = 0;
  let weakAyahs = 0;

  const all = sourceUnits.map((unit) => {
    const ayahs = Array.isArray(unit.ayahs) ? unit.ayahs : [];
    let complete = 0;
    let weakCount = 0;

    for (const ayah of ayahs) {
      const id = String(ayah.id);
      if (mastered.has(id)) complete += 1;
      if (weak.has(id)) weakCount += 1;
    }

    totalAyahs += ayahs.length;
    masteredAyahs += complete;
    weakAyahs += weakCount;
    const percent = ayahs.length ? Math.round((complete / ayahs.length) * 100) : 0;
    const started = complete > 0 || weakCount > 0;
    const urgency = weakCount
      ? Math.min(100, 48 + weakCount * 11 + Math.round((100 - percent) * 0.22))
      : started && percent < 100
        ? Math.min(80, 12 + Math.round((100 - percent) * 0.4))
        : 0;

    return {
      id: Number(unit.id),
      name: unit.name,
      theme: unit.theme,
      total: ayahs.length,
      mastered: complete,
      weak: weakCount,
      percent,
      started,
      urgency,
      nextAyah: ayahs.find((ayah) => !mastered.has(String(ayah.id))) || null,
    };
  });

  const active = all.filter((gap) => gap.urgency > 0).sort((left, right) => right.urgency - left.urgency || left.id - right.id);
  const first = firstUnmasteredAyah(user, sourceUnits);

  return {
    totalAyahs,
    masteredAyahs,
    weakAyahs,
    masteryPercent: totalAyahs ? Math.max(0, Math.round(((masteredAyahs - weakAyahs) / totalAyahs) * 100)) : 0,
    gaps: active.slice(0, Math.max(1, limit)),
    nextGap: active[0] || (first ? {
      id: Number(first.unit.id),
      name: first.unit.name,
      theme: first.unit.theme,
      total: first.unit.ayahs?.length || 0,
      mastered: 0,
      weak: 0,
      percent: 0,
      started: false,
      urgency: 0,
      nextAyah: first.ayah,
    } : null),
  };
}

export const getMasteryGaps = deriveMasteryGaps;

export function deriveReviewInterval(user = {}, ayahId, analytics, { now = Date.now() } = {}) {
  const normalisedAyahId = normaliseAyahId(ayahId);
  const profile = user || {};
  const source = resolveAnalytics(analytics);
  const attempts = getRecentAnswers(source, normalisedAyahId, 6);
  const stats = answerStats(attempts);
  const weak = new Set((profile.weakAyahs || []).map(String)).has(normalisedAyahId);
  const last = attempts.at(-1);
  const lastAt = dateFromIso(last?.timestamp);

  let days = 3;
  let reason = "A short revisit will help this ayah settle into memory.";
  if (weak || last?.correct === false) {
    days = 1;
    reason = "A recent struggle is best revisited tomorrow.";
  } else if (!stats.total) {
    days = 1;
    reason = "A first check-in tomorrow will reinforce a new ayah.";
  } else if (stats.accuracy < 60) {
    days = 1;
    reason = "A gentle daily review will build confidence.";
  } else if (stats.accuracy < 80) {
    days = 3;
    reason = "A three-day interval balances practice and recall.";
  } else if (stats.total >= 5 && stats.accuracy >= 90) {
    days = 21;
    reason = "Strong recall earns a longer spaced-repetition interval.";
  } else if (stats.accuracy >= 85) {
    days = 10;
    reason = "Reliable recall can be checked again after a longer pause.";
  } else {
    days = 7;
    reason = "A weekly recall check protects steady progress.";
  }

  const nextReviewAt = lastAt ? new Date(lastAt + days * DAY_MS).toISOString() : new Date(now).toISOString();
  const due = !lastAt || lastAt + days * DAY_MS <= now;

  return {
    ayahId: normalisedAyahId,
    days,
    label: formatInterval(days),
    nextReviewAt,
    due,
    urgency: weak || due ? "high" : days <= 3 ? "medium" : "low",
    reason,
    accuracy: stats.accuracy,
    attempts: stats.total,
  };
}

export const getReviewInterval = deriveReviewInterval;

export function getReviewQueue(user = {}, analytics, units = COSMIC_UNITS, { limit = 5, now = Date.now() } = {}) {
  const sourceUnits = resolveUnits(units);
  const weakIds = [...new Set((user?.weakAyahs || []).map(normaliseAyahId).filter(Boolean))];
  const queue = weakIds
    .map((ayahId) => {
      const ayah = getAyahFromUnits(ayahId, sourceUnits);
      if (!ayah) return null;
      const interval = deriveReviewInterval(user, ayahId, analytics, { now });
      const unit = getCosmicUnit(ayahId.split("-")[0]) || sourceUnits.find((item) => Number(item.id) === Number(ayahId.split("-")[0]));
      return { ayah, unit, ...interval };
    })
    .filter(Boolean)
    .sort((left, right) => Number(right.due) - Number(left.due) || dateFromIso(left.nextReviewAt) - dateFromIso(right.nextReviewAt));

  return queue.slice(0, Math.max(1, limit));
}

export function deriveAdaptiveDifficulty(user = {}, analytics, units = COSMIC_UNITS, { ayahId } = {}) {
  const source = resolveAnalytics(analytics);
  const gaps = deriveMasteryGaps(user, units, { limit: 1 });
  const focusedAnswers = getRecentAnswers(source, ayahId, 10);
  const answers = focusedAnswers.length ? focusedAnswers : getRecentAnswers(source, "", 12);
  const stats = answerStats(answers);
  const weakRatio = gaps.totalAyahs ? gaps.weakAyahs / gaps.totalAyahs : 0;
  const hasFocusedWeakness = ayahId && new Set((user?.weakAyahs || []).map(String)).has(String(ayahId));
  const mastery = gaps.masteryPercent;

  let level = "guided";
  if (hasFocusedWeakness || (stats.total >= 3 && stats.accuracy < 60) || weakRatio >= 0.035) level = "foundation";
  else if (stats.total >= 4 && stats.accuracy >= 90 && mastery >= 5) level = "challenge";
  else if ((stats.total >= 3 && stats.accuracy >= 75) || mastery >= 2) level = "flow";

  const profiles = {
    foundation: {
      label: "Foundation orbit",
      description: "Short prompts, visible translation, and supportive hints.",
      hints: "generous",
      pace: "unhurried",
      questionCount: 2,
      choices: 2,
      color: "#8debd1",
    },
    guided: {
      label: "Guided orbit",
      description: "A balanced path with a clue available when you need it.",
      hints: "available",
      pace: "steady",
      questionCount: 3,
      choices: 3,
      color: "#9ecbff",
    },
    flow: {
      label: "Flow orbit",
      description: "Fewer prompts and more active recall to grow confidence.",
      hints: "light",
      pace: "focused",
      questionCount: 4,
      choices: 4,
      color: "#d6a6ff",
    },
    challenge: {
      label: "Challenge orbit",
      description: "Strong recall unlocks deeper questions and longer intervals.",
      hints: "minimal",
      pace: "brisk",
      questionCount: 5,
      choices: 4,
      color: "#ffd981",
    },
  };

  return {
    level,
    ...profiles[level],
    accuracy: stats.accuracy,
    attempts: stats.total,
    mastery,
    weakAyahs: gaps.weakAyahs,
    averageDurationMs: stats.averageDurationMs,
    transparentReason: hasFocusedWeakness
      ? "This ayah is marked for review, so the path starts gently."
      : stats.total
        ? `Your recent accuracy is ${stats.accuracy}%, so the lesson is set to ${profiles[level].pace} pacing.`
        : "You have no saved answer history yet, so the path begins in a balanced guided mode.",
  };
}

export const getAdaptiveDifficulty = deriveAdaptiveDifficulty;

export function deriveRecommendation(user = {}, analytics, units = COSMIC_UNITS, { gaps, reviewQueue, difficulty } = {}) {
  const sourceUnits = resolveUnits(units);
  const resolvedGaps = gaps || deriveMasteryGaps(user, sourceUnits, { limit: 1 });
  const resolvedQueue = reviewQueue || getReviewQueue(user, analytics, sourceUnits, { limit: 1 });
  const resolvedDifficulty = difficulty || deriveAdaptiveDifficulty(user, analytics, sourceUnits);
  const dailyGoal = Math.max(1, toNumber(user?.dailyGoal, 10));
  const dailyXp = Math.max(0, toNumber(user?.dailyXp));
  const dueReview = resolvedQueue[0];

  if (dueReview) {
    return {
      kind: "review",
      title: "Restore a memory star",
      description: `${dueReview.unit?.name || "This ayah"} is ready for a focused recall session.`,
      actionLabel: "Start review",
      href: "/cosmic/review",
      ayahId: dueReview.ayah.id,
      unitId: Number(dueReview.unit?.id),
      accent: "#c7a6ff",
      reason: dueReview.reason,
      difficulty: resolvedDifficulty.level,
    };
  }

  const next = firstUnmasteredAyah(user, sourceUnits);
  if (next && dailyXp < dailyGoal) {
    return {
      kind: "lesson",
      title: "Continue your constellation",
      description: `Next up: ${next.unit.name}, Ayah ${next.ayah.number}.`,
      actionLabel: "Continue lesson",
      href: `/cosmic/lessons/${next.unit.id}/${next.ayah.number}`,
      ayahId: next.ayah.id,
      unitId: Number(next.unit.id),
      accent: "#8debd1",
      reason: dailyXp ? `${dailyGoal - dailyXp} XP remains in today's goal.` : "A fresh ayah is ready to become part of your path.",
      difficulty: resolvedDifficulty.level,
    };
  }

  if (resolvedGaps.nextGap?.nextAyah) {
    const { nextGap } = resolvedGaps;
    return {
      kind: "mastery",
      title: "Strengthen an active surah",
      description: `${nextGap.name} is your most active learning orbit.`,
      actionLabel: "Open surah path",
      href: "/cosmic/path",
      ayahId: nextGap.nextAyah.id,
      unitId: nextGap.id,
      accent: "#9ecbff",
      reason: `${nextGap.percent}% of this surah is currently mastered.`,
      difficulty: resolvedDifficulty.level,
    };
  }

  return {
    kind: "challenge",
    title: "Take the cosmic trial",
    description: "Your current path is clear - test your recall in today's challenge.",
    actionLabel: "Open challenge",
    href: "/cosmic/challenge",
    ayahId: "",
    unitId: 0,
    accent: "#ffd981",
    reason: "A short challenge is a good next step when no review is due.",
    difficulty: resolvedDifficulty.level,
  };
}

export const getCosmicRecommendation = deriveRecommendation;

export function deriveCompanionMessage(user = {}, insight) {
  const recommendation = insight?.recommendation;
  const dailyGoal = Math.max(1, toNumber(user?.dailyGoal, 10));
  const dailyXp = Math.max(0, toNumber(user?.dailyXp));

  if (dailyXp >= dailyGoal) {
    return {
      mood: "celebrate",
      eyebrow: "DAILY GOAL COMPLETE",
      title: "Your constellation is glowing.",
      message: "You reached today's learning goal. Keep exploring if you feel ready, or let the progress settle with a gentle review tomorrow.",
    };
  }

  if (recommendation?.kind === "review") {
    return {
      mood: "protective",
      eyebrow: "MEMORY SIGNAL",
      title: "Let's bring one ayah back into focus.",
      message: recommendation.reason,
    };
  }

  if (recommendation?.kind === "lesson") {
    return {
      mood: "curious",
      eyebrow: "NEXT ORBIT",
      title: "A new memory fragment is waiting.",
      message: recommendation.reason,
    };
  }

  return {
    mood: "calm",
    eyebrow: "COSMIC GUIDE",
    title: "Your path is ready when you are.",
    message: recommendation?.reason || "We can choose the next step together.",
  };
}

export function getCosmicOSInsight(user = {}, analytics, units = COSMIC_UNITS) {
  const source = resolveAnalytics(analytics);
  const gaps = deriveMasteryGaps(user, units);
  const reviewQueue = getReviewQueue(user, source, units);
  const difficulty = deriveAdaptiveDifficulty(user, source, units);
  const recommendation = deriveRecommendation(user, source, units, { gaps, reviewQueue, difficulty });

  return {
    analytics: source,
    gaps,
    reviewQueue,
    difficulty,
    recommendation,
    companion: deriveCompanionMessage(user, { gaps, reviewQueue, difficulty, recommendation }),
  };
}

export const getCosmicLearningInsight = getCosmicOSInsight;
