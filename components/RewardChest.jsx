"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { addXP, updateUser } from "../lib/user";

export default function RewardChest({ id, reward = 15, label = "Treasure chest" }) {
  const [opened, setOpened] = useState(false);

  function openChest() {
    if (opened) return;
    setOpened(true);
    addXP(reward, label);
    updateUser((user) => ({
      ...user,
      openedChests: Array.from(new Set([...(user.openedChests || []), id])),
      badges: Array.from(new Set([...(user.badges || []), "Cosmic Collector"])),
    }));
  }

  return (
    <motion.button
      type="button"
      onClick={openChest}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.94 }}
      animate={opened ? { rotate: [0, -4, 4, 0], scale: [1, 1.08, 1] } : { y: [0, -4, 0] }}
      transition={{ duration: opened ? 0.5 : 2.4, repeat: opened ? 0 : Infinity, ease: "easeInOut" }}
      style={{
        minWidth: 112,
        padding: "14px 16px",
        border: "1px solid rgba(255,243,156,.45)",
        borderRadius: 14,
        color: opened ? "#10231b" : "#fff39c",
        background: opened ? "linear-gradient(135deg,#fff39c,#79e5aa)" : "rgba(255,243,156,.1)",
        boxShadow: "0 0 28px rgba(255,243,156,.24)",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      <span style={{ display: "block", fontSize: 28 }}>{opened ? "Open" : "Chest"}</span>
      <small>{opened ? `+${reward} XP claimed` : `${reward} XP`}</small>
    </motion.button>
  );
}
