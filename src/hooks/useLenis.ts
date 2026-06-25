import { useEffect } from "react";
import Lenis from "lenis";

// Smooth inertia scrolling. Exposes the instance on window.__lenis so anchor
// scrolling can hand off to it. Disabled when the user prefers reduced motion.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [enabled]);
}

export function scrollTo(target: string | number) {
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { duration: 1.2 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}
