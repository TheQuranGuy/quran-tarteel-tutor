"use client";

export default function SocialLeaderboard({ people }) {
  const ranked = [...people].sort((left, right) => right.xp - left.xp || right.mastery - left.mastery).slice(0, 6);
  return <section className="cosmic-bright-card" style={{ padding: 16, borderRadius: 20 }}><p style={{ margin: 0, color: "#ffdb8a", fontSize: 11, fontWeight: 900, letterSpacing: ".13em" }}>ORBIT LEADERBOARD</p><h2 style={{ margin: "5px 0 13px" }}>Brightest learners</h2><div style={{ display: "grid", gap: 8 }}>{ranked.map((person, index) => <div key={person.id} style={{ display: "grid", gridTemplateColumns: "26px 1fr auto", gap: 8, alignItems: "center", padding: "9px 8px", borderRadius: 12, color: "#eaf5ff", background: person.isYou ? "rgba(110,232,187,.15)" : "rgba(255,255,255,.045)" }}><strong style={{ color: index < 3 ? "#ffdc86" : "#aebfda" }}>#{index + 1}</strong><span>{person.avatar} {person.name}</span><small style={{ color: "#a9f3ca", fontWeight: 900 }}>{person.xp} XP · {person.mastery}%</small></div>)}</div></section>;
}
