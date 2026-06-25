"use client";

import { useEffect, useState } from "react";

type Grid = { w: number; h: number; cols: number[]; rows: number[] };

// Fixed full-viewport blueprint grid: column lines + horizontal rules, broken
// around 12px crosshair registration marks at each intersection — haoqi's
// signature "design-tool" overlay. Recomputed on resize so it stays crisp and
// aligned to the content frame.
export default function BlueprintGrid() {
  const [g, setG] = useState<Grid | null>(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxw = 1280;
      const pad = Math.max(18, Math.min(w * 0.04, 46));
      const left = Math.round(Math.max((w - maxw) / 2, pad)) + 0.5;
      const right = w - left;
      const cw = right - left;
      const cols = [left, left + cw / 3, left + (cw * 2) / 3, right];
      const rows = [Math.round(h / 3) + 0.5, Math.round((h * 2) / 3) + 0.5];
      setG({ w, h, cols, rows });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  if (!g) return null;
  const { w, h, cols, rows } = g;
  const gap = 12; // half-gap opened around each intersection
  const arm = 6; // crosshair arm length

  const lines: string[] = [];
  // Vertical column lines, broken where the horizontal rules cross.
  for (const x of cols) {
    let y0 = 0;
    for (const y of rows) {
      lines.push(`M${x} ${y0}V${y - gap}`);
      y0 = y + gap;
    }
    lines.push(`M${x} ${y0}V${h}`);
  }
  // Horizontal rules, broken where the column lines cross.
  for (const y of rows) {
    let x0 = 0;
    for (const x of cols) {
      lines.push(`M${x0} ${y}H${x - gap}`);
      x0 = x + gap;
    }
    lines.push(`M${x0} ${y}H${w}`);
  }

  const crosses: string[] = [];
  for (const x of cols) {
    for (const y of rows) {
      crosses.push(`M${x} ${y - arm}V${y + arm}M${x - arm} ${y}H${x + arm}`);
    }
  }

  return (
    <svg
      className="blueprint"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <path className="blueprint-line" d={lines.join("")} />
      <path className="blueprint-cross" d={crosses.join("")} />
    </svg>
  );
}
