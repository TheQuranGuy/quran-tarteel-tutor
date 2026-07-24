"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../lib/user";

export const COSMIC_EMPTY_USER = Object.freeze({
  xp: 0,
  streak: 0,
  dailyGoal: 10,
  dailyXp: 0,
  ayahsMastered: [],
  weakAyahs: [],
  surahsCompleted: [],
  cosmicGuide: "",
  username: "",
});

export function useCosmicUser() {
  const [user, setUser] = useState(COSMIC_EMPTY_USER);

  useEffect(() => {
    const refresh = () => setUser(getUser());
    refresh();
    window.addEventListener("sheikhduo-user-changed", refresh);
    return () => window.removeEventListener("sheikhduo-user-changed", refresh);
  }, []);

  return user;
}
