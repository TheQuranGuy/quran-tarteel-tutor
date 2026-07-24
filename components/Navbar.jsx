"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import XPIndicator from "./XPIndicator";
import StreakCounter from "./StreakCounter";
const links = [["/", "Home"], ["/surah/1", "Qur'an"], ["/galaxies", "Galaxies"], ["/review", "Review"], ["/tutor", "AI Sheikh"]];
export default function Navbar() { const pathname = usePathname(); return <header className="navbar"><nav className="nav-content"><Link className="brand" href="/">Sheikh<span>Duo</span></Link><div className="nav-links">{links.map(([href, label]) => <Link className={`nav-link ${pathname === href ? "active" : ""}`} href={href} key={href}>{label}</Link>)}</div><div className="nav-stats"><XPIndicator /><StreakCounter compact /></div></nav></header>; }
