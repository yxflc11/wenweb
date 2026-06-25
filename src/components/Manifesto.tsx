"use client";

// Large centred statements that reveal one at a time on scroll (haoqi-style),
// tuned to the AI-automation / one-person-company positioning.
const statements: string[][] = [
  ["Automate the repeatable.", "Reserve judgement", "for what matters."],
  ["Think in systems.", "Ship in small loops."],
  ["One person —", "a whole team's output."],
  ["Compounding with", "every era of AI."]
];

export default function Manifesto() {
  return (
    <section className="manifesto" aria-label="Principles">
      {statements.map((lines, i) => (
        <p className="manifesto-line reveal" key={i}>
          {lines.map((line, j) => (
            <span key={j}>{line}</span>
          ))}
        </p>
      ))}
    </section>
  );
}
