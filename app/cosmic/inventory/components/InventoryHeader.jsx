import Link from "next/link";

export default function InventoryHeader({ collected, equipped, crystals }) {
  return <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 20 }}>
    <div><h1 style={{ margin: 0, fontSize: "clamp(2.65rem,7vw,5.5rem)", lineHeight: 0.91, letterSpacing: "-.075em" }}>Your cosmic collection.</h1><p style={{ maxWidth: 600, margin: "14px 0 0", color: "#c5d5ea", lineHeight: 1.65 }}>A quiet archive of the visual rewards, passes, trails, and relics already earned across your Quran Tarteel journey.</p></div>
    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}><span style={{ padding: "10px 12px", borderRadius: 13, color: "#ffe39b", background: "rgba(221,169,62,.14)", border: "1px solid rgba(255,221,135,.22)", fontSize: 13, fontWeight: 900 }}>{crystals} crystals</span><span style={{ padding: "10px 12px", borderRadius: 13, color: "#bfefff", background: "rgba(110,199,255,.11)", border: "1px solid rgba(166,222,255,.2)", fontSize: 13, fontWeight: 900 }}>{collected} collected</span><span style={{ padding: "10px 12px", borderRadius: 13, color: "#aaf0cf", background: "rgba(92,228,177,.1)", border: "1px solid rgba(142,246,204,.2)", fontSize: 13, fontWeight: 900 }}>{equipped} equipped</span><Link href="/cosmic/store" className="cosmic-button" style={{ color: "#13213c", background: "linear-gradient(135deg,#a9f3d0,#9fe9ff)", textDecoration: "none" }}>Visit store</Link></div>
  </header>;
}
