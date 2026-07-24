"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { updateUser } from "../../../lib/user";
import StarParticles from "../../../components/cosmic/StarParticles";
import StoreHeader from "./components/StoreHeader";
import StoreCategoryTabs from "./components/StoreCategoryTabs";
import StoreItemCard from "./components/StoreItemCard";
import StorePurchaseModal from "./components/StorePurchaseModal";
import StoreBundleCard from "./components/StoreBundleCard";
import StoreSubscriptionCard from "./components/StoreSubscriptionCard";

const STORE_KEY = "sheikhduo-cosmic-store";
const DEFAULT_STORE = { crystals: 250, owned: [], boosters: [], shields: 0, eventPasses: [], premium: false, equipped: { theme: "", skin: "", trail: "" } };
const CATEGORIES = ["Cosmetics", "Boosters", "Shields", "Event passes", "Bundles", "Currency"];
const ITEMS = [
  { id: "nebula-theme", category: "Cosmetics", icon: "🌌", name: "Nebula skin", description: "A violet nebula treatment for your Quran Tarteel atmosphere.", price: 80, effect: "theme", value: "nebula" },
  { id: "starlight-guide", category: "Cosmetics", icon: "🧕", name: "Starlight guide skin", description: "A purely visual glow for your chosen cosmic guide.", price: 100, effect: "skin", value: "starlight" },
  { id: "comet-trail", category: "Cosmetics", icon: "☄", name: "Comet trail", description: "A cosmetic trail for your profile presence.", price: 70, effect: "trail", value: "comet" },
  { id: "reflection-hints", category: "Boosters", icon: "💡", name: "Reflection hints", description: "Optional reminder cards for practice. It never changes mastery or lesson XP.", price: 45, effect: "booster", value: "reflection-hints" },
  { id: "celebration-glow", category: "Boosters", icon: "✨", name: "Celebration glow", description: "Adds a celebratory XP visual only; learning rewards stay unchanged.", price: 35, effect: "booster", value: "celebration-glow" },
  { id: "one-shield", category: "Shields", icon: "🛡", name: "One-day streak shield", description: "Stores one optional shield in your inventory. Existing streak rules are never overridden.", price: 55, effect: "shield", quantity: 1 },
  { id: "three-shields", category: "Shields", icon: "🛡", name: "Three-day shield pack", description: "Stores three optional shield tokens for a future streak feature.", price: 145, effect: "shield", quantity: 3 },
  { id: "ramadan-pass", category: "Event passes", icon: "☾", name: "Ramadan cosmic pass", description: "Adds seasonal cosmetic reward tracking to your event inventory.", price: 130, effect: "event", value: "ramadan" },
  { id: "dhul-hijjah-pass", category: "Event passes", icon: "🕋", name: "Dhul Hijjah pass", description: "Adds a seasonal cosmetic pass; it never gates event participation.", price: 130, effect: "event", value: "dhul-hijjah" },
  { id: "starter-bundle", category: "Bundles", icon: "🎁", name: "Starter constellation", description: "A small visual pack for new cosmic travelers.", contents: "Nebula skin · Comet trail · Celebration glow", price: 150, savings: "35 ✦", effect: "bundle" },
  { id: "mastery-bundle", category: "Bundles", icon: "🔮", name: "Mastery constellation", description: "A visual and reflection-focused collection.", contents: "Starlight guide · Reflection hints · 1 shield token", price: 190, savings: "55 ✦", effect: "bundle" },
  { id: "crystals-100", category: "Currency", icon: "✦", name: "100 crystals", description: "A local preview currency pack for trying the store interface.", price: 0, priceLabel: "Free local preview", action: "Claim preview", effect: "currency", gain: 100 },
  { id: "crystals-500", category: "Currency", icon: "✦", name: "500 crystals", description: "A local preview currency pack for testing cosmetic purchases.", price: 0, priceLabel: "Free local preview", action: "Claim preview", effect: "currency", gain: 500 },
  { id: "crystals-1000", category: "Currency", icon: "✦", name: "1,000 crystals", description: "A local preview currency pack. No payment is processed.", price: 0, priceLabel: "Free local preview", action: "Claim preview", effect: "currency", gain: 1000 },
];
const PREMIUM = { id: "cosmic-plus", category: "Subscription", icon: "✧", name: "Quran Tarteel+ preview", description: "An optional local preview of premium cosmetic membership. It never restricts learning content.", price: 0, priceLabel: "Free local preview", action: "Activate preview", effect: "premium" };
function readStore() { try { return { ...DEFAULT_STORE, ...JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}") }; } catch { return DEFAULT_STORE; } }

export default function CosmicStorePage() {
  const [store, setStore] = useState(DEFAULT_STORE);
  const [active, setActive] = useState("Cosmetics");
  const [selected, setSelected] = useState(null);
  useEffect(() => { setStore(readStore()); }, []);
  function persist(next) { setStore(next); window.localStorage.setItem(STORE_KEY, JSON.stringify(next)); }
  function applyVisual(item) { if (item.effect === "theme") { document.documentElement.dataset.cosmicStoreTheme = item.value; document.body.style.background = "radial-gradient(circle at 20% 10%,rgba(234,102,184,.28),transparent 30%),radial-gradient(circle at 80% 70%,rgba(110,105,255,.28),transparent 35%),#130d36"; updateUser({ preferredTheme: item.value }); } }
  function purchase(item) {
    if (item.effect !== "shield" && store.owned.includes(item.id)) { setSelected(null); return; }
    if (item.price > store.crystals) return;
    const owned = item.effect === "shield" ? store.owned : [...store.owned, item.id];
    const next = { ...store, crystals: store.crystals - item.price, owned, boosters: item.effect === "booster" ? [...new Set([...store.boosters, item.value])] : store.boosters, shields: item.effect === "shield" ? store.shields + item.quantity : store.shields, eventPasses: item.effect === "event" ? [...new Set([...store.eventPasses, item.value])] : store.eventPasses, premium: item.effect === "premium" ? true : store.premium, equipped: item.effect === "theme" ? { ...store.equipped, theme: item.value } : item.effect === "skin" ? { ...store.equipped, skin: item.value } : item.effect === "trail" ? { ...store.equipped, trail: item.value } : store.equipped };
    if (item.effect === "currency") next.crystals += item.gain;
    if (item.effect === "bundle") { next.owned = [...new Set([...next.owned, "nebula-theme", "comet-trail", "celebration-glow"])]; next.equipped = { ...next.equipped, theme: "nebula", trail: "comet" }; }
    persist(next);
    applyVisual(item.effect === "bundle" ? { effect: "theme", value: "nebula" } : item);
    setSelected(null);
  }
  const visible = useMemo(() => ITEMS.filter((item) => item.category === active), [active]);
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}><StarParticles count={55} color="#f7d58c" /><section style={{ position: "relative", width: "min(1040px,100%)", margin: "0 auto", display: "grid", gap: 18 }}><StoreHeader store={store} onCurrency={() => setActive("Currency")} /><div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><Link href="/cosmic/profile" className="cosmic-button cosmic-button--outline">Profile</Link><Link href="/cosmic/path" className="cosmic-button cosmic-button--outline">Learning path</Link></div><StoreSubscriptionCard premium={store.premium} onSelect={() => setSelected(PREMIUM)} /><StoreCategoryTabs categories={CATEGORIES} active={active} onChange={setActive} />{active === "Bundles" ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 13 }}>{visible.map((item) => <StoreBundleCard key={item.id} item={item} owned={store.owned.includes(item.id)} onSelect={setSelected} />)}</div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 13 }}>{visible.map((item) => <StoreItemCard key={item.id} item={item} owned={store.owned.includes(item.id)} onSelect={setSelected} />)}</div>}</section><StorePurchaseModal item={selected} store={store} onClose={() => setSelected(null)} onConfirm={purchase} /></main>;
}
