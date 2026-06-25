"use client";

import { createContext, useContext } from "react";
import type { Theme, Origin } from "@/hooks/useTheme";

export type UI = {
  theme: Theme;
  soundOn: boolean;
  toggleTheme: (origin?: Origin) => void;
  toggleSound: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  onNavSection: (hash: string) => void;
  hoverTick: () => void;
  tick: (freq?: number, dur?: number, gain?: number) => void;
};

const UICtx = createContext<UI | null>(null);

export const UIProvider = UICtx.Provider;

export function useUI(): UI {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI must be used within <Shell>");
  return ctx;
}
