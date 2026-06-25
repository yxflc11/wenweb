"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import Intro from "./Intro";
import Blueprint from "./Blueprint";
import ScrollRail from "./ScrollRail";
import WarpDriver from "./WarpDriver";
import Header from "./Header";
import Readout from "./Readout";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import { PreviewProvider } from "./PreviewContext";
import { UIProvider, type UI } from "./ui-context";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";
import { useLenis, scrollTo } from "@/hooks/useLenis";
import { useReveal } from "@/hooks/useReveal";

// 3D project hover preview — client only, heavy three.js chunk.
const ThreePreview = dynamic(() => import("./ThreePreview"), { ssr: false });
// Persistent warp-tunnel background canvas (WebGL) — client only.
const BackgroundScene = dynamic(() => import("./BackgroundScene"), { ssr: false });

export default function Shell({ children }: { children: ReactNode }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { soundOn, toggle: toggleSound, tick } = useSound();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pendingScroll = useRef<string | null>(null);
  // The Keystatic admin renders its own full-screen UI — skip our chrome/scroll.
  const onKeystatic = pathname?.startsWith("/keystatic") ?? false;

  useLenis(!onKeystatic);
  useReveal(pathname);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // On arriving home (e.g. from a blog page), honour a pending section scroll;
  // otherwise scroll to top on every route change.
  useEffect(() => {
    if (pathname === "/" && pendingScroll.current) {
      const target = pendingScroll.current;
      pendingScroll.current = null;
      window.setTimeout(() => scrollTo(target === "#top" ? 0 : target), 90);
    } else {
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
  }, [pathname]);

  const hoverTick = useCallback(() => tick(640, 0.03, 0.025), [tick]);

  const onNavSection = useCallback(
    (hash: string) => {
      tick(300);
      setMenuOpen(false);
      // Contact is its own page now.
      if (hash === "#contact") {
        router.push("/contact");
        return;
      }
      if (pathname === "/") {
        scrollTo(hash === "#top" ? 0 : hash);
      } else {
        pendingScroll.current = hash;
        router.push("/");
      }
    },
    [tick, pathname, router]
  );

  const handleToggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      tick(420);
      toggleTheme(origin);
    },
    [tick, toggleTheme]
  );

  const ui: UI = {
    theme,
    soundOn,
    toggleTheme: handleToggleTheme,
    toggleSound,
    menuOpen,
    setMenuOpen,
    onNavSection,
    hoverTick,
    tick
  };

  // Keystatic admin: render it bare, without the portfolio chrome.
  if (onKeystatic) return <>{children}</>;

  return (
    <PreviewProvider>
      <UIProvider value={ui}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Blueprint />
        <div className="warp-backdrop" aria-hidden="true" />
        <BackgroundScene />
        <WarpDriver />
        <Intro />
        <Header />
        <Readout />
        <ScrollRail />
        {children}
        <Footer />
        <ThreePreview />
        <MobileMenu />
      </UIProvider>
    </PreviewProvider>
  );
}
