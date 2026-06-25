"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUI } from "./ui-context";
import Stickers from "./Stickers";

// WebGL is client-only and heavy — load it in its own chunk after first paint.
const HeroGlass = dynamic(() => import("./HeroGlass"), { ssr: false });

export default function Hero() {
  const { onNavSection, hoverTick } = useUI();
  const [reduced, setReduced] = useState(true);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const apply = () => setReduced(small.matches);
    apply();
    small.addEventListener("change", apply);
    setShow3D(true);
    return () => small.removeEventListener("change", apply);
  }, []);

  const nav = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavSection(hash);
  };

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-stage" aria-hidden="true">
        {show3D && <HeroGlass reduced={reduced} />}
      </div>
      <Stickers />
      <div className="hero-copy">
        <p className="hero-eyebrow reveal">Bingwen He — Design Engineer · AI Automation</p>
        <p className="hero-lead reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
          I build the systems that let one person move like a team — automating the
          repeatable so judgement and taste stay human. The work before the leap into an
          AI-native one-person company.
        </p>
        <div className="hero-actions reveal" style={{ "--d": "220ms" } as React.CSSProperties}>
          <a className="btn" href="/#work" onClick={nav("#work")} onMouseEnter={hoverTick}>
            Selected work
          </a>
          <a
            className="btn btn--ghost"
            href="/contact"
            onClick={nav("#contact")}
            onMouseEnter={hoverTick}
          >
            Get in touch
          </a>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-label">Scroll</span>
        <span className="hero-scroll-track" />
      </div>
    </section>
  );
}
