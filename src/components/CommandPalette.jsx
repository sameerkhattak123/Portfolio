import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowRight,
  FiCpu,
  FiCopy,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiTerminal,
} from "react-icons/fi";
import { profile } from "../data/profile";

const go = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export const openPalette = () =>
  window.dispatchEvent(new Event("open-palette"));

// VS Code style ⌘K / Ctrl+K palette.
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef(null);
  const lastFocus = useRef(null);

  const actions = useMemo(
    () => [
      {
        group: "Navigate",
        label: "About",
        icon: FiArrowRight,
        run: () => go("about"),
      },
      {
        group: "Navigate",
        label: "Experience",
        icon: FiArrowRight,
        run: () => go("experience"),
      },
      {
        group: "Navigate",
        label: "Selected work",
        icon: FiArrowRight,
        run: () => go("work"),
      },
      {
        group: "Navigate",
        label: "AI engineering · Ask my CV",
        icon: FiCpu,
        run: () => go("ai"),
      },
      {
        group: "Navigate",
        label: "Skills & certificates",
        icon: FiArrowRight,
        run: () => go("skills"),
      },
      {
        group: "Navigate",
        label: "Open terminal",
        icon: FiTerminal,
        run: () => go("terminal"),
      },
      {
        group: "Navigate",
        label: "Contact",
        icon: FiArrowRight,
        run: () => go("contact"),
      },
      {
        group: "Actions",
        label: "Download résumé",
        icon: FiDownload,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.cv;
          a.download = profile.cv.split("/").pop();
          a.click();
        },
      },
      {
        group: "Actions",
        label: "Copy email address",
        icon: FiCopy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setToast("Email copied to clipboard");
          } catch {
            setToast(profile.email);
          }
        },
      },
      {
        group: "Actions",
        label: "Send an email",
        icon: FiMail,
        run: () => (window.location.href = `mailto:${profile.email}`),
      },
      {
        group: "Links",
        label: "GitHub",
        icon: FiGithub,
        run: () => window.open(profile.socials.github, "_blank", "noopener"),
      },
      {
        group: "Links",
        label: "LinkedIn",
        icon: FiLinkedin,
        run: () => window.open(profile.socials.linkedin, "_blank", "noopener"),
      },
    ],
    [],
  );

  const results = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase().trim()),
  );

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    } else {
      lastFocus.current?.focus?.({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const choose = (a) => {
    setOpen(false);
    if (a) setTimeout(a.run, 60);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <>
      {open && (
        <div className="palette" onMouseDown={() => setOpen(false)}>
          <div
            className="palette__box"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="palette__search">
              <span className="label">⌘K</span>
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                aria-label="Search commands"
              />
              <kbd>esc</kbd>
            </div>
            <ul className="palette__list" role="listbox">
              {results.length === 0 && (
                <li className="palette__empty">No results for “{query}”</li>
              )}
              {results.map((a, i) => {
                const header = a.group !== lastGroup ? a.group : null;
                lastGroup = a.group;
                const Icon = a.icon;
                return (
                  <li key={a.label} role="presentation">
                    {header && <p className="palette__group label">{header}</p>}
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      className={`palette__item ${i === active ? "is-active" : ""}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(a)}
                    >
                      <Icon aria-hidden /> {a.label}
                      {i === active && <kbd>↵</kbd>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      <div className={`toast ${toast ? "is-in" : ""}`} role="status">
        {toast}
      </div>
    </>
  );
}
