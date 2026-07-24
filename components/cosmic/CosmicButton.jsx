"use client";

import { motion } from "framer-motion";

export default function CosmicButton({ children, variant = "mint", type = "button", ...props }) {
  return <motion.button type={type} className={`cosmic-button cosmic-button--${variant} cd-action`} whileTap={{ scale: .96 }} {...props}>{children}</motion.button>;
}
