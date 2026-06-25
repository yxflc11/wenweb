"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type PreviewState = {
  active: string | null;
  setActive: (src: string | null) => void;
};

const PreviewCtx = createContext<PreviewState>({
  active: null,
  setActive: () => {}
});

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <PreviewCtx.Provider value={value}>{children}</PreviewCtx.Provider>;
}

export const usePreview = () => useContext(PreviewCtx);
