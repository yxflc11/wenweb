"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { warp } from "@/lib/warp";
import { useUI } from "./ui-context";

// Drives the pinned warp crescendo. As you scroll through the (tall) manifesto
// zone, progress p (0→1) ramps warp intensity up, holds it full, then eases out,
// and swaps the active statement band by band. Intensity is published to the
// shared store (WebGL streaks) and to a CSS var + data-attribute (DOM backdrop /
// text colour). Mobile, coarse pointers, and reduced motion get a static stack.
export default function WarpDriver() {
  const pathname = usePathname();
  // tick() is gated by the sound toggle internally, so these only sound when the
  // user has enabled audio. Held in a ref so the rAF loop sees the latest.
  const { tick } = useUI();
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;

    // Static fallback: every statement visible, no scrub.
    if (reduce || small) {
      document
        .querySelectorAll<HTMLElement>(".manifesto-line")
        .forEach((el) => el.classList.add("is-active"));
      warp.value = 0;
      root.style.setProperty("--warp", "0");
      root.removeAttribute("data-warp");
      return;
    }

    let raf = 0;
    let current = 0;
    let prevIdx = -1;
    let swellOn = false;

    const measure = () => {
      raf = 0;
      const section = document.querySelector<HTMLElement>(".manifesto");
      const vh = window.innerHeight;
      let target = 0;
      if (section) {
        const lines = Array.from(
          section.querySelectorAll<HTMLElement>(".manifesto-line")
        );
        const top = section.getBoundingClientRect().top + window.scrollY;
        const range = section.offsetHeight - vh;
        const p = range > 0 ? Math.max(0, Math.min(1, (window.scrollY - top) / range)) : 0;
        if (lines.length) {
          // Swap the active statement by which band of the scrub we're in.
          const idx = Math.min(lines.length - 1, Math.floor(p * lines.length));
          lines.forEach((el, i) => el.classList.toggle("is-active", i === idx));
          // Soft, ascending tick as each statement takes over (only mid-warp).
          if (idx !== prevIdx) {
            if (prevIdx !== -1 && current > 0.15) tickRef.current(300 + idx * 70, 0.07, 0.03);
            prevIdx = idx;
          }
          // Trapezoid: build over the first 12%, hold full, ease out over the last.
          const ramp = Math.max(0, Math.min(1, p / 0.12, (1 - p) / 0.12));
          target = ramp * ramp * (3 - 2 * ramp);
        }
      }
      current += (target - current) * 0.16;
      if (current < 0.001) current = 0;
      warp.value = current;
      root.style.setProperty("--warp", current.toFixed(3));
      if (current > 0.45) {
        root.setAttribute("data-warp", "");
        // Low swell the first time we cross into the warp.
        if (!swellOn) {
          swellOn = true;
          tickRef.current(150, 0.5, 0.022);
        }
      } else {
        root.removeAttribute("data-warp");
        if (current < 0.4) swellOn = false;
      }
      if (current > 0.0005 || Math.abs(target - current) > 0.0005)
        raf = requestAnimationFrame(measure);
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
