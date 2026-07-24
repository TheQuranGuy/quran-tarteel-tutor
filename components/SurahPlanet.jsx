"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const themeStyles = {
  opening: { gradient: "linear-gradient(145deg, #fff6b8 0%, #65dfb0 48%, #24566f 100%)", glow: "rgba(255, 235, 137, 0.82)", textColor: "#10231b", particleType: "halo" },
  guidance: { gradient: "linear-gradient(145deg, #c7fff2 0%, #43b8d9 46%, #223d91 100%)", glow: "rgba(105, 227, 255, 0.78)", textColor: "#ffffff", particleType: "book" },
  covenant: { gradient: "linear-gradient(145deg, #d8c7ff 0%, #7455d6 48%, #25165d 100%)", glow: "rgba(181, 151, 255, 0.78)", textColor: "#ffffff", particleType: "stars" },
  justice: { gradient: "linear-gradient(145deg, #fff0b5 0%, #d29f47 48%, #5f3b2a 100%)", glow: "rgba(255, 203, 107, 0.75)", textColor: "#ffffff", particleType: "sand" },
  creation: { gradient: "linear-gradient(145deg, #dbffc7 0%, #5fcf7b 45%, #23686d 100%)", glow: "rgba(127, 235, 157, 0.75)", textColor: "#ffffff", particleType: "leaf" },
  prophets: { gradient: "linear-gradient(145deg, #ffe7ba 0%, #e2875b 45%, #673259 100%)", glow: "rgba(255, 165, 111, 0.76)", textColor: "#ffffff", particleType: "comet" },
  resilience: { gradient: "linear-gradient(145deg, #d8f2ff 0%, #4d8fe9 47%, #252c72 100%)", glow: "rgba(119, 178, 255, 0.78)", textColor: "#ffffff", particleType: "shield" },
  repentance: { gradient: "linear-gradient(145deg, #f0ffd0 0%, #77d57c 48%, #1f5d58 100%)", glow: "rgba(151, 239, 133, 0.76)", textColor: "#ffffff", particleType: "mist" },
  revelation: { gradient: "linear-gradient(145deg, #ffffff 0%, #b7c9ff 45%, #4f3faf 100%)", glow: "rgba(198, 211, 255, 0.86)", textColor: "#ffffff", particleType: "stars" },
  story: { gradient: "linear-gradient(145deg, #ffe5a8 0%, #c98a42 48%, #49305e 100%)", glow: "rgba(255, 191, 103, 0.74)", textColor: "#ffffff", particleType: "book" },
  thunder: { gradient: "linear-gradient(145deg, #faffb0 0%, #6cc7ff 42%, #292d7c 100%)", glow: "rgba(255, 244, 117, 0.84)", textColor: "#ffffff", particleType: "spark" },
  mountain: { gradient: "linear-gradient(145deg, #e8f6d6 0%, #8aa66a 45%, #394c54 100%)", glow: "rgba(195, 222, 150, 0.72)", textColor: "#ffffff", particleType: "dust" },
  nightJourney: { gradient: "linear-gradient(145deg, #cfc2ff 0%, #5f63dd 42%, #13133f 100%)", glow: "rgba(149, 157, 255, 0.82)", textColor: "#ffffff", particleType: "stars" },
  cave: { gradient: "linear-gradient(145deg, #d0ffd6 0%, #5ab783 42%, #263f46 100%)", glow: "rgba(119, 231, 158, 0.74)", textColor: "#ffffff", particleType: "mist" },
  maryam: { gradient: "linear-gradient(145deg, #ffe4f2 0%, #d487d9 45%, #493078 100%)", glow: "rgba(255, 176, 226, 0.78)", textColor: "#ffffff", particleType: "halo" },
  moses: { gradient: "linear-gradient(145deg, #bdfcff 0%, #2197d9 44%, #15336f 100%)", glow: "rgba(88, 219, 255, 0.78)", textColor: "#ffffff", particleType: "water" },
  pilgrimage: { gradient: "linear-gradient(145deg, #fff0b7 0%, #d88b4b 46%, #65411d 100%)", glow: "rgba(255, 196, 103, 0.74)", textColor: "#ffffff", particleType: "sand" },
  light: { gradient: "linear-gradient(145deg, #ffffff 0%, #fff6a8 42%, #60c4a3 100%)", glow: "rgba(255, 249, 168, 0.86)", textColor: "#16332d", particleType: "halo" },
  criterion: { gradient: "linear-gradient(145deg, #e4eeff 0%, #738be7 45%, #222762 100%)", glow: "rgba(150, 171, 255, 0.76)", textColor: "#ffffff", particleType: "shield" },
  poets: { gradient: "linear-gradient(145deg, #ffd9ef 0%, #b96bea 45%, #3f246a 100%)", glow: "rgba(225, 139, 255, 0.76)", textColor: "#ffffff", particleType: "comet" },
  ants: { gradient: "linear-gradient(145deg, #e9ffc0 0%, #7ac663 45%, #31533d 100%)", glow: "rgba(169, 228, 102, 0.74)", textColor: "#ffffff", particleType: "leaf" },
  spider: { gradient: "linear-gradient(145deg, #e9e0ff 0%, #8275bb 45%, #2b2548 100%)", glow: "rgba(180, 165, 255, 0.74)", textColor: "#ffffff", particleType: "web" },
  wisdom: { gradient: "linear-gradient(145deg, #fff7c7 0%, #a7d477 45%, #356a64 100%)", glow: "rgba(230, 232, 119, 0.74)", textColor: "#ffffff", particleType: "book" },
  mercy: { gradient: "linear-gradient(145deg, #ecffd0 0%, #77dfa5 48%, #2f7199 100%)", glow: "rgba(129, 236, 169, 0.74)", textColor: "#ffffff", particleType: "mist" },
  sovereignty: { gradient: "linear-gradient(145deg, #f8e2ff 0%, #8563d7 46%, #251052 100%)", glow: "rgba(206, 151, 255, 0.78)", textColor: "#ffffff", particleType: "crown" },
  resurrection: { gradient: "linear-gradient(145deg, #f1f7ff 0%, #7aa8d8 45%, #233a58 100%)", glow: "rgba(177, 215, 255, 0.76)", textColor: "#ffffff", particleType: "mist" },
  protection: { gradient: "linear-gradient(145deg, #eafff3 0%, #6bd3a6 45%, #244e73 100%)", glow: "rgba(127, 239, 179, 0.76)", textColor: "#ffffff", particleType: "shield" },
  water: { gradient: "linear-gradient(145deg, #bdfcff 0%, #22a6e8 48%, #143877 100%)", glow: "rgba(94, 225, 255, 0.78)", textColor: "#ffffff", particleType: "water" },
  desert: { gradient: "linear-gradient(145deg, #ffe9aa 0%, #d89548 52%, #74401e 100%)", glow: "rgba(255, 196, 103, 0.72)", textColor: "#ffffff", particleType: "sand" },
  night: { gradient: "linear-gradient(145deg, #d7c0ff 0%, #7350cb 48%, #15194f 100%)", glow: "rgba(183, 151, 255, 0.82)", textColor: "#ffffff", particleType: "stars" },
  sunrise: { gradient: "linear-gradient(145deg, #fff7a8 0%, #ffac33 46%, #df5437 100%)", glow: "rgba(255, 188, 63, 0.78)", textColor: "#ffffff", particleType: "sun" },
  fire: { gradient: "linear-gradient(145deg, #ffd089 0%, #f15c2a 45%, #651421 100%)", glow: "rgba(255, 95, 45, 0.82)", textColor: "#ffffff", particleType: "fire" },
  unity: { gradient: "linear-gradient(145deg, #ffffff 0%, #e5fff8 48%, #8bc9dc 100%)", glow: "rgba(255, 255, 255, 0.9)", textColor: "#16332d", particleType: "halo" },
  earth: { gradient: "linear-gradient(145deg, #b9f7c4 0%, #48a878 48%, #195a57 100%)", glow: "rgba(121, 229, 170, 0.72)", textColor: "#ffffff", particleType: "stars" },
};

