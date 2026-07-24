"use client";

import { motion } from "framer-motion";

export default function StoreBundleCard({ item, owned, onSelect }) { return <motion.article whileHover={{ y: -4 }} style={{ padding: 20, borderRadius: 22, color: "#f4f9ff", background: "radial-gradient(circle at 80% 10%,rgba(255,223,119,.3),transparent 28%),linear-gradient(135deg,#38275c,#173e64)", border: "1px solid rgba(255,221,132,.32)" }}><p style={{ margin: 0, color: "#ffedab", fontSize: 12, fontWeight: 900, letterSpacing: ".13em" }}>BUNDLE · SAVE {item.savings}</p><h2 style={{ margin: "7px 0" }}>{item.name}</h2><p style={{ margin: "0 0 13px", color: "#d1e1f3", lineHeight: 1.5 }}>{item.description}</p><p style={{ margin: "0 0 14px", color: "#ffebb0", fontWeight: 900 }}>{item.contents}</p><button type="button" onClick={() => onSelect(item)} className={owned ? "cosmic-button cosmic-button--outline" : "cosmic-button"}>{owned ? "Owned" : `${item.price} ✦`}</button></motion.article>; }
