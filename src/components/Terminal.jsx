import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
} from "../data/profile";
import { yearsSince } from "../hooks";
import { prefersReducedMotion } from "../motion";
import { CHUNKS, retrieve } from "../ai/rag";

const PROMPT = "sameer@portfolio:~$";

const FILES = {
  "about.md": "about",
  "experience.json": "experience",
  "projects/": "projects",
  "skills.txt": "skills",
  "certs.txt": "certs",
  "contact.vcf": "contact",
  "resume.pdf": "cv",
};

const HELP = [
  ["ask <question>", "RAG search over my CV"],
  ["whoami", "who I am"],
  ["about", "a short intro"],
  ["experience", "where I've worked"],
  ["projects", "things I've built"],
  ["skills", "my toolbox"],
  ["certs", "courses & certificates"],
  ["contact", "how to reach me"],
  ["cv", "download my résumé"],
  ["github / linkedin", "open my profiles"],
  ["ls · cat <file>", "browse like a filesystem"],
  ["clear", "clear the screen"],
];

const COMMANDS = [
  "help",
  "ask",
  "whoami",
  "about",
  "experience",
  "projects",
  "skills",
  "certs",
  "contact",
  "cv",
  "github",
  "linkedin",
  "ls",
  "cat",
  "clear",
  "date",
  "echo",
  "sudo",
];

const SUGGESTIONS = [
  "help",
  "whoami",
  "ask has he used aws?",
  "projects",
  "skills",
  "sudo hire-me",
];

