import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../motion";
import { INTRO_DONE } from "./BootLoader";

const INK = "22, 21, 19";
const ACCENT = "155, 74, 37";

// A dot grid behind the hero that behaves like a small network: a signal wave drifts
// across it, dots near the cursor give way and link to it, and clicks send a pulse.
export default function HeroField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReducedMotion();
    const fine = hasFinePointer();
    const GAP = fine ? 28 : 34;
    const R = 150;

    let w = 0;
    let h = 0;
    let dots = [];
    let raf = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, active: false };
    const ripples = [];

    const resize = () => {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP)
          dots.push({ bx: x, by: y, x, y, vx: 0, vy: 0 });
      }
      if (reduce) draw(0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const near = [];

      for (const d of dots) {
        let fx = 0;
        let fy = 0;
        if (pointer.active) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 0.1) {
            const f = (1 - dist / R) * 6;
            fx += (dx / dist) * f;
            fy += (dy / dist) * f;
            if (dist > 46) near.push([d, dist]); // beyond the cursor ring
          }
        }
        for (const rp of ripples) {
          const dx = d.bx - rp.x;
          const dy = d.by - rp.y;
          const dist = Math.hypot(dx, dy) || 1;
          const band = Math.abs(dist - rp.r);
          if (band < 46) {
            const f = (1 - band / 46) * rp.s * 14;
            fx += (dx / dist) * f;
            fy += (dy / dist) * f;
          }
        }

        d.vx = (d.vx + (d.bx - d.x) * 0.08 + fx * 0.25) * 0.78;
        d.vy = (d.vy + (d.by - d.y) * 0.08 + fy * 0.25) * 0.78;
        d.x += d.vx;
        d.y += d.vy;

        const wave = reduce
          ? 0
          : Math.sin(d.bx * 0.011 + d.by * 0.017 - t * 0.0011);
        const disp = Math.min(1, Math.hypot(d.x - d.bx, d.y - d.by) / 7);
        const alpha = 0.11 + Math.max(0, wave) * 0.09 + disp * 0.55;
        const radius = 0.9 + disp * 1.3 + (wave > 0.92 ? 0.35 : 0);
        ctx.fillStyle =
          disp > 0.2
            ? `rgba(${ACCENT}, ${Math.min(0.9, alpha + 0.1)})`
            : `rgba(${INK}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pointer.active && near.length) {
        near.sort((a, b) => a[1] - b[1]);
        const k = near.slice(0, 10);
        ctx.lineWidth = 1;
        for (let i = 0; i < k.length; i++) {
          for (let j = i + 1; j < k.length; j++) {
            const a = k[i][0];
            const b = k[j][0];
            if (Math.hypot(a.x - b.x, a.y - b.y) < GAP * 1.5) {
              ctx.strokeStyle = `rgba(${ACCENT}, 0.2)`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        for (const [d, dist] of k) {
          ctx.strokeStyle = `rgba(${ACCENT}, ${0.08 + 0.5 * (1 - dist / R)})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(d.x, d.y);
          ctx.stroke();
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 6.5;
        rp.s *= 0.975;
        if (rp.r > Math.max(w, h) * 1.3 || rp.s < 0.05) ripples.splice(i, 1);
      }
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      frame += 1;
      // Idle wave only needs ~30fps; interaction runs at full rate.
      if (!pointer.active && !ripples.length && frame % 2) return;
      draw(t);
    };

    const local = (e) => {
      const r = hero.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    const onDown = (e) => {
      const p = local(e);
      ripples.push({ x: p.x, y: p.y, r: 0, s: 1 });
    };
    const onIntro = () => {
      const img = hero.querySelector(".portrait");
      const hr = hero.getBoundingClientRect();
      const r = img ? img.getBoundingClientRect() : hr;
      ripples.push({
        x: r.left - hr.left + r.width / 2,
        y: r.top - hr.top + r.height / 2,
        r: 0,
        s: 1.2,
      });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    if (reduce) return () => ro.disconnect();

    const io = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
    );
    io.observe(hero);
    raf = requestAnimationFrame(loop);
    if (fine) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }
    hero.addEventListener("pointerdown", onDown);
    window.addEventListener(INTRO_DONE, onIntro);
    if (!document.documentElement.classList.contains("is-booting"))
      setTimeout(onIntro, 300);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
      window.removeEventListener(INTRO_DONE, onIntro);
    };
  }, []);

  return <canvas ref={ref} className="hero__field" aria-hidden />;
}
