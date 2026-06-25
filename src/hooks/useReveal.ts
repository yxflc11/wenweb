import { useEffect } from "react";

// Adds `is-visible` to every `.reveal` element as it scrolls into view.
// Re-scans whenever `dep` changes (e.g. on route change) so freshly mounted
// page content also animates in.
//
// Where CSS scroll-driven animations are supported (`animation-timeline: view()`),
// the reveal is handled entirely in CSS (off the main thread) and this hook
// stands down. It's the fallback path for browsers without that support.
export function useReveal(dep?: unknown) {
  useEffect(() => {
    const cssDriven =
      typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    if (cssDriven) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