function open(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function run(raw) {
  const [cmd = "", ...args] = raw.trim().split(/\s+/);
  const c = cmd.toLowerCase();

  switch (c) {
    case "":
      return [];
    case "help":
      return [
        { t: "Available commands:", cls: "muted" },
        ...HELP.map(([k, v]) => ({ t: `  ${k.padEnd(20)}${v}` })),
      ];
    case "ask": {
      const q = args.join(" ");
      if (!q) return [{ t: "usage: ask <question>  e.g. ask what ai tools does he use?", cls: "muted" }];
      const r = retrieve(q);
      return [
        { t: `↳ retrieved ${r.hits.length} of ${CHUNKS.length} chunks (cosine similarity)`, cls: "muted" },
        ...r.answer.map((l) => ({
          t: l.cite ? `[${l.cite}] ${l.t}  (${r.hits[l.cite - 1].score.toFixed(2)})` : l.t,
          cls: l.cite ? "" : "accent",
        })),
      ];
    }
    case "whoami":
      return [
        { t: `${profile.name} · ${profile.role}`, cls: "accent" },
        { t: `${experience[0].role} @ ${experience[0].company}` },
        {
          t: `${yearsSince(profile.careerStart)}+ years · ${profile.location}`,
          cls: "muted",
        },
      ];
    case "about":
      return profile.about.map((t) => ({ t }));
    case "experience":
      return experience.flatMap((j) => [
        { t: `▸ ${j.role} @ ${j.company}`, cls: "accent" },
        { t: `  ${j.period} · ${j.location}`, cls: "muted" },
      ]);
    case "projects":
      return projects.map((p) => ({
        t: `▸ ${p.title.padEnd(34)}${p.stack.slice(0, 3).join(", ")}`,
      }));
    case "skills":
      return skills.map((s) => ({
        t: `${(s.group + ":").padEnd(22)}${s.items.join(", ")}`,
      }));
    case "certs":
      return certifications.map((c) => ({
        t: `✓ ${c.title} (${c.issuer.split(" · ")[0]})`,
      }));
    case "education":
      return [
        { t: `${education.degree}, ${education.school} (${education.period})` },
      ];
    case "contact":
      return [
        { t: `email     ${profile.email}`, href: `mailto:${profile.email}` },
        {
          t: `phone     ${profile.phone}`,
          href: `tel:${profile.phone.replace(/\s/g, "")}`,
        },
        {
          t: `linkedin  ${profile.socials.linkedin}`,
          href: profile.socials.linkedin,
        },
        {
          t: `github    ${profile.socials.github}`,
          href: profile.socials.github,
        },
      ];
    case "cv":
    case "resume": {
      const a = document.createElement("a");
      a.href = profile.cv;
      a.download = profile.cv.split("/").pop();
      a.click();
      return [{ t: "↓ downloading résumé…", cls: "ok" }];
    }
    case "github":
      open(profile.socials.github);
      return [{ t: "opening github…", cls: "ok" }];
    case "linkedin":
      open(profile.socials.linkedin);
      return [{ t: "opening linkedin…", cls: "ok" }];
    case "ls":
      return [{ t: Object.keys(FILES).join("   ") }];
    case "cat": {
      const target = FILES[args[0]];
      if (!args[0])
        return [{ t: "usage: cat <file>  (try: ls)", cls: "muted" }];
      if (!target)
        return [
          { t: `cat: ${args[0]}: No such file or directory`, cls: "err" },
        ];
      return run(target);
    }
    case "date":
      return [{ t: new Date().toString() }];
    case "echo":
      return [{ t: args.join(" ") }];
    case "sudo":
      if (args.join(" ") === "hire-me")
        return [
          { t: "[sudo] password for recruiter: ********", cls: "muted" },
          { t: "✓ permission granted. great choice.", cls: "ok" },
          {
            t: `→ send the offer to ${profile.email}`,
            href: `mailto:${profile.email}`,
          },
        ];
      return [{ t: "nice try. (hint: sudo hire-me)", cls: "muted" }];
    default:
      return [
        { t: `command not found: ${cmd}. type 'help' for a list.`, cls: "err" },
      ];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState([
    { t: "Welcome! Type 'help' to see what I can do.", cls: "muted" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState(false);
  const body = useRef(null);
  const input = useRef(null);
  const wrap = useRef(null);

  const exec = (cmd) => {
    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
    } else {
      const output = run(cmd);
      setLines((l) => [...l, { t: cmd, prompt: true }, ...output]);
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
    setCursor(-1);
    setValue("");
  };

  // Type a first command by itself when the terminal scrolls into view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (prefersReducedMotion()) return exec("whoami");
        setBusy(true);
        const word = "whoami";
        let i = 0;
        const id = setInterval(() => {
          i += 1;
          setValue(word.slice(0, i));
          if (i === word.length) {
            clearInterval(id);
            setTimeout(() => {
              exec(word);
              setBusy(false);
            }, 280);
          }
        }, 90);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [lines]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      exec(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setValue(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab" && value) {
      e.preventDefault();
      const [first, ...rest] = value.split(" ");
      if (rest.length && first === "cat") {
        const match = Object.keys(FILES).filter((f) =>
          f.startsWith(rest.join(" ")),
        );
        if (match.length === 1) setValue(`cat ${match[0]}`);
      } else {
        const match = COMMANDS.filter((c) => c.startsWith(value.toLowerCase()));
        if (match.length === 1) setValue(match[0]);
        else if (match.length > 1)
          setLines((l) => [...l, { t: match.join("   "), cls: "muted" }]);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <Section
      id="terminal"
      index="06"
      label="Terminal"
      title={
        <>
          Prefer the <em>command line?</em>
        </>
      }
    >
      <div
        className="term"
        ref={wrap}
        data-reveal
        onClick={() => input.current?.focus({ preventScroll: true })}
      >
        <div className="term__bar">
          <span className="term__dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="term__title">sameer@portfolio: ~</span>
          <span className="term__shell">zsh</span>
        </div>
        <div className="term__body" ref={body} role="log" aria-live="polite">
          {lines.map((l, i) =>
            l.prompt ? (
              <p key={i}>
                <span className="term__prompt">{PROMPT}</span> {l.t}
              </p>
            ) : l.href ? (
              <p key={i}>
                <a
                  className="term__link"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.t}
                </a>
              </p>
            ) : (
              <p key={i} className={l.cls ? `is-${l.cls}` : ""}>
                {l.t}
              </p>
            ),
          )}
          <label className="term__input">
            <span className="term__prompt">{PROMPT}</span>
            <input
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              readOnly={busy}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal command"
            />
          </label>
        </div>
      </div>

      <div className="term__chips" data-reveal>
        <span className="label">Try</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="chip chip--btn"
            onClick={() => exec(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </Section>
  );
}
