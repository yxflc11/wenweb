"use client";

// Large statements that cross-fade one at a time inside a pinned warp stage as
// you scroll through the zone (haoqi-style). The pin + scrub + active-statement
// swap are driven by WarpDriver; reduced-motion / mobile fall back to a stack.
const statements: string[][] = [
  ["Automate the repeatable.", "Reserve judgement", "for what matters."],
  ["Think in systems.", "Ship in small loops."],
  ["One person —", "a whole team's output."],
  ["Compounding with", "every era of AI."]
];

export default function Manifesto() {
  return (
    <section
      className="manifesto"
      aria-label="Principles"
      style={{ "--stmts": statements.length } as React.CSSProperties}
    >
      <div className="manifesto-stage">
        {statements.map((lines, i) => (
          // First statement is active by default (pre-JS / first paint).
          <p className={`manifesto-line${i === 0 ? " is-active" : ""}`} data-si={i} key={i}>
            {lines.map((line, j) => (
              // Each line is a clip mask; the inner span rises from behind it,
              // staggered by --li so the statement assembles line by line.
              <span className="m-line" style={{ "--li": j } as React.CSSProperties} key={j}>
                <span>{line}</span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