const surahThemeKeys = {
  1: "opening", 2: "guidance", 3: "covenant", 4: "justice", 5: "covenant", 6: "creation", 7: "prophets", 8: "resilience", 9: "repentance", 10: "revelation",
  11: "prophets", 12: "story", 13: "thunder", 14: "revelation", 15: "mountain", 16: "creation", 17: "nightJourney", 18: "cave", 19: "maryam", 20: "moses",
  21: "prophets", 22: "pilgrimage", 23: "resilience", 24: "light", 25: "criterion", 26: "poets", 27: "ants", 28: "moses", 29: "spider", 30: "revelation",
  31: "wisdom", 32: "revelation", 33: "covenant", 34: "creation", 35: "mercy", 36: "resurrection", 37: "stars", 38: "prophets", 39: "revelation", 40: "mercy",
  41: "revelation", 42: "covenant", 43: "revelation", 44: "night", 45: "justice", 46: "desert", 47: "resilience", 48: "opening", 49: "justice", 50: "resurrection",
  51: "comet", 52: "mountain", 53: "stars", 54: "night", 55: "mercy", 56: "resurrection", 57: "light", 58: "justice", 59: "protection", 60: "covenant",
  61: "resilience", 62: "light", 63: "justice", 64: "resurrection", 65: "justice", 66: "protection", 67: "sovereignty", 68: "wisdom", 69: "resurrection", 70: "stars",
  71: "water", 72: "night", 73: "night", 74: "fire", 75: "resurrection", 76: "mercy", 77: "comet", 78: "resurrection", 79: "comet", 80: "wisdom",
  81: "fire", 82: "stars", 83: "justice", 84: "resurrection", 85: "stars", 86: "night", 87: "mercy", 88: "resurrection", 89: "sunrise", 90: "mountain",
  91: "sunrise", 92: "night", 93: "sunrise", 94: "mercy", 95: "creation", 96: "revelation", 97: "night", 98: "revelation", 99: "resurrection", 100: "resilience",
  101: "resurrection", 102: "earth", 103: "wisdom", 104: "fire", 105: "desert", 106: "protection", 107: "mercy", 108: "water", 109: "unity", 110: "opening",
  111: "fire", 112: "unity", 113: "protection", 114: "protection",
};

