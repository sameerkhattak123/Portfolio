import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../motion";
import { INTRO_DONE } from "./BootLoader";

// Deletes and retypes through `words`, like someone editing the headline live.
export default function TypeRotate({ words, hold = 1900, startDelay = 2600 }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 0;
    let pos = words[0].length;
    let deleting = true;
    let id;

    const tick = () => {
      const word = words[i];
      if (deleting) {
        pos -= 1;
        setText(word.slice(0, pos));
        if (pos === 0) {
          deleting = false;
          i = (i + 1) % words.length;
          id = setTimeout(tick, 260);
        } else {
          id = setTimeout(tick, 45);
        }
      } else {
        const next = words[i];
        pos += 1;
        setText(next.slice(0, pos));
        if (pos === next.length) {
          deleting = true;
          id = setTimeout(tick, hold);
        } else {
          id = setTimeout(tick, 85);
        }
      }
    };

    // Start once the hero has painted, so the first word is readable before it changes.
    const begin = () => {
      clearTimeout(id);
      id = setTimeout(tick, startDelay);
    };
    if (document.documentElement.classList.contains("is-booting")) {
      window.addEventListener(INTRO_DONE, begin, { once: true });
    } else {
      begin();
    }
    return () => {
      clearTimeout(id);
      window.removeEventListener(INTRO_DONE, begin);
    };
  }, [words, hold, startDelay]);

  return (
    <span className="typer">
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>{text}</span>
      <span className="typer__caret" aria-hidden />
    </span>
  );
}
