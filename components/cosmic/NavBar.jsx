"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "../../lib/user";
import StreakFlame from "./StreakFlame";

const primaryLinks = [
  ["/cosmic/intro", "Home"],
  ["/cosmic/path", "Path"],
  ["/cosmic/worlds", "Worlds"],
  ["/cosmic/story", "Story"],
  ["/cosmic/recitation", "Practice"],
];

const moreLinks = [
  ["/cosmic/command", "Learning OS"],
  ["/cosmic/skill-tree", "Skill tree"],
  ["/cosmic/inventory", "Inventory"],
  ["/cosmic/challenge", "Challenge"],
  ["/cosmic/review", "Review"],
  ["/cosmic/tutor", "Tutor"],
  ["/cosmic/achievements", "Achievements"],
  ["/cosmic/profile", "Profile"],
  ["/cosmic/universe", "Universe"],
];

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const refresh = () => setUser(getUser());
    refresh();
    window.addEventListener("sheikhduo-user-changed", refresh);
    return () => window.removeEventListener("sheikhduo-user-changed", refresh);
  }, []);
  const active = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const moreActive = moreLinks.some(([href]) => active(href));
  const linkClass = (href) => `cd-nav-link${active(href) ? " cd-nav-link--active" : ""}`;
  return <header className="cosmic-nav"><nav aria-label="Quran Tarteel navigation" className="cd-nav-inner"><Link href="/cosmic/intro" className="cd-brand">Quran<strong>Tarteel</strong><small>Learn</small></Link><div className="cd-nav-links">{primaryLinks.map(([href, label]) => <Link key={href} href={href} className={linkClass(href)}>{label}</Link>)}<details className={`cd-nav-more${moreActive ? " cd-nav-more--active" : ""}`}><summary>More</summary><div className="cd-nav-menu">{moreLinks.map(([href, label]) => <Link key={href} href={href} className={linkClass(href)}>{label}</Link>)}</div></details></div><div className="cd-nav-status"><strong className="cd-xp-score">{user?.xp || 0} XP</strong><StreakFlame streak={user?.streak || 0} /></div></nav></header>;
}
