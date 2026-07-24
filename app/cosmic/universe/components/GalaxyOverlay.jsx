"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COSMIC_UNITS } from "../../../../lib/cosmic";
import { useCosmicUser } from "../../../../components/cosmic/useCosmicUser";
import GalaxyHUD from "./GalaxyHUD";
import GalaxyTooltip from "./GalaxyTooltip";
import GalaxyLegend from "./GalaxyLegend";
import GalaxyMiniMap from "./GalaxyMiniMap";
import GalaxySurahInfo from "./GalaxySurahInfo";
import GalaxyAyahInfo from "./GalaxyAyahInfo";

const links = [["/cosmic/path", "Learning path"], ["/cosmic/review", "Review orbit"], ["/cosmic/challenge", "Daily challenge"], ["/cosmic/profile", "Profile"]];

export default function GalaxyOverlay() {
  const router = useRouter();
  const user = useCosmicUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [surah, setSurah] = useState(COSMIC_UNITS[0]);
  const [ayah, setAyah] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  function showTooltip(item, event) { setTooltip({ item, position: { x: Math.min(event.clientX + 12, window.innerWidth - 245), y: Math.min(event.clientY + 12, window.innerHeight - 92) } }); }
  return <div style={{ position: "fixed", inset: 0, zIndex: 30, pointerEvents: "none" }}><GalaxyHUD user={user} onToggleMenu={() => setMenuOpen((open) => !open)} />{menuOpen ? <div style={{ pointerEvents: "auto", position: "absolute", zIndex: 8, top: 82, right: 18, width: 200, padding: 12, border: "1px solid rgba(184,219,255,.22)", borderRadius: 16, background: "rgba(6,13,41,.94)", boxShadow: "0 18px 45px rgba(0,0,0,.35)" }}>{links.map(([href, label]) => <button key={href} type="button" onClick={() => router.push(href)} style={{ display: "block", width: "100%", padding: "10px 8px", border: 0, cursor: "pointer", color: "#eaf5ff", background: "transparent", textAlign: "left", fontWeight: 850 }}>{label}</button>)}</div> : null}<div style={{ pointerEvents: "none", position: "absolute", left: 18, right: 18, bottom: 18, display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12 }}><div style={{ display: "flex", alignItems: "end", gap: 12, pointerEvents: "auto" }}><GalaxyLegend /><GalaxyMiniMap onHover={showTooltip} onLeave={() => setTooltip(null)} onSelect={(juz) => router.push(`/galaxies/${juz.id}`)} /></div><div style={{ display: "grid", gap: 10, pointerEvents: "auto" }}><GalaxySurahInfo surah={surah} user={user} onAyahSelect={setAyah} /><GalaxyAyahInfo ayah={ayah} user={user} /></div></div><div style={{ pointerEvents: "auto", position: "absolute", left: "50%", bottom: 20, transform: "translateX(-50%)", display: "flex", gap: 7 }}>{COSMIC_UNITS.map((unit) => <button key={unit.id} type="button" onClick={() => { setSurah(unit); setAyah(null); }} onMouseEnter={(event) => showTooltip({ name: unit.name, detail: unit.theme }, event)} onMouseLeave={() => setTooltip(null)} style={{ width: 12, height: 12, border: 0, borderRadius: "50%", cursor: "pointer", background: unit.id === surah.id ? "#9ff2ca" : "#aab8ff", boxShadow: unit.id === surah.id ? "0 0 13px #9ff2ca" : "none" }} />)}</div><GalaxyTooltip item={tooltip?.item} position={tooltip?.position} /></div>;
}
