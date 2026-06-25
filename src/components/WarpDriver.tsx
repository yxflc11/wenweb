"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { warp } from "@/lib/warp";

// Drives the warp transition: intensity = how much of the viewport the manifesto
// zone currently covers. Publishes it to the shared store (for the WebGL canvas)
// and to a CSS variable + data-attribute (for the DOM backdrop / text colour).
export default function WarpDriver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let current = 0;

    const measure = () => {
      raf = 0;
      const el = document.querySelector<HTMLElement>(".manifesto");
      const vh = window.innerHeight;
      let target = 0;
      if (el) {
        const r = el.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        // Ease the coverage so the band ramps in/out smoothly.
        const cov = Math.min(1, overlap / vh);
        target = cov * cov * (3 - 2 * cov);
      }
      current += (target - current) * 0.18;
      if (current < 0.001) current = 0;
      warp.value = current;
      root.style.setProperty("--warp", current.toFixed(3));
      if (current > 0.45) root.setAttribute("data-warp", "");
      else root.removeAttribute("data-warp");
      if (current > 0.0005 || target > 0.0005) raf = requestAnimationFrame(measure);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      warp.value = 0;
      root.style.setProperty("--warp", "0");
      root.removeAttribute("data-warp");
    };
  }, [pathname]);

  return null;
}
