"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "run" | "exit" | "gone";

// Cinematic loader: masked line reveals + a counter and progress bar that fill,
// then the whole panel wipes up to hand off to the hero.
export default function Intro() {
  const [phase, setPhase] = useState<Phase>("run");
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = () => {
      setPhase("exit");
      window.setTimeout(() => setPhase("gone"), 1050);
    };
    if (reduced) {
      const t = window.setTimeout(leave, 250);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    const duration = 1700;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out for a weighty finish
      const eased = 1 - Math.pow(1 - p, 2);
      if (countRef.current) {
        countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(leave, 360);
    };

    const ready =
      document.fonts && document.fonts.ready
        ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])
        : Promise.resolve();
    ready.then(() => {
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`intro ${phase === "exit" ? "is-exit" : ""}`} aria-hidden="true">
      <div className="intro-inner">
        <div className="intro-row intro-row--top">
          <span className="mask" style={{ "--d": "120ms" } as React.CSSProperties}>
            <span>Portfolio — Archive</span>
          </span>
          <span className="mask" style={{ "--d": "200ms" } as React.CSSProperties}>
            <span>©&nbsp;2026</span>
          </span>
        </div>

        <div className="intro-center">
          <h1 className="intro-name">
            <span className="mask" style={{ "--d": "280ms" } as React.CSSProperties}>
              <span>Bingwen</span>
            </span>
            <span className="mask" style={{ "--d": "380ms" } as React.CSSProperties}>
              <span>He</span>
            </span>
          </h1>
          <span className="mask intro-tagline" style={{ "--d": "520ms" } as React.CSSProperties}>
            <span>Design &amp; Engineering</span>
          </span>
        </div>

        <div className="intro-row intro-row--bottom">
          <span className="mask" style={{ "--d": "600ms" } as React.CSSProperties}>
            <span className="intro-status">Loading experience</span>
          </span>
          <span className="intro-count" ref={countRef}>
            000
          </span>
        </div>

        <div className="intro-bar">
          <span className="intro-bar-fill" ref={barRef} />
        </div>
      </div>
    </div>
  );
}
