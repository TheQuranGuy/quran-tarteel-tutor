"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AyahTile from "./AyahTile";
import LessonEngine from "./LessonEngine";
import RewardChest from "./RewardChest";
import SurahPlanetNode from "./SurahPlanetNode";
import { getUser } from "../lib/user";

const pathSurahs = [
  {
    id: 1,
    name: "Al-Fatiha",
    ayahs: [
      { id: "1-1", number: 1, globalNumber: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { id: "1-2", number: 2, globalNumber: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "All praise is due to Allah, Lord of the worlds." },
    ],
  },
  {
    id: 112,
    name: "Al-Ikhlas",
    ayahs: [
      { id: "112-1", number: 1, globalNumber: 6222, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, He is Allah, One." },
      { id: "112-2", number: 2, globalNumber: 6223, arabic: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
    ],
  },
  {
    id: 108,
    name: "Al-Kawthar",
    ayahs: [
      { id: "108-1", number: 1, globalNumber: 6205, arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", translation: "Indeed, We have granted you Al-Kawthar." },
      { id: "108-2", number: 2, globalNumber: 6206, arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", translation: "So pray to your Lord and sacrifice." },
    ],
  },
];

const styles = {
  wrap: { display: "grid", gap: 24, marginTop: 28 },
  header: { display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "end" },
  eyebrow: { margin: "0 0 8px", color: "#79e5aa", fontSize: 12, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" },
  title: { margin: 0, fontSize: "clamp(2rem,5vw,3.8rem)" },
  path: { position: "relative", display: "grid", gap: 34, padding: "24px 0" },
  connector: { position: "absolute", left: "50%", top: 92, bottom: 92, width: 4, transform: "translateX(-50%) rotate(12deg)", borderRadius: 999, background: "linear-gradient(#79e5aa,#9178ff,#fff39c)", boxShadow: "0 0 22px rgba(121,229,170,.5)" },
  row: { display: "flex", alignItems: "center", gap: 20 },
  tilePanel: { display: "grid", gap: 12, flex: 1, padding: 16, border: "1px solid rgba(189,242,208,.16)", borderRadius: 18, background: "rgba(16,35,27,.72)" },
};

export default function LearningPath({ user }) {
  const [selectedSurah, setSelectedSurah] = useState(pathSurahs[0]);
  const [activeAyah, setActiveAyah] = useState(null);
  const profile = user || getUser();
  const mastered = profile.ayahsMastered || [];
  const completedSurahs = profile.surahsCompleted || [];

  const progressBySurah = useMemo(() => Object.fromEntries(pathSurahs.map((surah) => {
    const masteredCount = surah.ayahs.filter((ayah) => mastered.includes(ayah.id)).length;
    return [surah.id, Math.round((masteredCount / surah.ayahs.length) * 100)];
  })), [mastered]);

  return (
    <section style={styles.wrap}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Cosmic learning path</p>
          <h1 style={styles.title}>Surah planets and ayah tiles</h1>
        </div>
        <RewardChest id="daily-path-chest" reward={20} label="Daily challenge" />
      </header>

      {activeAyah ? (
        <LessonEngine ayah={activeAyah} user={profile} onClose={() => setActiveAyah(null)} />
      ) : (
        <div style={styles.path}>
          <span style={styles.connector} />
          {pathSurahs.map((surah, index) => {
            const selected = selectedSurah.id === surah.id;
            const locked = index > 0 && !completedSurahs.includes(pathSurahs[index - 1].id);
            return (
              <motion.div
                key={surah.id}
                style={{ ...styles.row, justifyContent: index % 2 === 0 ? "flex-start" : "flex-end", flexDirection: index % 2 === 0 ? "row" : "row-reverse" }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <SurahPlanetNode
                  surah={surah}
                  progress={progressBySurah[surah.id]}
                  locked={locked}
                  selected={selected}
                  completed={completedSurahs.includes(surah.id)}
                  onClick={() => setSelectedSurah(surah)}
                />
                {selected && (
                  <div style={styles.tilePanel}>
                    <p style={styles.eyebrow}>Ayah lessons</p>
                    {surah.ayahs.map((ayah) => (
                      <AyahTile key={ayah.id} ayah={ayah} mastered={mastered.includes(ayah.id)} onOpen={() => setActiveAyah(ayah)} />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
