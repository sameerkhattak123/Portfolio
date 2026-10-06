import { useLayoutEffect, useState } from "react";
import { prefersReducedMotion } from "../motion";

// The intro "compiles" the page: a component is typed out, built, and the hero then
// appears as a dashed wireframe before the real design paints in.
const CODE = [
  [
    ["p", "<"],
    ["t", "Engineer"],
  ],
  [
    ["a", "  name"],
    ["p", "="],
    ["s", '"Sameer Rehman"'],
  ],
  [
    ["a", "  stack"],
    ["p", "={["],
    ["s", '"React"'],
    ["p", ", "],
    ["s", '"Laravel"'],
    ["p", ", "],
    ["s", '"Node"'],
    ["p", ", "],
    ["s", '"AWS"'],
    ["p", "]}"],
  ],
  [
    ["a", "  ai"],
    ["p", "={["],
    ["s", '"RAG"'],
    ["p", ", "],
    ["s", '"LangGraph"'],
    ["p", "]}"],
  ],
  [["p", "/>"]],
];
const TOTAL_CHARS =
  CODE.flat().reduce((n, [, t]) => n + t.length, 0) + CODE.length;

const TYPE_MS = 950;
const COMPILE_AT = 1050;
const READY_AT = 1500;
const LIFT_AT = 1800;
const PAINT_AT = 2700;
const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const KEY = "sr-booted";

export const INTRO_DONE = "intro-done";

function alreadyBooted() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function renderCode(limit) {
  let left = limit;
  return CODE.map((line, i) => {
    if (left <= 0) return null;
    const parts = line.map(([cls, text], j) => {
      const shown = text.slice(0, Math.max(0, left));
      left -= text.length;
      return shown ? (
        <span key={j} className={`c-${cls}`}>
          {shown}
        </span>
      ) : null;
    });
    left -= 1; // newline
    return (
      <span key={i} className="intro__line">
        {parts}
      </span>
    );
  });
}

export default function BootLoader() {
  const [skip] = useState(() => prefersReducedMotion() || alreadyBooted());
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState("type"); // type · compile · ready · lift
  const [spin, setSpin] = useState(0);
  const [elapsed, setElapsed] = useState("");
  const [done, setDone] = useState(skip);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (skip) {
      window.dispatchEvent(new Event(INTRO_DONE));
      return;
    }
    root.classList.add("is-booting");

    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    let raf;
    const start = performance.now();
    const typeLoop = (now) => {
      const t = Math.min((now - start) / TYPE_MS, 1);
      setTyped(Math.round(t * TOTAL_CHARS));
      if (t < 1) raf = requestAnimationFrame(typeLoop);
    };
    raf = requestAnimationFrame(typeLoop);
    const spinId = setInterval(
      () => setSpin((s) => (s + 1) % SPINNER.length),
      80,
    );

    const finish = () => {
      timers.forEach(clearTimeout);
      clearInterval(spinId);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
      root.classList.remove("is-booting", "is-wire");
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage unavailable: the intro simply plays again next visit */
      }
      setDone(true);
      window.dispatchEvent(new Event(INTRO_DONE));
    };

    at(COMPILE_AT, () => setPhase("compile"));
    at(READY_AT, () => {
      setElapsed((performance.now() / 1000).toFixed(2));
      setPhase("ready");
    });
    at(LIFT_AT, () => {
      setPhase("lift");
      root.classList.add("is-wire");
    });
    at(PAINT_AT, finish);

    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(spinId);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
      root.classList.remove("is-booting", "is-wire");
    };
  }, [skip]);

  if (done) return null;

  return (
    <div
      className={`intro ${phase === "lift" ? "is-leaving" : ""}`}
      aria-hidden
    >
      <div className="intro__editor">
        <div className="intro__tab">
          <span className="term__dots">
            <i />
            <i />
            <i />
          </span>
          <span>Hero.jsx</span>
        </div>
        <pre className="intro__code">
          {renderCode(typed)}
          {phase === "type" && <span className="intro__caret" />}
        </pre>
        <p
          className={`intro__status ${phase === "ready" || phase === "lift" ? "is-ok" : ""}`}
        >
          {phase === "type" && " "}
          {phase === "compile" && `${SPINNER[spin]} compiling <Engineer />…`}
          {(phase === "ready" || phase === "lift") &&
            `✓ compiled · ready in ${elapsed}s`}
        </p>
      </div>
      <p className="intro__hint">press any key to skip</p>
    </div>
  );
}
