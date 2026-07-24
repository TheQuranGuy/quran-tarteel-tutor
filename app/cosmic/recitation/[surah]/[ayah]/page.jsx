import { notFound, redirect } from "next/navigation";
import { getCosmicAyah } from "../../../../../lib/cosmic";
import { getSurahAyahs, getSurahById, surahList } from "../../../../../lib/quran";
import RecitationStudio from "../../../../../components/cosmic/RecitationStudio";

export const revalidate = 86400;

export default async function CosmicRecitationAyahPage({ params }) {
  const { surah: rawSurah, ayah: rawAyah } = await params;
  const surahId = Number(rawSurah);
  const ayahNumber = Number(rawAyah);
  const surah = getSurahById(surahId);
  if (!surah || !Number.isInteger(ayahNumber) || ayahNumber < 1) notFound();
  if (ayahNumber > surah.ayahCount) redirect(`/cosmic/recitation/${surahId}/${surah.ayahCount}`);

  let practiceAyah = getCosmicAyah(`${surahId}-${ayahNumber}`);
  try {
    const ayahs = await getSurahAyahs(surahId);
    practiceAyah = ayahs.find((item) => item.number === ayahNumber) || practiceAyah;
  } catch {
    practiceAyah = getSurahById(surahId)?.ayahs?.find((item) => item.number === ayahNumber) || practiceAyah;
  }
  if (!practiceAyah) notFound();
  if (!practiceAyah.globalNumber) {
    const globalNumber = surahList.slice(0, surahId - 1).reduce((total, item) => total + item.ayahCount, 0) + ayahNumber;
    practiceAyah = { ...practiceAyah, globalNumber };
  }
  return <RecitationStudio ayah={practiceAyah} surah={surah} />;
}
