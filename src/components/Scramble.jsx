import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../motion";

const GLYPHS = "!<>-_\\/[]{}=+*^?#$%&01";

// Text that "decodes" from random glyphs into its real value the first time it scrolls into view.
export default function Scramble({ text, duration = 700, className }) {
  const ref = useRef(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const revealed = Math.floor(t * text.length);
        setOut(
          text
            .split("")
            .map((ch, i) =>
              i < revealed || ch === " "
                ? ch
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
