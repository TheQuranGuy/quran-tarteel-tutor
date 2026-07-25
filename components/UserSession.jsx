"use client";

import { useEffect } from "react";
import { getUser, startUserSession } from "../lib/user";
import XPBubble from "./cosmic/XPBubble";

const themeBackgrounds = {
  dark: "radial-gradient(circle at 80% 5%,rgba(121,91,255,.25),transparent 30%),#080f28",
  space: "radial-gradient(circle at 80% 5%,rgba(121,91,255,.25),transparent 30%),#080f28",
  bright: "radial-gradient(circle at 80% 5%,rgba(255,224,136,.28),transparent 30%),#143d59",
  nebula: "radial-gradient(circle at 15% 10%,rgba(234,102,184,.28),transparent 30%),radial-gradient(circle at 80% 70%,rgba(110,105,255,.28),transparent 35%),#130d36",
  emerald: "radial-gradient(circle at 20% 15%,rgba(111,255,188,.22),transparent 32%),radial-gradient(circle at 84% 68%,rgba(91,175,255,.18),transparent 34%),#061b18",
  gold: "radial-gradient(circle at 50% 0%,rgba(255,213,112,.25),transparent 34%),radial-gradient(circle at 88% 72%,rgba(115,226,214,.12),transparent 30%),#171104",
};

function applyTheme(user) {
  if (typeof document === "undefined") return;
  const theme = user?.preferredTheme || "space";
  document.documentElement.dataset.cosmicTheme = theme;
  document.body.style.background = themeBackgrounds[theme] || themeBackgrounds.space;
}

function millisecondsUntilSevenPm() {
  const now = new Date();
  const reminder = new Date();
  reminder.setHours(19, 0, 0, 0);
  if (reminder <= now) reminder.setDate(reminder.getDate() + 1);
  return reminder.getTime() - now.getTime();
}

function scheduleReminder() {
  if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
  window.setTimeout(() => {
    new Notification("Quran Tarteel", { body: "Time to memorise today!" });
    scheduleReminder();
  }, millisecondsUntilSevenPm());
}

export default function UserSession() {
  useEffect(() => {
    applyTheme(startUserSession());
    if (getUser().notificationPreference === "allowed") scheduleReminder();
    const refresh = (event) => applyTheme(event.detail || getUser());
    window.addEventListener("sheikhduo-user-changed", refresh);
    return () => window.removeEventListener("sheikhduo-user-changed", refresh);
  }, []);

  return <XPBubble />;
}
