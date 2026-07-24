"use client";

import { motion } from "framer-motion";
import { juzList } from "../../../../lib/juz";

export default function GalaxyMiniMap({ onHover, onLeave, onSelect }) { return <aside style={{ pointerEvents: "auto", width: 225, padding: 14, border: "1px solid rgba(184,219,255,.19)", borderRadius: 16, color: "#dbeaff", background: "rgba(8,15,44,.76)", backdropFilter: "blur(12px)" }}><strong style={{ display: "block", marginBottom: 9 }}>Juz mini-map</strong><div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 7 }}>{juzList.map((juz) => <motion.button key={juz.id} type="button" onMouseEnter={(event) => onHover?.({ name: juz.name, detail: `${juz.surahs.length} Surah planets` }, event)} onMouseLeave={onLeave} onClick={() => onSelect?.(juz)} whileHover={{ scale: 1.2 }} style={{ aspectRatio: "1", border: 0, borderRadius: "50%", cursor: "pointer", color: "#09142d", background: `hsl(${210 + juz.id * 4} 78% 74%)`, fontSize: 10, fontWeight: 950 }}>{juz.id}</motion.button>)}</div></aside>; }
