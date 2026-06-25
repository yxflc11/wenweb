"use client";

import type { CSSProperties } from "react";

// Playful sticker-collage layer (haoqi-style) — our own takes on the same
// archetypes. Purely decorative: pointer-events off, aria-hidden, motion stops
// under reduced-motion (handled globally). Positions frame the hero's corners
// and top so they never clash with the centred copy.

type Spot = {
  x: string;
  y: string;
  r: number;
  s: number;
  dur: number;
  delay: number;
  // Sits low in the frame — hidden on narrow screens where it would clash copy.
  low?: boolean;
};

function Sticker({ spot, children }: { spot: Spot; children: React.ReactNode }) {
  return (
    <span
      className={`sticker${spot.low ? " sticker--low" : ""}`}
      style={
        {
          "--x": spot.x,
          "--y": spot.y,
          "--r": `${spot.r}deg`,
          "--s": `${spot.s}px`
        } as CSSProperties
      }
    >
      <span
        className="sticker-inner"
        style={{ "--dur": `${spot.dur}s`, "--delay": `${spot.delay}s` } as CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}

// Googly eyes
function Eyes() {
  return (
    <svg viewBox="0 0 104 66" className="sticker-svg" aria-hidden="true">
      <g stroke="#0b0d00" strokeWidth="4">
        <ellipse cx="34" cy="33" rx="26" ry="30" fill="#fff" />
        <ellipse cx="74" cy="33" rx="26" ry="30" fill="#fff" />
      </g>
      <circle cx="40" cy="40" r="11" fill="#0b0d00" />
      <circle cx="68" cy="38" r="11" fill="#0b0d00" />
    </svg>
  );
}

// Melty smiley
function Smiley() {
  return (
    <svg viewBox="0 0 88 92" className="sticker-svg" aria-hidden="true">
      <path
        d="M44 4a40 40 0 0 1 40 40c0 14-4 22-4 32 0 6-6 10-12 8s-8-8-14-8-9 8-16 8-10-8-16-10S4 60 4 44A40 40 0 0 1 44 4Z"
        fill="#ffd23f"
        stroke="#0b0d00"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="38" r="5.5" fill="#0b0d00" />
      <circle cx="58" cy="38" r="5.5" fill="#0b0d00" />
      <path d="M26 56c6 9 30 9 36 0" fill="none" stroke="#0b0d00" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// Star with a face
function StarFace() {
  return (
    <svg viewBox="0 0 92 88" className="sticker-svg" aria-hidden="true">
      <path
        d="M46 3 58 32l31 2-24 20 8 30-27-17-27 17 8-30L3 34l31-2Z"
        fill="#9be84f"
        stroke="#0b0d00"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="42" r="4" fill="#0b0d00" />
      <circle cx="54" cy="42" r="4" fill="#0b0d00" />
      <path d="M37 52c4 5 14 5 18 0" fill="none" stroke="#0b0d00" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// Retro pixel cursor
function PixelCursor() {
  // Drawn on a 16-unit grid so the steps read as pixels.
  const cells = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
    [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10],
    [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
    [3, 3], [3, 4], [3, 5], [3, 6], [3, 9], [3, 10],
    [4, 4], [4, 5], [4, 9], [4, 10], [4, 11],
    [5, 5], [5, 10], [5, 11], [5, 12]
  ];
  return (
    <svg viewBox="-1 -1 16 16" className="sticker-svg" aria-hidden="true">
      <g fill="#3b6bff" stroke="#0b0d00" strokeWidth="0.18">
        {cells.map(([cx, cy], i) => (
          <rect key={i} x={cx} y={cy} width="1" height="1" />
        ))}
      </g>
    </svg>
  );
}

// Circular brand stamp (our coin)
function Stamp() {
  return (
    <svg viewBox="0 0 110 110" className="sticker-svg sticker-stamp" aria-hidden="true">
      <defs>
        <path id="stampArc" d="M55 55 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <circle cx="55" cy="55" r="52" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="55" cy="55" r="45" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.65" />
      <text className="sticker-stamp-text">
        <textPath href="#stampArc" startOffset="0">
          BINGWEN HE · BEFORE THE LEAP · 2023 ·
        </textPath>
      </text>
      <circle cx="55" cy="55" r="7" fill="currentColor" />
    </svg>
  );
}

const spots: Record<string, Spot> = {
  eyes: { x: "10%", y: "24%", r: -8, s: 96, dur: 6, delay: 0 },
  cursor: { x: "51%", y: "10%", r: 6, s: 58, dur: 5, delay: 0.6 },
  smiley: { x: "84%", y: "20%", r: 11, s: 78, dur: 6.5, delay: 0.3 },
  star: { x: "15%", y: "82%", r: -13, s: 76, dur: 5.5, delay: 0.9, low: true },
  stamp: { x: "87%", y: "76%", r: 9, s: 112, dur: 7, delay: 0.2, low: true }
};

export default function Stickers() {
  return (
    <div className="stickers" aria-hidden="true">
      <Sticker spot={spots.eyes}><Eyes /></Sticker>
      <Sticker spot={spots.cursor}><PixelCursor /></Sticker>
      <Sticker spot={spots.smiley}><Smiley /></Sticker>
      <Sticker spot={spots.star}><StarFace /></Sticker>
      <Sticker spot={spots.stamp}><Stamp /></Sticker>
    </div>
  );
}
