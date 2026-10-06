import { useEffect, useRef, useState } from "react";
import { FiCornerDownLeft } from "react-icons/fi";
import { CATEGORIES, CHUNKS, retrieve, SAMPLE_QUESTIONS } from "../ai/rag";
import { prefersReducedMotion } from "../motion";

const STAGES = ["Tokenize", "Embed", "Retrieve", "Compose"];
const STAGE_AT = [0, 700, 1400, 2300]; // ms at which each stage starts
const WORD_MS = 28;

function wordCount(answer) {
  return answer.reduce((n, l) => n + l.t.split(" ").length, 0);
}

// Retrieval-augmented "ask my CV" demo. Each pipeline stage is revealed in turn.
export default function AskCV() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(0); // 0 idle · 1-4 running · 5 done
  const [words, setWords] = useState(0);
  const timers = useRef([]);
  const wrap = useRef(null);

  const stop = () => {
    timers.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timers.current = [];
  };

  const ask = (question) => {
    const text = question.trim();
    if (!text) return;
    stop();
    const r = retrieve(text);
    const total = wordCount(r.answer);
    setInput(text);
    setResult(r);
    setWords(0);

    if (prefersReducedMotion()) {
      setStage(5);
      setWords(total);
      return;
    }

    setStage(1);
    STAGE_AT.slice(1).forEach((t, i) =>
      timers.current.push(setTimeout(() => setStage(i + 2), t)),
    );
    timers.current.push(
      setTimeout(() => {
        let n = 0;
        const id = setInterval(() => {
          n += 1;
          setWords(n);
          if (n >= total) {
            clearInterval(id);
            setStage(5);
          }
        }, WORD_MS);
        timers.current.push(id);
      }, STAGE_AT[3] + 250),
    );
  };

  useEffect(() => stop, []);

  // Run the first sample question when the demo scrolls into view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        ask(SAMPLE_QUESTIONS[0]);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reached = (n) => stage >= n;
  const running = stage > 0 && stage < 5;
  const hitIds = new Set(
    result && reached(3) ? result.hits.map((h) => h.chunk.id) : [],
  );
  const maxScore = result?.hits[0]?.score || 1;

  let left = words;
  const answerLines =
    result &&
    result.answer.map((l, i) => {
      const ws = l.t.split(" ");
      const shown = ws.slice(0, Math.max(0, left));
      left -= ws.length;
      if (!shown.length) return null;
      return (
        <p key={i} className={l.cite ? "rag__ans-item" : "rag__ans-lead"}>
          {l.cite && <span className="rag__cite">[{l.cite}]</span>}
          {shown.join(" ")}
        </p>
      );
    });

  return (
    <div className="rag" ref={wrap} data-reveal>
      <div className="rag__bar">
        <span className="term__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="rag__file">rag-pipeline.js — ask my CV</span>
        <span
          className={`rag__status ${running ? "is-running" : stage === 5 ? "is-done" : ""}`}
        >
          {running ? "running" : stage === 5 ? "done" : "idle"}
        </span>
      </div>

      <form
        className="rag__ask"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <span className="rag__q" aria-hidden>
          Q
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Sameer's experience…"
          aria-label="Ask a question about Sameer's CV"
        />
        <button type="submit" className="rag__run">
          Run <FiCornerDownLeft aria-hidden />
        </button>
      </form>
      <div className="rag__samples">
        {SAMPLE_QUESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => ask(s)}>
            {s}
          </button>
        ))}
      </div>

      <ol className="rag__steps">
        {STAGES.map((s, i) => (
          <li
            key={s}
            className={`${stage === i + 1 ? "is-active" : ""} ${stage > i + 1 ? "is-done" : ""}`}
          >
            <span>{String(i + 1).padStart(2, "0")}</span> {s}
          </li>
        ))}
      </ol>

      <div className="rag__grid">
        <figure className="rag__space">
          <figcaption>
            <span>Vector space</span>
            <span>{CHUNKS.length} chunks · cosine · top-k 3</span>
          </figcaption>
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label="Scatter plot of CV passages; the question is placed near its closest matches"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
              <g key={v} className="rag__gridline">
                <line x1={v} y1="0" x2={v} y2="100" />
                <line x1="0" y1={v} x2="100" y2={v} />
              </g>
            ))}
            {Object.entries(CATEGORIES).map(([k, c]) => (
              <text
                key={k}
                x={c.center[0]}
                y={c.center[1] - 19}
                className="rag__cat"
                fill={c.color}
              >
                {c.label}
              </text>
            ))}
            {result &&
              reached(3) &&
              result.hits.map((h, i) => (
                <line
                  key={`${input}-${h.chunk.id}`}
                  className="rag__ray"
                  x1={result.point.x}
                  y1={result.point.y}
                  x2={h.chunk.x}
                  y2={h.chunk.y}
                  pathLength="1"
                  style={{ animationDelay: `${0.45 + i * 0.12}s` }}
                />
              ))}
            {CHUNKS.map((c) => (
              <circle
                key={c.id}
                cx={c.x}
                cy={c.y}
                r={hitIds.has(c.id) ? 2.3 : 1.3}
                fill={CATEGORIES[c.cat].color}
                className={hitIds.has(c.id) ? "rag__dot is-hit" : "rag__dot"}
              >
                <title>{c.source}</title>
              </circle>
            ))}
            {result &&
              reached(3) &&
              result.hits.map((h, i) => (
                <text
                  key={`s-${h.chunk.id}`}
                  x={h.chunk.x + 3}
                  y={h.chunk.y - 2.4}
                  className="rag__score"
                >
                  [{i + 1}] {h.score.toFixed(2)}
                </text>
              ))}
            <g
              className={`rag__query ${result && reached(3) ? "is-placed" : ""}`}
              style={{
                transform:
                  result && reached(3)
                    ? `translate(${result.point.x}px, ${result.point.y}px)`
                    : "translate(50px, 104px)",
              }}
            >
              <circle r="3.6" className="rag__query-halo" />
              <circle r="1.9" className="rag__query-core" />
            </g>
          </svg>
          <ul className="rag__legend">
            {Object.values(CATEGORIES).map((c) => (
              <li key={c.label}>
                <i style={{ background: c.color }} /> {c.label}
              </li>
            ))}
            <li>
              <i className="rag__legend-q" /> Your question
            </li>
          </ul>
        </figure>

        <div className="rag__panel" aria-live="polite">
          <section className={`rag__block ${reached(1) ? "is-in" : ""}`}>
            <h4>
              <span>01</span> Tokens
            </h4>
            <div className="rag__tokens">
              {result?.raw.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className={result.stop.includes(t) ? "is-stop" : ""}
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  {t}
                </span>
              ))}
              {result?.expanded.map((t, i) => (
                <span
                  key={`+${t}`}
                  className="is-exp"
                  style={{
                    animationDelay: `${(result.raw.length + i) * 45}ms`,
                  }}
                >
                  +{t}
                </span>
              ))}
            </div>
          </section>

          <section className={`rag__block ${reached(2) ? "is-in" : ""}`}>
            <h4>
              <span>02</span> Embedding <small>24-d preview</small>
            </h4>
            <svg
              className="rag__vec"
              viewBox="0 0 96 26"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line x1="0" y1="13" x2="96" y2="13" />
              {(result?.vector || new Array(24).fill(0)).map((v, i) => {
                const h = reached(2) ? Math.max(0.6, Math.abs(v) * 12) : 0.6;
                return (
                  <rect
                    key={i}
                    x={i * 4 + 0.5}
                    width="3"
                    y={v >= 0 ? 13 - h : 13}
                    height={h}
                    className={v >= 0 ? "is-pos" : "is-neg"}
                    style={{ transitionDelay: `${i * 18}ms` }}
                  />
                );
              })}
            </svg>
          </section>

          <section className={`rag__block ${reached(3) ? "is-in" : ""}`}>
            <h4>
              <span>03</span> Retrieved context
            </h4>
            {result && reached(3) && !result.hits.length && (
              <p className="rag__none">
                No passage scored above the threshold.
              </p>
            )}
            <ol className="rag__hits">
              {result &&
                reached(3) &&
                result.hits.map((h, i) => (
                  <li
                    key={`${input}-${h.chunk.id}`}
                    style={{ animationDelay: `${0.5 + i * 0.12}s` }}
                  >
                    <div className="rag__hit-head">
                      <i
                        style={{ background: CATEGORIES[h.chunk.cat].color }}
                      />
                      <span>
                        [{i + 1}] {h.chunk.source}
                      </span>
                      <code>{h.score.toFixed(2)}</code>
                    </div>
                    <div className="rag__meter">
                      <span
                        style={{ width: `${(h.score / maxScore) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ol>
          </section>

          <section
            className={`rag__block rag__answer ${reached(4) ? "is-in" : ""}`}
          >
            <h4>
              <span>04</span> Answer
            </h4>
            <div className="rag__ans">
              {answerLines}
              {stage === 4 && <span className="rag__caret" aria-hidden />}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
