"use client";

import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import SurahPlanet from "../../../components/SurahPlanet";
import { getJuzById } from "../../../lib/juz";
import { getSurahPlanet } from "../../../lib/surahs";

function getOrbitRingCount(totalSurahs) {
  if (totalSurahs <= 4) return 1;
  if (totalSurahs <= 10) return 2;
  if (totalSurahs <= 20) return 3;
  return 4;
}

function buildOrbitPlanets(planets) {
  const ringCount = getOrbitRingCount(planets.length);
  const weights = {
    1: [1],
    2: [0.4, 0.6],
    3: [0.25, 0.35, 0.4],
    4: [0.16, 0.22, 0.27, 0.35],
  }[ringCount];
  let remainingPlanets = planets.length;
  const ringCapacities = weights.map((weight, index) => {
    const ringsLeft = ringCount - index;
    if (ringsLeft === 1) return remainingPlanets;
    const capacity = Math.max(1, Math.round(planets.length * weight));
    const safeCapacity = Math.min(capacity, remainingPlanets - (ringsLeft - 1));
    remainingPlanets -= safeCapacity;
    return safeCapacity;
  });
  const rings = Array.from({ length: ringCount }, () => []);
  let ringIndex = 0;
  let usedInRing = 0;

  planets.forEach((planet, index) => {
    rings[ringIndex].push({ ...planet, originalIndex: index });
    usedInRing += 1;

    if (usedInRing >= ringCapacities[ringIndex] && ringIndex < ringCount - 1) {
      ringIndex += 1;
      usedInRing = 0;
    }
  });

  return rings.flatMap((ring, ringIndex) => {
    const orbitRadius = 135 + ringIndex * 92;
    const orbitSpeed = 42 + ringIndex * 18;

    return ring.map((planet, slotIndex) => ({
      ...planet,
      orbitRadius,
      orbitSpeed: orbitSpeed + (slotIndex % 4) * 2,
      startAngle: (360 / ring.length) * slotIndex + ringIndex * 18,
      ringIndex,
    }));
  });
}

export default function JuzGalaxyPage({ params }) {
  const { juzId } = use(params);
  const juz = getJuzById(juzId);

  if (!juz) {
    return (
      <main className="page">
        <Link className="text-link" href="/galaxies">Back to galaxies</Link>
        <h1>Juz not found</h1>
      </main>
    );
  }

  const planets = juz.surahs.map(getSurahPlanet).filter(Boolean);
  const orbitPlanets = buildOrbitPlanets(planets);
  const ringCount = getOrbitRingCount(planets.length);

  return (
    <main className="page galaxy-page orbit-galaxy-page">
      <motion.header
        className="page-heading"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <Link className="text-link" href="/galaxies">Back to all galaxies</Link>
        <p className="eyebrow">Qur&apos;an orbit map</p>
        <h1>{juz.name}</h1>
        <p className="lead">Surah planets orbit this Juz. Pick a planet to open your ayah reader.</p>
      </motion.header>

      <motion.section
        className={`orbit-system orbit-rings-${ringCount}`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-label={`${juz.name} Surah orbit system`}
      >
        <motion.div
          className="galaxy-center"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 42, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="center-core" />
          <span className="center-arm center-arm-one" />
          <span className="center-arm center-arm-two" />
          <span className="center-arm center-arm-three" />
        </motion.div>

        {Array.from({ length: ringCount }).map((_, index) => (
          <motion.span
            key={index}
            className="orbit-ring"
            style={{
              width: `${270 + index * 184}px`,
              height: `${270 + index * 184}px`,
            }}
            animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 90 + index * 18, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {orbitPlanets.map((surah) => (
          <SurahPlanet
            key={`${surah.id}-${surah.ringIndex}-${surah.startAngle}`}
            id={surah.number}
            name={surah.name}
            theme={surah.theme}
            orbitRadius={surah.orbitRadius}
            orbitSpeed={surah.orbitSpeed}
            startAngle={surah.startAngle}
            reverse={surah.ringIndex % 2 === 1}
            compact={planets.length > 20}
          />
        ))}
      </motion.section>

      <section className="orbit-surah-list" aria-label={`${juz.name} Surahs`}>
        {planets.map((surah) => (
          <Link key={surah.id} href={`/surah/${surah.number}`}>
            <strong>{surah.number}. {surah.name}</strong>
            <span>{surah.theme}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
