"use client";

import SettingsToggle from "./SettingsToggle";

export default function SettingsNotifications({ settings, onChange }) {
  return <div style={{ display: "grid", gap: 14 }}><SettingsToggle label="Daily goal reminder" description="Keep your daily learning rhythm visible." checked={settings.dailyReminder} onChange={(value) => onChange("dailyReminder", value)} /><SettingsToggle label="Streak alerts" description="Show reminders when your streak needs attention." checked={settings.streakAlerts} onChange={(value) => onChange("streakAlerts", value)} /><SettingsToggle label="Event alerts" description="Hear about new seasonal cosmic events." checked={settings.eventAlerts} onChange={(value) => onChange("eventAlerts", value)} /><SettingsToggle label="Challenge alerts" description="Nudge yourself toward the daily cosmic trial." checked={settings.challengeAlerts} onChange={(value) => onChange("challengeAlerts", value)} /></div>;
}
