"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { juzList } from "../../lib/juz";

function SpiralGalaxy({ juz, index }) {
  return (
    <motion.div
      className="spiral-galaxy-shell"
      initial={{ opacity: 0, scale: 0.72, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.025, type: "spring", stiffness: 160, damping: 18 }}
      whileHover={{ scale: 1.08, y: -8 }}
    >
      <Link className={`spiral-galaxy galaxy-tone-${(index % 6) + 1}`} href={`/galaxies/${juz.id}`}>
        <motion.span
          className="spiral-disc"
          animate={{ rotate: 360, scale: [1, 1.04, 1] }}
          transition={{
            rotate: { duration: 28 + (index % 5) * 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="spiral-arm arm-one" />
          <span className="spiral-arm arm-two" />
          <span className="spiral-arm arm-three" />
          <span className="spiral-core" />
          <span className="spiral-stars" />
        </motion.span>
        <span className="spiral-label">
          <strong>{juz.name}</strong>
          <small>{juz.surahs.length} Surah {juz.surahs.length === 1 ? "planet" : "planets"}</small>
        </span>
      </Link>
    </motion.div>
  );
}

export default function GalaxiesPage() {
  return (
    <main className="page galaxy-page orbit-galaxy-page">
      <motion.header
        className="page-heading"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <p className="eyebrow">30 Juz Qur&apos;an map</p>
        <h1>Orbit Galaxy System</h1>
        <p className="lead">Each Juz is a rotating spiral galaxy. Enter one to watch its Surah planets orbit.</p>
      </motion.header>

      <section className="spiral-galaxy-grid" aria-label="Qur'an Juz galaxies">
        {juzList.map((juz, index) => (
          <SpiralGalaxy key={juz.id} juz={juz} index={index} />
        ))}
      </section>
    </main>
  );
}