function getThemeKey(id, theme = "", name = "") {
  const text = `${theme} ${name}`.toLowerCase();

  if (text.includes("kawthar") || text.includes("river") || text.includes("water")) return "water";
  if (text.includes("fil") || text.includes("elephant") || text.includes("makkah") || text.includes("desert")) return "desert";
  if (text.includes("qadr") || text.includes("night") || text.includes("power")) return "night";
  if (text.includes("duha") || text.includes("sunrise") || text.includes("morning") || text.includes("dawn")) return "sunrise";
  if (text.includes("masad") || text.includes("fire") || text.includes("lava")) return "fire";
  if (text.includes("ikhlas") || text.includes("unity") || text.includes("pure")) return "unity";

  return surahThemeKeys[Number(id)] || "earth";
}

function particleSet(type) {
  const shared = { position: "absolute", borderRadius: "999px", pointerEvents: "none" };
  const presets = {
    stars: ["#ffffff", "#fff2a6", "#d9f8ff", "#ffffff"],
    water: ["rgba(215,255,255,.9)", "rgba(178,241,255,.82)", "rgba(232,255,255,.78)", "rgba(153,229,255,.72)"],
    fire: ["#ffd36b", "#ff8b3d", "#fff07c", "#ff6836"],
    sand: ["rgba(255,237,177,.86)", "rgba(255,210,126,.72)", "rgba(255,231,168,.8)", "rgba(232,173,89,.72)"],
    sun: ["rgba(255,255,184,.9)", "rgba(255,226,102,.82)", "rgba(255,181,72,.78)", "rgba(255,244,153,.72)"],
    halo: ["rgba(255,255,255,.9)", "rgba(232,255,248,.86)", "rgba(255,255,255,.78)", "rgba(214,255,238,.72)"],
    leaf: ["rgba(205,255,184,.85)", "rgba(125,231,151,.78)", "rgba(234,255,205,.76)", "rgba(86,205,133,.72)"],
    comet: ["rgba(255,229,166,.9)", "rgba(189,218,255,.82)", "rgba(255,177,218,.74)", "rgba(255,255,255,.76)"],
    shield: ["rgba(214,238,255,.9)", "rgba(130,183,255,.78)", "rgba(255,255,255,.72)", "rgba(137,232,208,.72)"],
    mist: ["rgba(229,255,241,.78)", "rgba(173,236,214,.68)", "rgba(255,255,255,.58)", "rgba(157,225,255,.62)"],
    book: ["rgba(255,245,184,.86)", "rgba(255,255,255,.72)", "rgba(167,229,255,.68)", "rgba(225,255,198,.7)"],
    spark: ["rgba(255,247,118,.92)", "rgba(128,226,255,.82)", "rgba(255,255,255,.74)", "rgba(255,198,75,.76)"],
    dust: ["rgba(221,232,190,.82)", "rgba(171,190,145,.72)", "rgba(244,238,197,.68)", "rgba(155,172,149,.66)"],
    web: ["rgba(236,229,255,.82)", "rgba(184,174,224,.72)", "rgba(255,255,255,.7)", "rgba(151,141,190,.68)"],
    crown: ["rgba(255,234,153,.9)", "rgba(232,189,255,.78)", "rgba(255,255,255,.72)", "rgba(188,150,255,.74)"],
  };
  const positions = [
    { top: "18%", left: "24%", size: 4, delay: 0 },
    { top: "34%", left: "70%", size: 3, delay: 0.3 },
    { top: "66%", left: "56%", size: 5, delay: 0.6 },
    { top: "72%", left: "26%", size: 3, delay: 0.9 },
  ];
  const colors = presets[type] || presets.stars;

  return positions.map((particle, index) => (
    <motion.span
      key={`${type}-${index}`}
      style={{
        ...shared,
        top: particle.top,
        left: particle.left,
        width: particle.size,
        height: particle.size,
        background: colors[index],
        boxShadow: `0 0 ${particle.size * 3}px ${colors[index]}`,
      }}
      animate={{
        opacity: [0.35, 1, 0.35],
        y: type === "fire" || type === "spark" ? [4, -8, 4] : [-3, 3, -3],
        x: type === "sand" || type === "dust" ? [-2, 4, -2] : 0,
        scale: [0.8, 1.25, 0.8],
      }}
      transition={{
        duration: type === "fire" || type === "spark" ? 1.25 : 2.2,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));
}

export default function SurahPlanet({
  id,
  name,
  theme,
  orbitRadius = 140,
  orbitSpeed = 42,
  startAngle = 0,
  reverse = false,
  compact = false,
}) {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const themeKey = getThemeKey(id, theme, name);
  const themeStyle = themeStyles[themeKey] || themeStyles.earth;
  const direction = reverse ? -360 : 360;

  function handlePlanetClick(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    event.preventDefault();
    setIsLaunching(true);
    window.setTimeout(() => {
      router.push(`/surah/${id}`);
    }, 260);
  }

  return (
    <motion.div
      className="surah-orbit-path"
      style={{
        width: `${orbitRadius * 2}px`,
        height: `${orbitRadius * 2}px`,
      }}
      initial={{ rotate: startAngle }}
      animate={{ rotate: startAngle + direction }}
      transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="surah-orbit-counter"
        initial={{ rotate: -startAngle }}
        animate={{ rotate: -(startAngle + direction) }}
        transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="surah-orbit-hover"
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          variants={{
            rest: { scale: 1, y: 0, boxShadow: `0 0 18px ${themeStyle.glow}` },
            hover: { scale: 1.15, y: -7, boxShadow: `0 0 34px ${themeStyle.glow}` },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          style={{ borderRadius: "999px" }}
        >
          {isLaunching && (
            <>
              <motion.span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-16px",
                  zIndex: 4,
                  border: `2px solid ${themeStyle.glow}`,
                  borderRadius: "999px",
                  boxShadow: `0 0 28px ${themeStyle.glow}`,
                  pointerEvents: "none",
                }}
                initial={{ opacity: 0.95, scale: 0.78 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
              <motion.span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-2px",
                  zIndex: 4,
                  borderRadius: "999px",
                  background: themeStyle.glow,
                  filter: "blur(14px)",
                  pointerEvents: "none",
                }}
                initial={{ opacity: 0.35, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
              />
            </>
          )}

          <Link
            className={`surah-orbit-planet planet-${themeKey}${compact ? " compact-planet" : ""}`}
            href={`/surah/${id}`}
            aria-label={`Open Surah ${name}`}
            onClick={handlePlanetClick}
            style={{
              background: themeStyle.gradient,
              color: themeStyle.textColor,
              borderColor: themeStyle.glow,
              boxShadow: `inset -14px -14px 22px rgba(0, 0, 0, 0.28), inset 11px 10px 18px rgba(255, 255, 255, 0.22), 0 0 20px ${themeStyle.glow}`,
            }}
          >
            <motion.span
              className="planet-glow"
              style={{ background: themeStyle.glow }}
              variants={{ rest: { opacity: 0.42, scale: 1 }, hover: { opacity: 0.85, scale: 1.18 } }}
              transition={{ duration: 0.25 }}
            />

            <motion.span className="planet-surface" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>
              <span className="surface-band band-one" />
              <span className="surface-band band-two" />
              <span className="surface-particles">{particleSet(themeStyle.particleType)}</span>
            </motion.span>

            <span className="surah-planet-copy">
              <strong>{id}</strong>
              <small>{name}</small>
            </span>
          </Link>

          <motion.span
            className="planet-tooltip planet-enter-tooltip"
            variants={{ rest: { opacity: 0, y: -6, scale: 0.96 }, hover: { opacity: 1, y: 0, scale: 1 } }}
            transition={{ duration: 0.18 }}
            style={{
              top: "auto",
              bottom: "calc(100% + 14px)",
              display: "grid",
              gap: "0.14rem",
              textAlign: "center",
              whiteSpace: "nowrap",
              borderColor: themeStyle.glow,
              boxShadow: `0 12px 34px rgba(0, 0, 0, 0.28), 0 0 22px ${themeStyle.glow}`,
            }}
          >
            <strong>{name}</strong>
            <small>Surah {id}</small>
            <span>Enter Surah World</span>
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
