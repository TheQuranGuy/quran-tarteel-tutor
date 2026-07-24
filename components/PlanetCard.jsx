import Link from "next/link";
export default function PlanetCard({ planet }) { return <Link className="planet-card" href={planet.href}><span>{planet.icon}</span><div><h3>{planet.name}</h3><p>{planet.description}</p></div><strong>→</strong></Link>; }
