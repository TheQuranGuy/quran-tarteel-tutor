"use client";

import { getCosmicUnit } from "../../../../lib/cosmic";
import WeakAyahCard from "./WeakAyahCard";

export default function WeakAyahList({ ayahs, mastered, onStart }) {
  const groups = ayahs.reduce((result, ayah) => {
    const id = Number(ayah.id.split("-")[0]);
    (result[id] ||= []).push(ayah);
    return result;
  }, {});

  if (!ayahs.length) {
    return <section className="cosmic-review-empty" style={{ padding: 24, border: "1px solid rgba(183,216,255,.18)", borderRadius: 22, color: "#d9e7f7", background: "rgba(255,255,255,.04)" }}><h2 style={{ marginTop: 0 }}>Your review orbit is clear</h2><p style={{ marginBottom: 0, color: "#b6c6df" }}>When an ayah needs reinforcement, it will appear here automatically.</p></section>;
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      {Object.entries(groups).map(([surahId, items]) => {
        const unit = getCosmicUnit(surahId);
        return <div className="cosmic-review-group" key={surahId} style={{ padding: 16, border: "1px solid rgba(183,216,255,.18)", borderRadius: 22, background: "rgba(255,255,255,.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div><strong>{unit?.name || `Surah ${surahId}`}</strong><small style={{ display: "block", marginTop: 3, color: "#b6c6df" }}>{items.length} ayah{items.length === 1 ? "" : "s"} ready</small></div>
            <button type="button" onClick={() => onStart(items)} className="cosmic-button" style={{ border: 0, borderRadius: 12, padding: "10px 13px", cursor: "pointer", color: "#0b2023", background: "#9ff2ca", fontWeight: 900 }}>Start review</button>
          </div>
          <div style={{ display: "grid", gap: 9 }}>{items.map((ayah) => <WeakAyahCard key={ayah.id} ayah={ayah} mastered={mastered.has(ayah.id)} />)}</div>
        </div>;
      })}
    </section>
  );
}
