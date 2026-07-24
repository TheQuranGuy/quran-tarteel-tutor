"use client";

export default function SettingsSlider({ label, description, value, min = 0, max = 100, step = 1, suffix = "%", onChange }) {
  return <label style={{ display: "grid", gap: 8 }}><span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span><strong style={{ display: "block", color: "#edf7ff" }}>{label}</strong>{description ? <small style={{ color: "#aebfda" }}>{description}</small> : null}</span><strong style={{ color: "#ffdd8a" }}>{value}{suffix}</strong></span><input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} style={{ width: "100%", accentColor: "#86e6ca" }} /></label>;
}
