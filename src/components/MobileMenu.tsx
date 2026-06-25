"use client";

import Link from "next/link";
import { email, githubUrl } from "@/data";
import { useUI } from "./ui-context";

const sections: [string, string][] = [
  ["#work", "Work"],
  ["#about", "About"],
  ["#contact", "Contact"]
];

export default function MobileMenu() {
  const { menuOpen, setMenuOpen, onNavSection } = useUI();

  return (
    <nav
      className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
      aria-label="Mobile"
      aria-hidden={!menuOpen}
      data-lenis-prevent
    >
      {sections.map(([href, label], i) => (
        <a
          className="mobile-menu__link"
          key={href}
          href={`/${href}`}
          style={{ "--menu-delay": `${i * 60}ms` } as React.CSSProperties}
          onClick={(e) => {
            e.preventDefault();
            onNavSection(href);
          }}
        >
          {label}
        </a>
      ))}
      <Link
        className="mobile-menu__link"
        href="/blog"
        style={{ "--menu-delay": `${sections.length * 60}ms` } as React.CSSProperties}
        onClick={() => setMenuOpen(false)}
      >
        Writing
      </Link>
      <div className="mobile-menu__foot">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          github.com/yxflc11
        </a>
      </div>
    </nav>
  );
}
