import SurahReader from "../../../components/SurahReader";
import { getSurahAyahs, getSurahById } from "../../../lib/quran";

export const dynamic = "force-dynamic";

export default async function SurahPage({ params }) {
  const { id } = await params;
  const surah = getSurahById(id);
  if (!surah) return <main className="page">Surah not found.</main>;
  const ayahs = await getSurahAyahs(id);
  return <main className="page narrow-page"><header className="page-heading"><p className="eyebrow">Surah {surah.number} · {surah.translation} · {surah.ayahCount} ayahs</p><h1>{surah.name}</h1><p className="lead">{surah.description}</p></header>{ayahs.length ? <SurahReader ayahs={ayahs} /> : <section className="content-card"><h2>Unable to load ayahs</h2><p className="muted">Check your internet connection and refresh the page.</p></section>}</main>;
}
