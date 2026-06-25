"use client";

import Link from "next/link";
import { email, githubUrl } from "@/data";
import { useUI } from "./ui-context";

export default function Footer() {
  const { onNavSection } = useUI();
  return (
    <footer className="footer">
      <div className="footer-col">
        <span className="footer-label">Contact</span>
        <a href={`mailto:${email}`}>{email}</a>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          github.com/yxflc11
        </a>
      </div>
      <div className="footer-col">
        <span className="footer-label">Navigate</span>
        <a
          href="/#work"
          onClick={(e) => {
            e.preventDefault();
            onNavSection("#work");
          }}
        >
          Work
        </a>
        <Link href="/blog">Writing</Link>
        <a
          href="/#about"
          onClick={(e) => {
            e.preventDefault();
            onNavSection("#about");
          }}
        >
          About
        </a>
      </div>
      <div className="footer-col footer-col--end">
        <button type="button" className="footer-top" onClick={() => onNavSection("#top")}>
          Back to top ↑
        </button>
        <p className="footer-note">© Bingwen He 2026</p>
        <p className="footer-note footer-note--faint">Thinking in systems. Building with care.</p>
      </div>
    </footer>
  );
}
