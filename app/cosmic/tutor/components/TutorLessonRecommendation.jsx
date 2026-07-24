"use client";

import Link from "next/link";
import { COSMIC_UNITS } from "../../../../lib/cosmic";

export default function TutorLessonRecommendation({ user }) {
  const mastered = new Set(user.ayahsMastered || []);
  const next = COSMIC_UNITS.flatMap((unit) => unit.ayahs.map((ayah) => ({ ...ayah, unit }))).find((ayah) => !mastered.has(ayah.id));
  const weak = user.weakAyahs || [];
  return <article style={{ padding: 13, borderRadius: 14, color: "#eaf5ff", background: "rgba(8,21,53,.48)", border: "1px solid rgba(177,216,255,.2)", display: "grid", gap: 10 }}><strong>Recommended next orbit</strong>{next ? <p style={{ margin: 0, color: "#c4d4ea", lineHeight: 1.5 }}>Continue with <b>{next.unit.name}, ayah {next.number}</b>: “{next.translation}”</p> : <p style={{ margin: 0, color: "#c4d4ea" }}>You have mastered the currently available Quran Tarteel sample ayahs—try a mastery test.</p>}<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link href={next ? `/cosmic/lessons/${next.unit.id}/${next.number}` : "/cosmic/mastery"} className="cosmic-button">{next ? "Open lesson" : "Mastery test"}</Link>{weak.length ? <Link href="/cosmic/review" className="cosmic-button cosmic-button--outline">Review {weak.length} weak ayah{weak.length === 1 ? "" : "s"}</Link> : <Link href="/cosmic/challenge" className="cosmic-button cosmic-button--outline">Daily challenge</Link>}</div></article>;
}
