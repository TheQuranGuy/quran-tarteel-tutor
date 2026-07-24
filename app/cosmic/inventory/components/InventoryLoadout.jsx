import Link from "next/link";

function LoadoutSlot({ label, item, accent }) {
  return <div style={{ minWidth: 0, padding: 16, borderRadius: 19, border: `1px solid ${accent}44`, background: `${accent}0d` }}><p style={{ margin: 0, color: accent, fontSize: 11, fontWeight: 900, letterSpacing: ".12em" }}>{label.toUpperCase()}</p><p style={{ overflow: "hidden", margin: "8px 0 0", color: item ? "#eff8ff" : "#9caeca", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 850 }}>{item || "No item equipped"}</p></div>;
}

export default function InventoryLoadout({ equipped }) {
  return <section style={{ display: "grid", gap: 15, padding: "clamp(19px,4vw,27px)", borderRadius: 26, border: "1px solid rgba(159,225,255,.2)", background: "radial-gradient(circle at 92% 4%,rgba(120,178,255,.18),transparent 30%),rgba(11,18,53,.75)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}><div><h2 style={{ margin: 0, fontSize: "clamp(1.4rem,3vw,2rem)" }}>Active loadout</h2><p style={{ margin: "6px 0 0", color: "#bdcde3", fontSize: 13, lineHeight: 1.5 }}>Shown from your existing store selection. Inventory never changes your learning progress.</p></div><Link href="/cosmic/store" className="cosmic-button cosmic-button--outline" style={{ padding: "9px 12px", textDecoration: "none", fontSize: 13 }}>Manage in store</Link></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 10 }}><LoadoutSlot label="Atmosphere" item={equipped.theme} accent="#bca9ff" /><LoadoutSlot label="Guide skin" item={equipped.skin} accent="#a8ebff" /><LoadoutSlot label="Trail" item={equipped.trail} accent="#ffe199" /></div>
  </section>;
}
