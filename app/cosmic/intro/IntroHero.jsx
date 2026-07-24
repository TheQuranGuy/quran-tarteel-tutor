"use client";

export default function IntroHero({ title = "Welcome to Quran Tarteel", subtitle = "Your Qur'an journey begins in the cosmos." }) { return <div className="cd-intro-copy-block"><h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2.6rem,8vw,4.5rem)", letterSpacing: "-.06em" }}>{title}</h1><p style={{ margin: "0 auto 26px", maxWidth: 370, color: "#c3d1ed", lineHeight: 1.65 }}>{subtitle}</p></div>; }
