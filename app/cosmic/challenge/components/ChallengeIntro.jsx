"use client";

import { motion } from "framer-motion";

export default function ChallengeIntro({ completed, onStart, onLeaderboard }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="cosmic-bright-card cosmic-challenge-card cosmic-challenge-hero"
      style={{ padding: "clamp(24px, 6vw, 48px)", borderRadius: 28, textAlign: "center" }}
    >
      <div aria-hidden="true" style={{ fontSize: 62, filter: "drop-shadow(0 0 20px #ffd66f)" }}>✦</div>
      <p className="cosmic-review-label" style={{ margin: "8px 0", color: "#ffd98b", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>DAILY COSMIC TRIAL</p>
      <h1 style={{ margin: "0 0 12px", fontSize: "clamp(2.4rem, 8vw, 5.5rem)", lineHeight: 0.94, letterSpacing: "-.07em" }}>
        Ready for today&apos;s trial?
      </h1>
      <p style={{ maxWidth: 570, margin: "0 auto 24px", color: "#c7d6ec", lineHeight: 1.65 }}>
        Answer five ayah meaning questions before the star timer fades. Three lives, double XP, one attempt each day.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
        {["75 seconds", "3 lives", "2× XP"].map((item) => <span key={item} style={{ padding: "9px 13px", borderRadius: 99, background: "rgba(135,219,255,.12)", border: "1px solid rgba(154,225,255,.25)", color: "#d9f7ff", fontWeight: 800 }}>{item}</span>)}
      </div>
      {completed ? (
        <>
          <p style={{ color: "#a9f5cb", fontWeight: 850 }}>Today&apos;s trial is complete. A new one appears after your next local midnight.</p>
          <button type="button" onClick={onLeaderboard} className="cosmic-button cosmic-button--outline">View today&apos;s board</button>
        </>
      ) : (
        <motion.button type="button" whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }} onClick={onStart} className="cosmic-button">Start challenge</motion.button>
      )}
    </motion.section>
  );
}
