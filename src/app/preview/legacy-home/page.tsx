"use client";

import About from "@/components/About";
import Closing from "@/components/Closing";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Work from "@/components/Work";

export default function LegacyHomePreview() {
  return (
    <main className="page" id="main">
      <Hero />
      <Work />
      <About />
      <Manifesto />
      <Closing />
    </main>
  );
}
