import { getSurahAyahs, getSurahById } from "../../../lib/quran";
import RecitationStudio from "../../../components/cosmic/RecitationStudio";

export const revalidate = 86400;

export default async function CosmicRecitationPage() {
  const fallback = getSurahById(1);
  let ayahs = fallback?.ayahs || [];
  try {
    const liveAyahs = await getSurahAyahs(1);
    if (liveAyahs.length) ayahs = liveAyahs;
  } catch {
    // The existing local Al-Fatiha sample remains a usable fallback.
  }
  return <RecitationStudio ayah={ayahs[0]} surah={fallback} />;
}
