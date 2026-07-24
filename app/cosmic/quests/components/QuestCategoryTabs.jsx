"use client";

export default function QuestCategoryTabs({ categories, active, onChange }) {
  return <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>{categories.map((category) => <button type="button" key={category} onClick={() => onChange(category)} style={{ flex: "0 0 auto", padding: "9px 13px", borderRadius: 99, border: `1px solid ${active === category ? "#9beeff" : "rgba(176,207,248,.18)"}`, cursor: "pointer", color: active === category ? "#07172d" : "#c5d5eb", background: active === category ? "#9beeff" : "rgba(255,255,255,.05)", fontWeight: 850 }}>{category}</button>)}</div>;
}
