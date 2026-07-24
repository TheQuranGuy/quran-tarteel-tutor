"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { addXP, getUser, updateUser } from "../../lib/user";

export default function RewardChest({ id, reward = 15, label = "Open reward chest" }) {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setOpened(Boolean(getUser().cosmicOpenedChests?.includes(id)));
  }, [id]);
  function open() {
    if (opened) return;
    const user = getUser();
    updateUser({ cosmicOpenedChests: [...new Set([...(user.cosmicOpenedChests || []), id])], cosmicBadges: [...new Set([...(user.cosmicBadges || []), "Star seeker"])] });
    addXP(reward, label);
    setOpened(true);
  }
  return <motion.button type="button" className="cd-reward" onClick={open} whileHover={!opened ? { scale: 1.06, y: -3 } : {}} whileTap={!opened ? { scale: .96 } : {}} style={{ border: "1px solid #ffd86a", borderRadius: 14, padding: "11px 14px", cursor: opened ? "default" : "pointer", color: "#302000", background: opened ? "#a9c5b5" : "linear-gradient(135deg,#fff3a7,#e9ae32)", fontWeight: 900, boxShadow: opened ? "none" : "0 0 20px rgba(255,209,77,.34)" }}>{opened ? "Reward collected" : `Chest +${reward} XP`}</motion.button>;
}
