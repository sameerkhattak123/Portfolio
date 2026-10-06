import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { profile } from "../data/profile";
import { openPalette } from "./CommandPalette";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let lastY = window.scrollY;
    const bar = document.querySelector(".progress");
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 400 && y > lastY);
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <div className="progress" aria-hidden />
      <header
        className={`nav ${scrolled ? "nav--scrolled" : ""} ${hidden && !open ? "nav--hidden" : ""}`}
      >
        <div className="nav__inner">
          <a href="#top" className="nav__brand" onClick={() => setOpen(false)}>
            <span className="nav__mark magnetic" data-strength="0.4" aria-hidden>
              SR
            </span>
            <span>
              {profile.name}
              <small>{profile.role}</small>
            </span>
          </a>

          <nav
            className={`nav__links ${open ? "is-open" : ""}`}
            aria-label="Primary"
          >
            {LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`link ${active === id ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              className="nav__kbd magnetic"
              onClick={() => {
                setOpen(false);
                openPalette();
              }}
              aria-label="Open command palette"
            >
              <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd>K</kbd>
            </button>
            <a
              className="btn btn--dark btn--sm magnetic"
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
            >
              Résumé <FiArrowUpRight aria-hidden />
            </a>
          </nav>

          <button
            className={`nav__toggle ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}
