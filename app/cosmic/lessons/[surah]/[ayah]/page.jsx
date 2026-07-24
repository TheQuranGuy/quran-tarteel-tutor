import { notFound } from "next/navigation";
import { getCosmicAyah } from "../../../../../lib/cosmic";
import { getSurahAyahs } from "../../../../../lib/quran";
import LessonContainer from "../../components/LessonContainer";

export default async function CosmicLessonPage({ params }) {
  const { surah, ayah } = await params;
  let lessonAyah = getCosmicAyah(`${surah}-${ayah}`);
  if (!lessonAyah) notFound();
  try {
    const liveAyahs = await getSurahAyahs(Number(surah));
    lessonAyah = liveAyahs.find((item) => item.number === Number(ayah)) || lessonAyah;
  } catch {
    // The path still opens with its lightweight ayah reference if a remote source is unavailable.
  }
  return <LessonContainer ayah={lessonAyah} />;
}
