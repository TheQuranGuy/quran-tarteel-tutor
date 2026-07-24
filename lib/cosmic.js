import { surahList } from "./quran";

const featuredThemes = {
  1: "The opening of guidance",
  2: "Guidance, faith, and community",
  18: "Faith through trials and wisdom",
  36: "Signs, resurrection, and the message",
  55: "Mercy and blessings across creation",
  67: "Sovereignty, creation, and accountability",
  108: "Abundance and gratitude",
  112: "Knowing the One",
};

function makeAyahs(surah) {
  return Array.from({ length: surah.ayahCount }, (_, index) => ({
    id: `${surah.number}-${index + 1}`,
    number: index + 1,
    surahId: surah.number,
    globalNumber: 0,
    arabic: "",
    translation: `Open Ayah ${index + 1} to load its Arabic text and translation.`,
    preview: true,
  }));
}

export const COSMIC_UNITS = surahList.map((surah) => ({
  id: surah.number,
  name: surah.name,
  theme: featuredThemes[surah.number] || surah.summary || surah.translation,
  ayahCount: surah.ayahCount,
  ayahs: makeAyahs(surah),
}));

export const COSMIC_THEMES = ["dark", "cosmic", "emerald", "gold"];
export const COSMIC_SKINS = ["Starlight", "Emerald mosque", "Golden crescent", "Midnight nebula"];

export function getCosmicUnit(id) {
  return COSMIC_UNITS.find((unit) => unit.id === Number(id));
}

export function getCosmicAyah(id) {
  const [surahId, ayahNumber] = String(id).split("-").map(Number);
  const unit = getCosmicUnit(surahId);
  return unit?.ayahs[ayahNumber - 1];
}

export function getCosmicProgress(user, unit) {
  const mastered = new Set(user?.ayahsMastered || []);
  const total = unit?.ayahCount || unit?.ayahs?.length || 0;
  const complete = Array.from(mastered).filter((id) => String(id).startsWith(`${unit.id}-`)).length;
  return { complete: Math.min(complete, total), total, percent: total ? Math.round((Math.min(complete, total) / total) * 100) : 0 };
}

export function getSurahWorldStyle(unit) {
  const styles = {
    1: { accent: "#8ef1ca", title: "The Dawn of Guidance", background: "radial-gradient(circle at 80% 12%, rgba(255,227,137,.32), transparent 24%), radial-gradient(circle at 18% 82%, rgba(57,194,165,.3), transparent 33%), linear-gradient(145deg,#071d35 0%,#124d5c 52%,#06233e 100%)" },
    112: { accent: "#f8fbff", title: "The World of Oneness", background: "radial-gradient(circle at 74% 15%, rgba(255,255,255,.36), transparent 17%), radial-gradient(circle at 18% 75%, rgba(154,127,255,.32), transparent 34%), linear-gradient(145deg,#10142f 0%,#2d2465 54%,#0a1031 100%)" },
    108: { accent: "#82eaff", title: "The River of Abundance", background: "radial-gradient(circle at 80% 12%, rgba(174,244,255,.28), transparent 22%), radial-gradient(circle at 22% 78%, rgba(34,165,220,.32), transparent 36%), linear-gradient(145deg,#04294e 0%,#075d7a 50%,#092d5c 100%)" },
  };
  return styles[unit?.id] || { accent: "#9fefff", title: unit?.theme || "Surah world", background: "radial-gradient(circle at 80% 15%, rgba(100,183,255,.3), transparent 28%), linear-gradient(145deg,#070d28,#102754 55%,#090e2e)" };
}
