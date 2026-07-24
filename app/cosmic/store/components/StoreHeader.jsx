"use client";

import StoreCurrencyDisplay from "./StoreCurrencyDisplay";

export default function StoreHeader({ store, onCurrency }) {
  return <header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}><div><p style={{ margin: 0, color: "#ffdc8b", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>OPTIONAL COSMIC EXTRAS</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Cosmic store.</h1><p style={{ maxWidth: 620, margin: 0, color: "#c5d4e9", lineHeight: 1.6 }}>Learning every ayah stays free. These optional extras are cosmetic or comfort-focused and never block Qur&apos;an content.</p></div><div style={{ display: "grid", gap: 9, justifyItems: "end" }}><StoreCurrencyDisplay crystals={store.crystals} premium={store.premium} /><button type="button" onClick={onCurrency} className="cosmic-button cosmic-button--outline">Get preview crystals</button></div></header>;
}
