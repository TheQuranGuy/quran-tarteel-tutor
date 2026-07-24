"use client";

import { COSMIC_UNITS } from "../../../../lib/cosmic";

export default function TutorProgressReport({ user }) {
  const allAyahs = COSMIC_UNITS.flatMap((unit) => unit.ayahs);
  const mastered = new Set(user.ayahsMastered || []);
  const complete = allAyahs.filter((ayah) => mastered.has(ayah.id)).length;
  const weak = (user.weakAyahs || []).filter((id) => allAyahs.some((ayah) => ayah.id === id));
  const mastery = allAyahs.length ? Math.max(0, Math.round(((complete / allAyahs.length) * 100) - ((weak.length / allAyahs.length) * 100))) : 0;
  return <article style={{ padding: 13, borderRadius: 14, color: "#eaf5ff", background: "rgba(8,21,53,.48)", border: "1px solid rgba(177,216,255,.2)" }}><strong>Your progress constellation</strong><div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 7, marginTop: 10 }}>{[["Mastery", `${mastery}%`], ["Weak ayahs", weak.length], ["XP", user.xp || 0]].map(([label, value]) => <div key={label} style={{ padding: 9, textAlign: "center", borderRadius: 10, background: "rgba(255,255,255,.055)" }}><strong style={{ display: "block" }}>{value}</strong><small style={{ color: "#b9cae3" }}>{label}</small></div>)}</div><p style={{ margin: "10px 0 0", color: "#c4d4ea", fontSize: 13, lineHeight: 1.5 }}>Your streak is {user.streak || 0} days. {weak.length ? `Start with ${weak.slice(0, 2).join(" and ")} in Review Orbit.` : "Keep building confidence with a mastery check."}</p></article>;
}
