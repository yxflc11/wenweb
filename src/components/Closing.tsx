"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUI } from "./ui-context";
import Stickers from "./Stickers";

// Reuses the hero's liquid-glass wordmark for a closing crescendo (haoqi-style),
// bookending the hero's "hello" with a "thanks" sign-off over a contact invite.
const HeroGlass = dynamic(() => import("./HeroGlass"), { ssr: false });

export default function Closing() {
  const { hoverTick } = useUI();
  const [reduced, setReduced] = useState(true);
  const [near, setNear] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const apply = () => setReduced(small.matches);
    apply();
    small.addEventListener("change", apply);

    // Mount the heavy glass canvas only once the closing nears the viewport, so
    // it doesn't compile a second transmission scene on first paint.
    const el = sectionRef.current;
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setNear(true);
            io?.disconnect();
          }
        },
        { rootMargin: "700px" }
      );
      io.observe(el);
    }
    return () => {
      small.removeEventListener("change", apply);
      io?.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="closing" id="closing" aria-label="Get in touch">
      <div className="closing-stage" aria-hidden="true">
        {near && <HeroGlass reduced={reduced} word={"AFTER\nTHE SKY"} anchor=".closing" centerY={0.5} />}
      </div>
      <Stickers />
      <div className="closing-copy">
        <p className="closing-eyebrow">After the leap — open to building</p>
        <h2 className="closing-title">Got a system worth building? Let&rsquo;s talk.</h2>
        <Link className="btn" href="/contact" onMouseEnter={hoverTick}>
          Get in touch
        </Link>
      </div>
    </section>
  );
}
