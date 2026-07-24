"use client";

import SettingsSlider from "./SettingsSlider";
import SettingsToggle from "./SettingsToggle";

export default function SettingsAudio({ settings, onChange }) {
  return <div style={{ display: "grid", gap: 15 }}><SettingsSlider label="Recitation volume" description="Applies to open audio players." value={settings.recitationVolume} onChange={(value) => onChange("recitationVolume", value)} /><SettingsSlider label="UI sound volume" description="Sets your preferred interface sound level." value={settings.uiVolume} onChange={(value) => onChange("uiVolume", value)} /><SettingsToggle label="Mute all audio" description="Silence active recitation and interface sounds." checked={settings.muteAudio} onChange={(value) => onChange("muteAudio", value)} /></div>;
}
