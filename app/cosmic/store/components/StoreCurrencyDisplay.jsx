"use client";

export default function StoreCurrencyDisplay({ crystals, premium = false }) {
  return <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}><span style={{ padding: "9px 11px", borderRadius: 12, color: "#ffe79c", background: "rgba(221,168,54,.15)", border: "1px solid rgba(255,222,131,.26)", fontWeight: 900 }}>✦ {crystals} Crystals</span>{premium ? <span style={{ padding: "9px 11px", borderRadius: 12, color: "#dcefff", background: "rgba(151,111,255,.18)", border: "1px solid rgba(194,165,255,.32)", fontWeight: 900 }}>Quran Tarteel+</span> : null}</div>;
}
