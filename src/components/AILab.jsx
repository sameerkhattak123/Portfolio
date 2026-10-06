import { useState } from "react";
import Section from "./Section";
import AskCV from "./AskCV";
import { prefersReducedMotion } from "../motion";

// ---------- small looping illustrations, one per capability ----------

const PROMPT_LINES = [
  [["k", "system"], ": Be concise & factual."],
  [["k", "context"], ": ", ["v", "{{retrieved_docs}}"]],
  [["k", "user"], ": ", ["v", "{{question}}"]],
  [["k", "rules"], ": cite sources [n]"],
  [["k", "format"], ": json", ["art__caret", ""]],
];

function PromptArt() {
  return (
    <pre className="art art--prompt" aria-hidden>
      {PROMPT_LINES.map((line, i) => (
        <span key={i} className="code-line">
          {line.map((tok, j) =>
            typeof tok === "string" ? (
              tok
            ) : (
              <span key={j} className={tok[0]}>
                {tok[1]}
              </span>
            ),
          )}
        </span>
      ))}
    </pre>
  );
}

const CLUSTERS = [
  [28, 30],
  [72, 34],
  [50, 74],
];
const EMBED_DOTS = Array.from({ length: 18 }, (_, i) => {
  const c = i % 3;
  const a = i * 2.39996;
  return {
    c,
    x1: 8 + ((i * 37) % 84),
    y1: 8 + ((i * 53) % 84),
    x2: CLUSTERS[c][0] + Math.cos(a) * 9,
    y2: CLUSTERS[c][1] + Math.sin(a) * 8,
  };
});

function EmbedArt() {
  return (
    <svg className="art art--embed" viewBox="0 0 100 100" aria-hidden>
      {CLUSTERS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="15" className={`halo c${i}`} />
      ))}
      {EMBED_DOTS.map((d, i) => (
        <circle
          key={i}
          r="2.6"
          className={`dot c${d.c}`}
          style={{
            "--x1": d.x1,
            "--y1": d.y1,
            "--x2": d.x2,
            "--y2": d.y2,
            "--i": i,
          }}
        />
      ))}
    </svg>
  );
}

const AGENT_NODES = [
  { x: 20, y: 22, label: "plan", at: 0 },
  { x: 80, y: 22, label: "call tool", at: 0.286 },
  { x: 80, y: 74, label: "observe", at: 0.5 },
  { x: 20, y: 74, label: "answer", at: 0.786 },
];

function AgentArt({ animate }) {
  const loop = "M20,22 H80 V74 H20 Z";
  return (
    <svg className="art art--agent" viewBox="0 0 100 100" aria-hidden>
      <path d={loop} className="track" />
      <text x="50" y="50" className="center">
        state
      </text>
      {AGENT_NODES.map((n) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r="5.5"
            className="node"
            style={{ animationDelay: `${n.at * 4 - 4}s` }}
          />
          <text x={n.x} y={n.y < 50 ? n.y - 9 : n.y + 13} className="label">
            {n.label}
          </text>
        </g>
      ))}
      {animate && (
        <circle r="2.4" className="token">
          <animateMotion dur="4s" repeatCount="indefinite" path={loop} />
        </circle>
      )}
    </svg>
  );
}

const SHIP_BOXES = ["UI", "API", "λ", "LLM"];

function ShipArt({ animate }) {
  return (
    <svg className="art art--ship" viewBox="0 0 120 70" aria-hidden>
      <line x1="14" y1="30" x2="106" y2="30" className="wire" />
      <line x1="14" y1="42" x2="106" y2="42" className="wire" />
      {SHIP_BOXES.map((b, i) => (
        <g key={b} transform={`translate(${6 + i * 30}, 22)`}>
          <rect width="18" height="28" rx="4" className="box" />
          <text x="9" y="18.5" className="box-label">
            {b}
          </text>
        </g>
      ))}
      {animate &&
        [0, 0.8, 1.6].map((d) => (
          <circle key={`req${d}`} r="1.8" className="req">
            <animateMotion
              dur="2.4s"
              begin={`${d}s`}
              repeatCount="indefinite"
              path="M15,30 H105"
            />
          </circle>
        ))}
      {animate &&
        [1.2, 2.0].map((d) => (
          <circle key={`res${d}`} r="1.8" className="res">
            <animateMotion
              dur="2.4s"
              begin={`${d}s`}
              repeatCount="indefinite"
              path="M105,42 H15"
            />
          </circle>
        ))}
      <text x="60" y="64" className="caption">
        request → model → streamed response
      </text>
    </svg>
  );
}

export default function AILab() {
  const [animate] = useState(() => !prefersReducedMotion());

  const cards = [
    {
      title: "Prompt design",
      text: "Structured prompts, few-shot examples and strict output formats that make LLM behaviour predictable and testable.",
      backed: "OpenAI · Prompt Engineering for Developers",
      art: <PromptArt />,
    },
    {
      title: "Embeddings & semantic search",
      text: "Chunking content, embedding it and querying a vector database so answers are grounded in real data, not guesses.",
      backed: "Cohere & Pinecone short courses",
      art: <EmbedArt />,
    },
    {
      title: "Agents with LangGraph",
      text: "Stateful, multi-step workflows where a model plans, calls tools, checks the result and decides what happens next.",
      backed: "LangChain Academy certificate",
      art: <AgentArt animate={animate} />,
    },
    {
      title: "Shipping it to users",
      text: "React interfaces, Laravel and Node.js APIs and AWS Lambda functions: the plumbing that turns a model into a product.",
      backed: "Code District · production integrations",
      art: <ShipArt animate={animate} />,
    },
  ];

  return (
    <Section
      id="ai"
      index="04"
      label="AI engineering"
      title={
        <>
          LLM apps on a <em>full-stack</em> foundation.
        </>
      }
    >
      <p className="ai__intro" data-reveal>
        I come from shipping full-stack products, and I'm bringing that to LLM
        applications: designing prompts, grounding models in real data with
        embeddings and vector search, and orchestrating multi-step agents with
        LangGraph, all wired into the kind of APIs and serverless functions I
        build day to day.
      </p>

      <div className="ai__cards">
        {cards.map((c, i) => (
          <article
            key={c.title}
            className="ai__card"
            data-reveal
            style={{ "--d": `${i * 0.08}s` }}
          >
            <div className="ai__art">{c.art}</div>
            <h3>{c.title}</h3>
            <p className="muted">{c.text}</p>
            <p className="label ai__backed">{c.backed}</p>
          </article>
        ))}
      </div>

      <div className="ai__demo-head" data-reveal>
        <h3 className="label">
          <span className="section__index">Live demo</span> Ask my CV
        </h3>
        <p className="muted">
          A retrieval-augmented pipeline over my CV, running entirely in your
          browser. Ask a question and watch it tokenize, embed, retrieve the
          closest passages and compose a cited answer.
        </p>
      </div>
      <AskCV />
      <p className="ai__note label" data-reveal>
        Simplified for the browser: TF-IDF vectors stand in for a learned
        embedding model, and the answer is assembled from retrieved passages. In
        production the same shape uses an embedding API, a vector DB like
        Pinecone and an LLM for generation.
      </p>
    </Section>
  );
}
