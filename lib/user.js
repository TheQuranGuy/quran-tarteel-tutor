const userKey = "sheikhduo-user";
const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultUser = {
  xp: 0,
  streak: 0,
  dailyGoal: 10,
  dailyXp: 0,
  dailyXpDate: todayKey(),
  lastActive: "",
  surahsCompleted: [],
  ayahsMastered: [],
  ayahsListened: [],
  preferredReciter: "alafasy",
  preferredTranslation: "en.sahih",
  preferredTheme: "space",
  notificationPreference: "unset",
  lastSurahId: 1,
  weakAyahs: [],
};

function emitUserChange(user) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("sheikhduo-user-changed", { detail: user }));
  window.dispatchEvent(new Event("sheikhduo-xp-changed"));
}

function emitXpPop(amount, label) {
  if (typeof window === "undefined" || !amount) return;
  window.dispatchEvent(new CustomEvent("sheikhduo-xp-pop", { detail: { amount, label } }));
}

function saveUser(user, notify = true) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(userKey, JSON.stringify(user));
    if (notify) emitUserChange(user);
  }
  return user;
}

function normalizeUser(user) {
  const merged = { ...defaultUser, ...(user || {}) };
  const today = todayKey();
  if (merged.dailyXpDate !== today) {
    merged.dailyXp = 0;
    merged.dailyXpDate = today;
  }
  return merged;
}

export function getUser() {
  if (typeof window === "undefined") return defaultUser;
  try {
    return normalizeUser(JSON.parse(window.localStorage.getItem(userKey) || "null"));
  } catch {
    return defaultUser;
  }
}

export function updateUser(updates) {
  const current = getUser();
  const next = typeof updates === "function" ? updates(current) : { ...current, ...updates };
  return saveUser(normalizeUser(next));
}

export function addXP(amount, label = "XP") {
  const reward = Number(amount || 0);
  const user = getUser();
  user.xp = Math.max(0, user.xp + reward);
  user.dailyXp = Math.max(0, (user.dailyXp || 0) + reward);
  user.dailyXpDate = todayKey();
  saveUser(user);
  if (reward > 0) emitXpPop(reward, label);
  return user.xp;
}

export function incrementStreak() {
  return updateUser((user) => ({ ...user, streak: user.streak + 1, lastActive: todayKey() }));
}

export function resetStreak() {
  return updateUser((user) => ({ ...user, streak: 0, lastActive: todayKey() }));
}

export function setDailyGoal(goal) {
  const allowedGoals = [5, 10, 20, 50];
  const dailyGoal = allowedGoals.includes(Number(goal)) ? Number(goal) : 10;
  return updateUser({ dailyGoal });
}

export function markSurahCompleted(id) {
  const surahId = Number(id);
  const user = getUser();
  if (!user.surahsCompleted.includes(surahId)) {
    user.surahsCompleted.push(surahId);
    user.lastSurahId = surahId;
    saveUser(user);
    addXP(25, "Surah complete");
  }
  return getUser();
}

export function markAyahMastered(id) {
  const ayahId = String(id);
  const user = getUser();
  if (!user.ayahsMastered.includes(ayahId)) {
    user.ayahsMastered.push(ayahId);
    user.weakAyahs = user.weakAyahs.filter((item) => String(item) !== ayahId);
    saveUser(user);
    addXP(10, "Ayah mastered");
  }
  return getUser();
}

export function markAyahListened(id) {
  const ayahId = String(id);
  const user = getUser();
  if (!user.ayahsListened.includes(ayahId)) {
    user.ayahsListened.push(ayahId);
    saveUser(user);
    addXP(5, "Ayah listened");
  }
  return getUser();
}

export function startUserSession() {
  const user = getUser();
  const today = todayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (user.lastActive === today) {
    return saveUser(user);
  }

  if (user.lastActive === yesterday) {
    user.streak += 1;
  } else if (user.lastActive) {
    user.streak = 0;
  }

  user.lastActive = today;
  user.dailyXp = user.dailyXpDate === today ? user.dailyXp : 0;
  user.dailyXpDate = today;
  saveUser(user);

  if (user.streak === 7) addXP(50, "7 day streak");
  if (user.streak === 30) addXP(100, "30 day streak");

  return getUser();
}

export function setNotificationPreference(value) {
  return updateUser({ notificationPreference: value });
}
