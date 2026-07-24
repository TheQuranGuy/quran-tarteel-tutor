"use client";

import { setNotificationPreference } from "../lib/user";

function millisecondsUntilSevenPm() {
  const now = new Date();
  const reminder = new Date();
  reminder.setHours(19, 0, 0, 0);
  if (reminder <= now) reminder.setDate(reminder.getDate() + 1);
  return reminder.getTime() - now.getTime();
}

function scheduleReminder() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  window.setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification("Quran Tarteel", { body: "Time to memorise today!" });
    }
    scheduleReminder();
  }, millisecondsUntilSevenPm());
}

export default function NotificationPermissionModal({ open, onClose }) {
  if (!open) return null;

  async function allow() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPreference(permission === "granted" ? "allowed" : "denied");
      if (permission === "granted") scheduleReminder();
    } else {
      setNotificationPreference("unsupported");
    }
    onClose?.();
  }

  function deny() {
    setNotificationPreference("denied");
    onClose?.();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Notification permission">
      <div className="goal-modal notification-modal">
        <p className="eyebrow">Study reminders</p>
        <h2>Allow Quran Tarteel to send reminders?</h2>
        <p className="muted">We will remind you at 7 PM local time: Time to memorise today!</p>
        <div className="button-row">
          <button className="button primary" onClick={allow} type="button">Allow</button>
          <button className="button secondary" onClick={deny} type="button">Don&apos;t Allow</button>
        </div>
      </div>
    </div>
  );
}
