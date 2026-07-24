"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import StarParticles from "../../../components/cosmic/StarParticles";
import InventoryHeader from "./components/InventoryHeader";
import InventoryTabs from "./components/InventoryTabs";
import InventoryLoadout from "./components/InventoryLoadout";
import InventoryCollection from "./components/InventoryCollection";
import InventoryEmpty from "./components/InventoryEmpty";

const STORE_KEY = "sheikhduo-cosmic-store";
const QUEST_COSMETICS_KEY = "sheikhduo-cosmic-quest-cosmetics";
const EVENT_COSMETICS_KEY = "sheikhduo-cosmic-event-cosmetics";
const EMPTY_STORE = { crystals: 250, owned: [], boosters: [], shields: 0, eventPasses: [], premium: false, equipped: { theme: "", skin: "", trail: "" } };
const TABS = ["All", "Cosmetics", "Relics", "Passes", "Boosters"];

const STORE_ITEMS = [
  { id: "nebula-theme", name: "Nebula skin", description: "A violet nebula treatment for your Quran Tarteel atmosphere.", category: "Cosmetics", source: "Store", slot: "theme", value: "nebula", mark: "N", accent: "#d6adff", art: "radial-gradient(circle at 30% 25%,#ffe2fd 0 5%,#d27df2 25%,#6642a9 58%,#16133e 100%)" },
  { id: "starlight-guide", name: "Starlight guide skin", description: "A visual glow for your chosen cosmic guide.", category: "Cosmetics", source: "Store", slot: "skin", value: "starlight", mark: "G", accent: "#aceeff", art: "radial-gradient(circle at 30% 25%,#f3ffff 0 5%,#9ce7ff 25%,#386daa 58%,#112852 100%)" },
  { id: "comet-trail", name: "Comet trail", description: "A cosmetic trail for your profile presence.", category: "Cosmetics", source: "Store", slot: "trail", value: "comet", mark: "C", accent: "#ffe08e", art: "radial-gradient(circle at 30% 25%,#fff8d0 0 5%,#ffcb6f 25%,#de7655 58%,#54234e 100%)" },
  { id: "reflection-hints", name: "Reflection hints", description: "Optional reminder cards for practice; mastery and lesson XP stay unchanged.", category: "Boosters", source: "Store", mark: "R", accent: "#aaf0d3", art: "radial-gradient(circle at 30% 25%,#e8ffe8 0 5%,#92e7bd 25%,#287b87 58%,#122653 100%)" },
  { id: "celebration-glow", name: "Celebration glow", description: "A celebratory XP visual only; learning rewards remain unchanged.", category: "Boosters", source: "Store", mark: "✦", accent: "#ffd889", art: "radial-gradient(circle at 30% 25%,#fff7cb 0 5%,#ffc76b 25%,#ac649d 58%,#351b59 100%)" },
  { id: "ramadan-pass", name: "Ramadan cosmic pass", description: "Seasonal cosmetic reward tracking that never gates participation.", category: "Passes", source: "Store", mark: "R", accent: "#b7f0da", art: "radial-gradient(circle at 30% 25%,#eaffef 0 5%,#8ad9bb 25%,#246767 58%,#102343 100%)" },
  { id: "dhul-hijjah-pass", name: "Dhul Hijjah pass", description: "A seasonal cosmetic pass for your event archive.", category: "Passes", source: "Store", mark: "D", accent: "#f4cf8a", art: "radial-gradient(circle at 30% 25%,#fff5cd 0 5%,#f1bb66 25%,#995c38 58%,#422149 100%)" },
  { id: "starter-bundle", name: "Starter constellation", description: "A collected visual bundle for new cosmic travelers.", category: "Relics", source: "Store", mark: "S", accent: "#c4b4ff", art: "radial-gradient(circle at 30% 25%,#f0eaff 0 5%,#b397f4 25%,#5d4caa 58%,#1c1a4c 100%)" },
  { id: "mastery-bundle", name: "Mastery constellation", description: "A visual and reflection-focused collection.", category: "Relics", source: "Store", mark: "M", accent: "#a8eaff", art: "radial-gradient(circle at 30% 25%,#e9ffff 0 5%,#83d8f2 25%,#2e6f9d 58%,#172351 100%)" },
];

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function cleanStore(value) {
  return { ...EMPTY_STORE, ...(value || {}), equipped: { ...EMPTY_STORE.equipped, ...(value?.equipped || {}) } };
}

