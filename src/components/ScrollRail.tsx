"use client";

import { useEffect, useRef } from "react";

// Thin right-edge scroll-progress indicator (haoqi-style): a fixed track with a
// short thumb whose position tracks how far down the page you are.
export default function ScrollRail() {
  const thumbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const thumb = thumbRef.current;
      const rail = thumb?.parentElement;
      if (!thumb || !rail) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const travel = rail.clientHeight - thumb.clientHeight;
      thumb.style.transform = `translateY(${p * travel}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <span className="scroll-thumb" ref={thumbRef} />
    </div>
  );
}
