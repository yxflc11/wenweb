import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type Origin = { x: number; y: number };

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function useTheme() {
  // SSR-safe default; corrected on mount from the saved choice or the OS.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("bw-theme");
    } catch {
      /* ignore */
    }
    if (saved === "light" || saved === "dark") {
      document.documentElement.dataset.theme = saved;
      setTheme(saved);
      return;
    }
    // No explicit choice: follow the system, and leave data-theme unset so the
    // CSS media query drives the palette. Track changes for the toggle label.
    setTheme(mq.matches ? "dark" : "light");
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(
    (origin?: Origin) => {
      setTheme((prev) => {
        const next: Theme = prev === "dark" ? "light" : "dark";
        try {
          localStorage.setItem("bw-theme", next);
        } catch {
          /* ignore */
        }
        const apply = () => {
          document.documentElement.dataset.theme = next;
        };
        const doc = document as ViewTransitionDoc;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (origin && doc.startViewTransition && !reduce) {
          const vt = doc.startViewTransition(apply);
          vt.ready.then(() => {
            const { x, y } = origin;
            const r = Math.hypot(
              Math.max(x, window.innerWidth - x),
              Math.max(y, window.innerHeight - y)
            );
            document.documentElement.animate(
              {
                clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`]
              },
              {
                duration: 620,
                easing: "cubic-bezier(.22,1,.36,1)",
                pseudoElement: "::view-transition-new(root)"
              }
            );
          });
        } else {
          apply();
        }
        return next;
      });
    },
    []
  );

  return { theme, toggle };
}
