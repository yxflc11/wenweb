"use client";

import { useEffect, useRef, useState } from "react";
import { useClock } from "@/hooks/useClock";

function Globe() {
  // Wireframe globe; CSS flips it horizontally on a 2.6s loop (haoqi-style).
  return (
    <svg className="foot-globe" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="12" cy="12" rx="4" ry="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Fixed bottom chrome: clock + weather (left), live cursor coordinates (centre),
// rotating globe + year range (right).
export default function Readout() {
  const time = useClock();
  const [temp, setTemp] = useState<string | null>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  // Real current temperature for the configured coordinates (no API key,
  // CORS-enabled). Fails silently — the temp just won't show.
  useEffect(() => {
    let alive = true;
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=31.23&longitude=121.47&current=temperature_2m"
    )
      .then((r) => r.json())
      .then((d) => {
        const t = d?.current?.temperature_2m;
        if (alive && typeof t === "number") setTemp(`${Math.round(t)}°C`);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Live cursor coordinate readout, zero-padded.
  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (coordRef.current) {
            coordRef.current.textContent = `${String(Math.round(x)).padStart(4, "0")} X ${String(
              Math.round(y)
            ).padStart(4, "0")} Y`;
          }
          raf = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <aside className="chrome-foot" aria-hidden="true">
      <span className="foot-zone foot-left">
        GMT+8 · CN · {time}
        {temp ? ` · ${temp}` : ""}
      </span>
      <span className="foot-zone foot-center">
        <span ref={coordRef}>0000 X 0000 Y</span>
      </span>
      <span className="foot-zone foot-right">
        <span>2023—2026</span>
        <Globe />
      </span>
    </aside>
  );
}
