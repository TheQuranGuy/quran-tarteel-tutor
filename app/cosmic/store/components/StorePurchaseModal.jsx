"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import StoreCurrencyDisplay from "./StoreCurrencyDisplay";

export default function StorePurchaseModal({ item, store, onClose, onConfirm }) {
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  if (!item) return null;

  const availableXp = Number(store.crystals || 0);
  const enough = item.price === 0 || availableXp >= item.price;
  const price = item.priceLabel || `${item.price} XP`;

  return (
    <div role="presentation" onMouseDown={onClose} style={{ position: "fixed", zIndex: 90, inset: 0, display: "grid", placeItems: "center", padding: 18, background: "rgba(2,5,22,.76)", backdropFilter: "blur(8px)" }}>
      <motion.section role="dialog" aria-modal="true" aria-label={`Redeem ${item.name}`} onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ width: "min(460px,100%)", padding: 28, borderRadius: 25, color: "#eff8ff", background: "radial-gradient(circle at 50% 0%,rgba(126,94,255,.3),transparent 50%),#101a3e", border: "1px solid rgba(175,218,255,.26)" }}>
        <div style={{ fontSize: 53, textAlign: "center" }}>{item.icon}</div>
        <p style={{ margin: "7px 0", textAlign: "center", color: "#ffdc8b", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>{item.category.toUpperCase()}</p>
        <h1 style={{ margin: "5px 0", textAlign: "center", fontSize: 29 }}>{item.name}</h1>
        <p style={{ margin: "0 0 17px", color: "#c6d5ea", textAlign: "center", lineHeight: 1.55 }}>{item.description}</p>
        <StoreCurrencyDisplay xp={availableXp} premium={store.premium} />
        <p style={{ margin: "17px 0", color: "#ffe59a", fontWeight: 900 }}>{price}</p>
        <p style={{ margin: "0 0 19px", color: "#aebfda", fontSize: 13, lineHeight: 1.5 }}>This redeems local XP for cosmetics only. It never blocks Qur'an lessons or changes mastery rules.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" disabled={!enough} onClick={() => onConfirm(item)} className="cosmic-button" style={{ opacity: enough ? 1 : .45 }}>{enough ? item.action || "Redeem XP" : "Not enough XP"}</button>
          <button type="button" onClick={onClose} className="cosmic-button cosmic-button--outline">Cancel</button>
        </div>
      </motion.section>
    </div>
  );
}
