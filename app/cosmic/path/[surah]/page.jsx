import { notFound } from "next/navigation";
import { getCosmicUnit } from "../../../../lib/cosmic";
import SurahWorldPath from "../../../../components/cosmic/SurahWorldPath";

export default async function CosmicSurahPlanetPage({ params }) {
  const { surah } = await params;
  const unit = getCosmicUnit(surah);
  if (!unit) notFound();
  return <SurahWorldPath unit={unit} />;
}
