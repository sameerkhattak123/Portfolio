import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../motion";

const ITEMS = [
  "React",
  "Laravel",
  "Node.js",
  "AWS Lambda",
  "MySQL",
  "MongoDB",
  "REST APIs",
  "Tailwind CSS",
  "LangGraph",
  "Express",
  "Power Platform",
];

// Drifts slowly on its own; scrolling speeds it up and flips its direction.
export default function Marquee() {
  const track = useRef(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;

    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let raf;

    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      boost = Math.min(boost + Math.abs(dy) * 0.08, 14);
    };

    const loop = () => {
      const half = el.scrollWidth / 2;
      x += dir * (0.45 + boost);
      boost *= 0.92;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const row = ITEMS.map((t) => (
    <span key={t} className="marquee__item">
      {t}
      <i aria-hidden>✦</i>
    </span>
  ));

  return (
    <div className="marquee" aria-label={`Tech stack: ${ITEMS.join(", ")}`}>
      <div className="marquee__track" ref={track} aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
