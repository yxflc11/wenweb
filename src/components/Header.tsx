"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "./ui-context";

export default function Header() {
  const { theme, soundOn, toggleTheme, toggleSound, menuOpen, setMenuOpen, onNavSection, hoverTick } =
    useUI();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onBlog = pathname.startsWith("/blog");
  const onContact = pathname.startsWith("/contact");

  const section = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavSection(hash);
  };

  return (
    <header className="topbar" aria-label="Primary">
      <a className="brand" href="/" onClick={section("#top")}>
        <span className="brand-name">BINGWEN HE</span>
        <span className="brand-mark">©2026</span>
      </a>
      <nav className="topnav">
        <a
          href="/#work"
          className={onHome ? "is-current" : ""}
          onClick={section("#work")}
          onMouseEnter={hoverTick}
        >
          Work
        </a>
        <a href="/#about" onClick={section("#about")} onMouseEnter={hoverTick}>
          About
        </a>
        <Link href="/blog" className={onBlog ? "is-current" : ""} onClick={hoverTick}>
          Writing
        </Link>
        <Link href="/contact" className={onContact ? "is-current" : ""} onClick={hoverTick}>
          Contact
        </Link>
      </nav>
      <div className="controls">
        <button
          className="ctrl"
          type="button"
          aria-label="Toggle colour theme"
          onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
          onMouseEnter={hoverTick}
        >
          <span className="ctrl-dot" />
          <span className="ctrl-label">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <button
          className={`ctrl ${soundOn ? "is-on" : ""}`}
          type="button"
          aria-pressed={soundOn}
          aria-label="Toggle sound"
          onClick={toggleSound}
          onMouseEnter={hoverTick}
        >
          <span className="sound-bars">
            <i />
            <i />
            <i />
          </span>
          <span className="ctrl-label">{soundOn ? "Sound on" : "Sound off"}</span>
        </button>
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => {
            hoverTick();
            setMenuOpen(!menuOpen);
          }}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
