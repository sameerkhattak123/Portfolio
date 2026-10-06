import { useEffect, useRef, useState } from "react";
import { hasFinePointer, prefersReducedMotion } from "../motion";

// A dot that tracks the pointer exactly and a ring that trails it.
// The ring grows over links and shows a label over [data-cursor] elements.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState({ mode: "", label: "" });

  useEffect(() => {
    setEnabled(hasFinePointer() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current)
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
    };

    const onOver = (e) => {
      const labelled = e.target.closest("[data-cursor]");
      if (labelled)
        return setState({ mode: "label", label: labelled.dataset.cursor });
      if (e.target.closest("a, button"))
        return setState({ mode: "link", label: "" });
      setState({ mode: "", label: "" });
    };

    const onDown = () => ring.current?.classList.add("is-down");
    const onUp = () => ring.current?.classList.remove("is-down");
    const onLeave = () => setState({ mode: "hidden", label: "" });

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current)
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className={`cursor-dot ${state.mode ? `is-${state.mode}` : ""}`}
        aria-hidden
      />
      <div
        ref={ring}
        className={`cursor-ring ${state.mode ? `is-${state.mode}` : ""}`}
        aria-hidden
      >
        <span>{state.label}</span>
      </div>
    </>
  );
}
