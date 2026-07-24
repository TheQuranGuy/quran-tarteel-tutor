"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addXP as persistXp, getUser, updateUser } from "../lib/user";

const XPContext = createContext(null);

export function XPProvider({ children }) {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const syncXp = () => setXp(getUser().xp);
    syncXp();
    window.addEventListener("sheikhduo-xp-changed", syncXp);
    window.addEventListener("sheikhduo-user-changed", syncXp);
    return () => {
      window.removeEventListener("sheikhduo-xp-changed", syncXp);
      window.removeEventListener("sheikhduo-user-changed", syncXp);
    };
  }, []);

  const value = useMemo(() => ({
    xp,
    addXp: (amount) => { const updated = persistXp(amount); setXp(updated); return updated; },
    resetXp: () => { updateUser({ xp: 0, dailyXp: 0 }); setXp(0); return 0; },
  }), [xp]);

  return <XPContext.Provider value={value}>{children}</XPContext.Provider>;
}

export function useXp() {
  const context = useContext(XPContext);
  if (!context) throw new Error("useXp must be used inside XPProvider");
  return context;
}
