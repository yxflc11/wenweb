"use client";

// Fixed blueprint overlay (haoqi-style): faint column hairlines + horizontal
// rules with crosshair registration marks at the intersections. Sits behind the
// page content, above the background, and persists across every section.
const COLS = [0, 1, 2, 3]; // four vertical lines at 0 / 33 / 66 / 100%
const ROWS = [33.333, 66.666]; // two horizontal rules

export default function Blueprint() {
  return (
    <div className="blueprint" aria-hidden="true">
      {ROWS.map((top) => (
        <span className="bp-row" key={`r${top}`} style={{ top: `${top}%` }} />
      ))}
      {COLS.map((i) => (
        <span className="bp-col" key={`c${i}`} style={{ left: `${(i / 3) * 100}%` }}>
          {ROWS.map((top) => (
            <span className="bp-x" key={`x${top}`} style={{ top: `${top}%` }} />
          ))}
        </span>
      ))}
    </div>
  );
}
