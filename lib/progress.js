import { addXP as addUserXP, getUser, markAyahMastered, updateUser } from "./user";
const key = "sheikhduo-progress"; const base = { xp: 0, completedLessons: [], completedQuizzes: [], memorization: {} };
export function getProgress() { if (typeof window === "undefined") return base; try { return { ...base, ...JSON.parse(window.localStorage.getItem(key) || "null") }; } catch { return base; } }
export function saveProgress(progress) { if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(progress)); return progress; }
export function getXp() { return getUser().xp; }
export function addXp(amount) { return addUserXP(amount, "XP"); }
export function resetXp() { updateUser({ xp: 0, dailyXp: 0 }); return 0; }
export function completeLesson(id, reward) { const progress = getProgress(); if (!progress.completedLessons.includes(id)) { progress.completedLessons.push(id); saveProgress(progress); addXp(reward); } return getProgress(); }
export function awardQuizXp(id, reward) { const progress = getProgress(); if (!progress.completedQuizzes.includes(id)) { progress.completedQuizzes.push(id); saveProgress(progress); addXp(reward); } return getProgress(); }
export function saveMemorizationProgress(id, step, total) { const progress = getProgress(); progress.memorization[id] = { step, total, completed: step >= total, updatedAt: new Date().toISOString() }; return saveProgress(progress); }
export function completeMemorization(id, reward = 10) { const progress = getProgress(); const entry = progress.memorization[id] || {}; if (!entry.xpAwarded) { progress.memorization[id] = { ...entry, completed: true, xpAwarded: true, updatedAt: new Date().toISOString() }; saveProgress(progress); markAyahMastered(id); } return getProgress(); }
