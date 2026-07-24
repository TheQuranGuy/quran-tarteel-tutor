"use client";

import { useMemo, useState } from "react";
import { getCosmicAyah } from "../../../lib/cosmic";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import StarParticles from "../../../components/cosmic/StarParticles";
import WeakAyahList from "./components/WeakAyahList";
import ReviewSession from "./components/ReviewSession";

export default function CosmicReviewPage() {
  const user = useCosmicUser();
  const [session, setSession] = useState(null);
  const weakAyahs = useMemo(() => (user.weakAyahs || []).map(getCosmicAyah).filter(Boolean), [user.weakAyahs]);
  const mastered = useMemo(() => new Set(user.ayahsMastered || []), [user.ayahsMastered]);

  return (
    <main className="cosmic-dark cosmic-learning-shell cosmic-review-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}>
      <StarParticles color="#c5b7ff" />
      <section style={{ position: "relative", width: "min(820px,100%)", margin: "0 auto" }}>
        <header className="cosmic-review-hero" style={{ marginBottom: 28 }}>
          <p className="cosmic-review-label" style={{ margin: 0, color: "#ffd98b", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>COSMIC MEMORY ENGINE</p>
          <h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.065em" }}>Review your weak ayahs.</h1>
          <p style={{ maxWidth: 560, color: "#c2d0e8", lineHeight: 1.65 }}>Focused review turns a difficult ayah into a familiar star on your path.</p>
        </header>
        {session ? <ReviewSession ayahs={session} onFinish={() => setSession(null)} /> : <WeakAyahList ayahs={weakAyahs} mastered={mastered} onStart={setSession} />}
      </section>
    </main>
  );
}
