"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import MasteryRing from "./MasteryRing";
import AyahTile from "./AyahTile";
import TreasureChest from "./TreasureChest";

export default function SurahUnit({ unit, progress, expanded, onToggle, masteredAyahs, weakAyahs }) {
  const complete = progress.percent === 100;
  const [page, setPage] = useState(0);
  const pageSize = 16;
  const pages = Math.ceil(unit.ayahs.length / pageSize);
  const visibleAyahs = useMemo(() => unit.ayahs.slice(page * pageSize, (page + 1) * pageSize), [page, unit.ayahs]);

  function toggle() {
    if (!expanded) setPage(0);
    onToggle();
  }

  return <div className="cd-path-unit" style={{ width: "min(550px,calc(100vw - 90px))" }}>
    <motion.button type="button" onClick={toggle} whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: .985 }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 15, padding: 18, border: complete ? "1px solid #9ff2ca" : "1px solid rgba(169,205,255,.28)", borderRadius: 24, cursor: "pointer", color: "#f1f7ff", background: complete ? "linear-gradient(145deg,rgba(31,107,91,.88),rgba(18,38,76,.96))" : "linear-gradient(145deg,rgba(28,45,96,.94),rgba(20,26,64,.96))", boxShadow: complete ? "0 0 28px rgba(120,235,188,.36)" : "0 16px 40px rgba(0,0,0,.28)", textAlign: "left" }}>
      <MasteryRing percent={progress.percent} />
      <div style={{ flex: 1 }}>
        <small style={{ color: "#a7c9ff", fontWeight: 900 }}>SURAH {unit.id} · {unit.ayahCount} AYAHS</small>
        <strong style={{ display: "block", marginTop: 3, fontSize: 20 }}>{unit.name}</strong>
        <span style={{ display: "block", marginTop: 5, color: "#c4d2e7", fontSize: 13 }}>{unit.theme}</span>
      </div>
      <span style={{ color: "#dfeaff", fontWeight: 900 }}>{expanded ? "Close" : "Open"}</span>
    </motion.button>
    <AnimatePresence>{expanded ? <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
      <div className="cd-path-ayah-list" style={{ display: "grid", gap: 9, padding: "14px 12px 0" }}>
        {visibleAyahs.map((ayah) => <AyahTile key={ayah.id} ayah={ayah} surahId={unit.id} mastered={masteredAyahs.has(ayah.id)} weak={weakAyahs.has(ayah.id)} />)}
      </div>
      {pages > 1 ? <div className="cd-path-pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "14px 12px 0", color: "#c6d5ea", fontSize: 13 }}>
        <button type="button" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="cosmic-button cosmic-button--outline" style={{ opacity: page === 0 ? .45 : 1 }}>Previous</button>
        <span>Ayahs {page * pageSize + 1}–{Math.min((page + 1) * pageSize, unit.ayahs.length)} of {unit.ayahs.length}</span>
        <button type="button" disabled={page === pages - 1} onClick={() => setPage((value) => Math.min(pages - 1, value + 1))} className="cosmic-button cosmic-button--outline" style={{ opacity: page === pages - 1 ? .45 : 1 }}>Next</button>
      </div> : null}
      {complete ? <TreasureChest unit={unit} /> : null}
    </motion.div> : null}</AnimatePresence>
  </div>;
}
