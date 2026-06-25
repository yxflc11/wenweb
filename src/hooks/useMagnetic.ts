import { useEffect } from "react";

// Magnetic targets: interactive elements lean toward the cursor as it approaches,
// easing back when it leaves. Driven via the `translate` property so it composes
// with each element's own `transform` (hover lift / active scale). Re-scans when
// `dep` changes (route navigation). Disabled for touch and reduced-motion.
export function useMagnetic(dep?: unknown) {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".btn, .ctrl, [data-magnetic]")
    );
    if (!els.length) return;

    const targets = els.map((el) => ({
      el,
      strong: el.dataset.magnetic === "strong" || el.classList.contains("btn"),
      tx: 0,
      ty: 0
    }));

    let px = 0;
    let py = 0;
    let raf = 0;

    const loop = () => {
      raf = 0;
      let moving = false;
      for (const t of targets) {
        const r = t.el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const radius = Math.max(r.width, r.height) / 2 + 64;
        const dist = Math.hypot(dx, dy);
        let gx = 0;
        let gy = 0;
        if (dist < radius) {
          const pull = (t.strong ? 0.36 : 0.26) * (1 - dist / radius);
          gx = dx * pull;
          gy = dy * pull;
        }
        t.tx += (gx - t.tx) * 0.18;
        t.ty += (gy - t.ty) * 0.18;
        if (Math.abs(gx - t.tx) > 0.1 || Math.abs(gy - t.ty) > 0.1) moving = true;
        t.el.style.translate =
          Math.abs(t.tx) < 0.1 && Math.abs(t.ty) < 0.1
            ? ""
            : `${t.tx.toFixed(2)}px ${t.ty.toFixed(2)}px`;
      }
      if (moving) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      targets.forEach((t) => {
        t.el.style.translate = "";
      });
    };
  }, [dep]);
}
