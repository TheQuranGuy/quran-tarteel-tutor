"use client";

import StoreCurrencyDisplay from "./StoreCurrencyDisplay";

export default function StoreHeader({ store, xp = 0, onCurrency }) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}>
      <div>
        <p style={{ margin: 0, color: "#ffdc8b", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>XP REDEMPTION STORE</p>
        <h1 style={{ margin: "8px 0", fontSize: "clamp(2.5rem,8vw,5.2rem)", lineHeight: .92, letterSpacing: "-.06em" }}>Spend your XP.</h1>
        <p style={{ maxWidth: 620, margin: 0, color: "#c5d4e9", lineHeight: 1.6 }}>Redeem learning XP for cosmetics, themes, trails, and comfort items. Qur'an learning content always stays open.</p>
      </div>
      <div style={{ display: "grid", gap: 9, justifyItems: "end" }}>
        <StoreCurrencyDisplay xp={xp} crystals={store.crystals} premium={store.premium} />
        <button type="button" onClick={onCurrency} className="cosmic-button cosmic-button--outline">Preview items</button>
      </div>
    </header>
  );
}
