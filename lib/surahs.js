import { surahList } from "./quran";

const themes = {
  1: "The Opening", 2: "Guidance and covenant", 3: "Faith and steadfastness", 4: "Justice and family", 5: "Faithful commitments", 6: "Signs of creation", 7: "Prophets and moral choice", 8: "Faith and resilience", 9: "Repentance and truth", 10: "Trust in revelation", 12: "Patience and forgiveness", 17: "The Night Journey", 18: "Faith through trials", 19: "Mercy and prophets", 20: "Moses and remembrance", 24: "Light and integrity", 36: "Signs and resurrection", 55: "Mercy and blessings", 67: "Divine sovereignty", 78: "The Great News", 81: "The Overthrowing", 89: "The Dawn", 93: "The Morning Light", 97: "Night of Power", 103: "Time and faith", 105: "Elephant and Makkah", 108: "River in Jannah", 111: "Fire and consequence", 112: "Pure unity", 113: "Daybreak protection", 114: "Protection for mankind",
};

export const surahs = surahList.map((surah) => ({ ...surah, ayahs: surah.ayahCount, theme: themes[surah.number] || `Reflections from ${surah.translation}` }));
export const getSurahPlanet = (id) => surahs.find((surah) => surah.id === String(id) || surah.number === Number(id));
