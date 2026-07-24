"use client";

import { useEffect } from "react";
import { getUser, startUserSession } from "../lib/user";
import XPBubble from "./cosmic/XPBubble";

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
    startUserSession();
    if (getUser().notificationPreference === "allowed") scheduleReminder();
  }, []);

  return <XPBubble />;
}
