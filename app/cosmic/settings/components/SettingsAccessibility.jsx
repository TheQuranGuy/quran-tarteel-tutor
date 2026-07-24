"use client";

import SettingsSlider from "./SettingsSlider";
import SettingsToggle from "./SettingsToggle";

export default function SettingsAccessibility({ settings, onChange }) {
  return <div style={{ display: "grid", gap: 15 }}><SettingsSlider label="Text size" description="Scales the Quran Tarteel interface text." value={settings.textSize} min={85} max={125} suffix="%" onChange={(value) => onChange("textSize", value)} /><SettingsToggle label="Dyslexia-friendly font" description="Use a wider, easier-to-track reading style." checked={settings.dyslexiaFont} onChange={(value) => onChange("dyslexiaFont", value)} /><SettingsToggle label="High contrast" description="Increase separation between cosmic surfaces." checked={settings.highContrast} onChange={(value) => onChange("highContrast", value)} /></div>;
}
