import { useEffect } from "react";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/*
 * Scroll-linked progress. Every [data-progress] element gets a --p variable (0..1):
 *   "exit"    0 when its top is at the viewport top, 1 once it has scrolled fully past
 *   "enter"   0 when its top is at data-start (fraction of viewport, default 1)
 *             and 1 when its top reaches data-end (default 0.3)
 *   "through" 0 when it enters the bottom of the viewport, 1 when it leaves the top
 */
export function useScrollProgress() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = [...document.querySelectorAll("[data-progress]")];
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        const mode = el.dataset.progress;
        let p;
        if (mode === "exit") {
          p = -r.top / r.height;
        } else if (mode === "through") {
          p = (vh - r.top) / (vh + r.height);
        } else {
          const start = parseFloat(el.dataset.start ?? 1) * vh;
          const end = parseFloat(el.dataset.end ?? 0.3) * vh;
          p = (start - r.top) / (start - end);
        }
        el.style.setProperty("--p", clamp(p).toFixed(4));
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/*
 * Pointer effects (desktop only), via event delegation:
 *   .magnetic        drifts toward the cursor
 *   [data-tilt]      3D tilt + --mx/--my for a glare highlight
 *   [data-spotlight] --mx/--my for a cursor-following highlight
 */
export function usePointerEffects() {
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    let magnet = null;
    let tilt = null;

    const resetMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };
    const resetTilt = () => {
      if (!tilt) return;
      tilt.style.transform = "";
      tilt.classList.remove("is-tilting");
      tilt = null;
    };

    const onMove = (e) => {
      const m = e.target.closest(".magnetic");
      if (m !== magnet) resetMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const strength = parseFloat(m.dataset.strength ?? 0.3);
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        m.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      }

      const t = e.target.closest("[data-tilt]");
      if (t !== tilt) resetTilt();
      if (t) {
        tilt = t;
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const max = parseFloat(t.dataset.tilt || 6);
        t.classList.add("is-tilting");
        t.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg)`;
        t.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        t.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }

      const s = e.target.closest("[data-spotlight]");
      if (s) {
        const r = s.getBoundingClientRect();
        s.style.setProperty("--mx", `${e.clientX - r.left}px`);
        s.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };

    const onLeaveWindow = () => {
      resetMagnet();
      resetTilt();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onLeaveWindow,
      );
    };
  }, []);
}
