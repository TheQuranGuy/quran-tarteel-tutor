"use client";

import Link from "next/link";
export default function ProfileAchievements({ count }) { return <section className="cosmic-bright-card" style={{ padding: 18, borderRadius: 20 }}><p style={{ margin: 0, color: "#ffdc8a", fontSize: 11, fontWeight: 900 }}>REWARDS</p><h2 style={{ margin: "5px 0" }}>{count} badge{count === 1 ? "" : "s"} unlocked</h2><p style={{ margin: "0 0 13px", color: "#c3d3e9", fontSize: 13 }}>Every milestone adds a new light to your constellation.</p><Link href="/cosmic/achievements" className="cosmic-button cosmic-button--outline">View achievements</Link></section>; }
