import { useLayoutEffect, useState } from "react";
import { prefersReducedMotion } from "../motion";

const LINES = [
  { text: "~/sameer-rehman $ npm run dev", at: 0 },
  { text: "> portfolio@2.0.0 dev", at: 380, muted: true },
  { text: "> compiling experience, projects, skills…", at: 620, muted: true },
  { text: "✓ compiled successfully", at: 1000, ok: true },
  { text: "✓ ready → welcome", at: 1250, ok: true },
];
const TOTAL = 1550;
const KEY = "sr-booted";

function alreadyBooted() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// One-time-per-session terminal intro. Hero animations stay paused (html.is-booting) until it lifts.
export default function BootLoader() {
  const [skip] = useState(() => prefersReducedMotion() || alreadyBooted());
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(skip);

  useLayoutEffect(() => {
    if (skip) return;
    const root = document.documentElement;
    root.classList.add("is-booting");

    const finish = () => {
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
      setLeaving(true);
      root.classList.remove("is-booting");
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage unavailable: intro will simply show again next visit */
      }
      setTimeout(() => setDone(true), 750);
    };

    const timers = LINES.map((l, i) => setTimeout(() => setShown(i + 1), l.at));
    const end = setTimeout(finish, TOTAL);
    function onSkip() {
      timers.forEach(clearTimeout);
      clearTimeout(end);
      setShown(LINES.length);
      finish();
    }
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
      root.classList.remove("is-booting");
    };
  }, [skip]);

  if (done) return null;

  return (
    <div className={`boot ${leaving ? "is-leaving" : ""}`} aria-hidden>
      <div className="boot__inner">
        {LINES.slice(0, shown).map((l) => (
          <p
            key={l.text}
            className={l.ok ? "is-ok" : l.muted ? "is-muted" : ""}
          >
            {l.text}
          </p>
        ))}
        <span className="boot__caret" />
        <div className="boot__bar">
          <span />
        </div>
        <p className="boot__hint">press any key to skip</p>
      </div>
    </div>
  );
}