function cosmeticItem(name, source, index) {
  const palettes = [
    ["#e6c0ff", "#6e57cf", "Q"], ["#9feaff", "#306ca7", "E"], ["#ffe1a0", "#b26762", "R"], ["#aef2d0", "#237e82", "L"],
  ];
  const [accent, deep, mark] = palettes[index % palettes.length];
  return { id: `${source}-${name}`, name, description: source === "Quest" ? "A luminous reward collected from a completed cosmic mission." : "A seasonal relic collected from a cosmic event orbit.", category: "Relics", source, mark, accent, art: `radial-gradient(circle at 30% 25%,#f8ffff 0 5%,${accent} 26%,${deep} 60%,#171842 100%)` };
}

export default function CosmicInventoryPage() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState("All");
  const [store, setStore] = useState(EMPTY_STORE);
  const [questCosmetics, setQuestCosmetics] = useState([]);
  const [eventCosmetics, setEventCosmetics] = useState([]);

  useEffect(() => {
    setStore(cleanStore(readJson(STORE_KEY, EMPTY_STORE)));
    setQuestCosmetics(readJson(QUEST_COSMETICS_KEY, []));
    setEventCosmetics(readJson(EVENT_COSMETICS_KEY, []));
  }, []);

  const collection = useMemo(() => {
    const owned = new Set(store.owned || []);
    const passes = new Set(store.eventPasses || []);
    const items = STORE_ITEMS.filter((item) => owned.has(item.id) || (item.id === "ramadan-pass" && passes.has("ramadan")) || (item.id === "dhul-hijjah-pass" && passes.has("dhul-hijjah"))).map((item) => ({ ...item, equipped: Boolean(item.slot && store.equipped?.[item.slot] === item.value) }));
    if (store.shields > 0) items.push({ id: "streak-shield", name: "Streak shields", description: "Optional shield tokens held for a future streak comfort feature. Existing streak rules are not altered.", category: "Boosters", source: "Store", mark: "S", accent: "#9fdfff", art: "radial-gradient(circle at 30% 25%,#e5ffff 0 5%,#82d7ff 25%,#356baf 58%,#14264d 100%)", count: store.shields });
    if (store.premium) items.push({ id: "cosmic-plus", name: "Quran Tarteel+ preview", description: "Your local visual membership preview is active. Qur’an learning remains free for everyone.", category: "Cosmetics", source: "Store", mark: "+", accent: "#e3b5ff", art: "radial-gradient(circle at 30% 25%,#fff0ff 0 5%,#df9ef4 25%,#8052b8 58%,#231447 100%)" });
    questCosmetics.forEach((name, index) => items.push(cosmeticItem(name, "Quest", index)));
    eventCosmetics.forEach((name, index) => items.push(cosmeticItem(name, "Event", index + questCosmetics.length)));
    return items;
  }, [eventCosmetics, questCosmetics, store]);

  const visible = active === "All" ? collection : collection.filter((item) => item.category === active);
  const equipped = useMemo(() => ({
    theme: STORE_ITEMS.find((item) => item.slot === "theme" && item.value === store.equipped?.theme)?.name || "",
    skin: STORE_ITEMS.find((item) => item.slot === "skin" && item.value === store.equipped?.skin)?.name || "",
    trail: STORE_ITEMS.find((item) => item.slot === "trail" && item.value === store.equipped?.trail)?.name || "",
  }), [store.equipped]);
  const equippedCount = Object.values(equipped).filter(Boolean).length;

  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "clamp(28px,5vw,58px) 16px 94px", overflow: "hidden" }}>
    <StarParticles count={58} color="#c7e7ff" />
    <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 105, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", width: 430, aspectRatio: "1", right: "-150px", top: "-150px", borderRadius: "50%", border: "1px solid rgba(184,138,255,.2)", boxShadow: "0 0 100px rgba(126,90,245,.14)" }} />
    <section style={{ position: "relative", width: "min(1120px,100%)", margin: "0 auto", display: "grid", gap: 22 }}>
      <InventoryHeader collected={collection.length} equipped={equippedCount} crystals={store.crystals} />
      <InventoryLoadout equipped={equipped} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15, flexWrap: "wrap" }}><InventoryTabs tabs={TABS} active={active} onChange={setActive} /><Link href="/cosmic/worlds" className="cosmic-button cosmic-button--outline" style={{ textDecoration: "none", fontSize: 13 }}>Explore worlds</Link></div>
      {visible.length ? <InventoryCollection items={visible} /> : <InventoryEmpty filter={active} />}
      <p style={{ margin: 0, color: "#8fa5c4", fontSize: 12, textAlign: "center" }}>Your collection is read from the existing Store, Quests, and Events local records. This screen does not change purchases, rewards, or learning progress.</p>
    </section>
  </main>;
}
