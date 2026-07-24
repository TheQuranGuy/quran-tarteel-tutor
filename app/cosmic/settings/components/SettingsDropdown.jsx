"use client";

export default function SettingsDropdown({ label, description, value, options, onChange }) {
  return <label style={{ display: "grid", gap: 7 }}><span><strong style={{ display: "block", color: "#edf7ff" }}>{label}</strong>{description ? <small style={{ color: "#aebfda" }}>{description}</small> : null}</span><select value={value} onChange={(event) => onChange(event.target.value)} style={{ width: "100%", padding: "10px 11px", borderRadius: 12, border: "1px solid rgba(181,213,251,.22)", color: "#edf7ff", background: "#14234c", font: "inherit" }}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
