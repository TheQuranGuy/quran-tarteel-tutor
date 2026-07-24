import GalaxyCard from "../../components/GalaxyCard";
import { learningGalaxies } from "../../lib/navigation";
export default function UniversePage() { return <main className="page"><header className="page-heading"><p className="eyebrow">Quran Tarteel learning map</p><h1>Learning Universe</h1><p className="lead">Explore connected routes through your Islamic learning.</p></header><section className="galaxy-grid">{learningGalaxies.map((galaxy) => <GalaxyCard galaxy={galaxy} key={galaxy.id} />)}</section></main>; }
