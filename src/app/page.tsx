"use client";

import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Manifesto from "@/components/Manifesto";

export default function HomePage() {
  return (
    <main className="page" id="main">
      <Hero />
      <Work />
      <About />
      <Manifesto />
    </main>
  );
}
