// A tiny, fully client-side retrieval pipeline over the CV data.
// TF-IDF vectors stand in for learned embeddings; the shape (tokenize → embed →
// retrieve top-k → compose with citations) mirrors a production RAG system.
import {
  certifications,
  education,
  experience,
  extras,
  profile,
  projects,
  skills,
} from "../data/profile";

export const CATEGORIES = {
  experience: { label: "Experience", color: "#e0a179", center: [26, 26] },
  projects: { label: "Projects", color: "#8fb3d9", center: [74, 24] },
  skills: { label: "Skills", color: "#a9c27a", center: [24, 70] },
  ai: { label: "AI / LLM", color: "#c99ad6", center: [74, 68] },
  profile: { label: "Profile", color: "#d9c27a", center: [50, 47] },
};

const STOP = new Set(
  (
    "a an the and or of to in on for with at by from is are was were be been being i me my " +
    "he his him she her sameer sameers rehman does do did has have had what which who whom how " +
    "where when why can could would should you your about tell any this that it its as into than " +
    "then there their them they we our us show list give much many some kind kinds use used using " +
    "also more most know knows experience work worked working build built building made make " +
    "study studied studying now current currently"
  ).split(" "),
);

// Intent words: too generic to match on, but they say what the question is about.
const HINTS = {
  work: ["company", "role", "present"],
  worked: ["company", "role"],
  working: ["company", "role"],
  now: ["present", "current"],
  current: ["present", "current"],
  currently: ["present", "current"],
  build: ["project"],
  built: ["project"],
  building: ["project"],
  made: ["project"],
  make: ["project"],
  study: ["education", "degree"],
  studied: ["education", "degree"],
  studying: ["education", "degree"],
};

// Query-side expansion: maps everyday words onto the vocabulary used in the CV.
const EXPAND = {
  aws: ["lambda", "serverless"],
  cloud: ["aws", "lambda", "serverless"],
  ai: ["llm", "prompt", "langgraph", "openai", "vector", "semantic"],
  llm: ["prompt", "langgraph", "openai", "vector"],
  llms: ["prompt", "langgraph", "openai", "vector"],
  ml: ["llm", "hugging"],
  machine: ["llm", "hugging"],
  gpt: ["openai", "chatgpt", "prompt"],
  chatgpt: ["openai", "prompt"],
  rag: ["vector", "semantic", "search", "retrieval"],
  retrieval: ["vector", "semantic", "search"],
  embedding: ["vector", "semantic"],
  agent: ["langgraph"],
  python: ["langgraph"],
  frontend: ["react", "tailwind", "css"],
  ui: ["react", "front"],
  backend: ["laravel", "nodej", "express", "api"],
  api: ["rest", "api"],
  database: ["mysql", "mongodb", "sqlite", "databas"],
  databas: ["mysql", "mongodb", "sqlite"],
  db: ["mysql", "mongodb", "sqlite", "databas"],
  sql: ["mysql", "sqlite"],
  job: ["company", "role"],
  degree: ["education"],
  university: ["education"],
  school: ["education"],
  college: ["education"],
  hire: ["contact", "email"],
  email: ["contact"],
  reach: ["contact"],
  phone: ["contact"],
  test: ["selenium", "sqa"],
  testing: ["selenium", "sqa"],
  mobile: ["flutter"],
  game: ["unity"],
  php: ["laravel"],
  js: ["javascript"],
  certificat: ["course"],
  certif: ["course"],
};

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/node\.js/g, "nodejs")
    .replace(/react\.js/g, "react")
    .replace(/c#/g, "csharp")
    .replace(/c\+\+/g, "cpp")
    .replace(/[’']/g, "");
}

function stem(w) {
  for (const suf of ["ing", "ed", "es", "s"]) {
    if (w.length - suf.length >= 4 && w.endsWith(suf))
      return w.slice(0, -suf.length);
  }
  return w;
}

// Raw tokens, for display (keeps stopwords so the UI can show them being dropped).
export function rawTokens(text) {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function terms(text) {
  return rawTokens(text)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

// Small deterministic hash (FNV-1a) → [0, 1)
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

function buildChunks() {
  const chunks = [];
  experience.forEach((j) =>
    j.points.forEach((p) =>
      chunks.push({
        cat: "experience",
        source: `${j.company} · ${j.role}`,
        text: `${j.company}: ${p}`,
        extra: `${j.company} ${j.role} ${j.period} ${j.stack.join(" ")} company role`,
      }),
    ),
  );
  projects.forEach((p) =>
    chunks.push({
      cat: "projects",
      source: p.title,
      text: `${p.title}: ${p.description}`,
      extra: `${p.stack.join(" ")} ${p.kind} project`,
    }),
  );
  skills.forEach((s) =>
    chunks.push({
      cat: s.group.startsWith("AI") ? "ai" : "skills",
      source: `Skills · ${s.group}`,
      text: `${s.group}: ${s.items.join(", ")}.`,
      extra: "skill tool stack",
    }),
  );
  certifications.forEach((c) => {
    const issuer = c.issuer.split(" · ")[0];
    chunks.push({
      cat: "ai",
      source: `Course · ${issuer}`,
      text: `Completed “${c.title}” (${issuer}).`,
      extra: "course certificate llm learning",
    });
  });
  chunks.push({
    cat: "profile",
    source: "Education",
    text: `${education.degree}, ${education.school} (${education.period}). ${education.notes.join(". ")}.`,
    extra: "education graduate",
  });
  extras.forEach((x) =>
    chunks.push({
      cat: "profile",
      source: "Leadership",
      text: `${x.title}, ${x.org}: ${x.text}`,
      extra: "leadership extracurricular volunteer",
    }),
  );
  chunks.push({
    cat: "profile",
    source: "Current role",
    text: `Currently ${experience[0].role} at ${experience[0].company} (${experience[0].period}), ${experience[0].location}.`,
    extra: "current present now role company job",
  });
  profile.about.forEach((a) =>
    chunks.push({
      cat: "profile",
      source: "About",
      text: a,
      extra: "summary who profile",
    }),
  );
  chunks.push({
    cat: "profile",
    source: "Contact",
    text: `Reach Sameer at ${profile.email} or ${profile.phone}. Based in ${profile.location}.`,
    extra: "contact email phone location based",
  });

  return chunks.map((c, i) => {
    const [cx, cy] = CATEGORIES[c.cat].center;
    const a = hash(c.text) * Math.PI * 2;
    const r = 4 + hash(c.text + "r") * 13;
    return {
      ...c,
      id: i,
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.85,
    };
  });
}

export const CHUNKS = buildChunks();

// ---- TF-IDF index ----
const docTerms = CHUNKS.map((c) => terms(`${c.text} ${c.extra}`));
const df = new Map();
docTerms.forEach((ts) =>
  new Set(ts).forEach((t) => df.set(t, (df.get(t) || 0) + 1)),
);
const N = CHUNKS.length;
const idf = (t) => Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;

function vectorize(ts) {
  const tf = new Map();
  ts.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
  const v = new Map();
  let norm = 0;
  tf.forEach((n, t) => {
    if (!df.has(t)) return;
    const w = (1 + Math.log(n)) * idf(t);
    v.set(t, w);
    norm += w * w;
  });
  norm = Math.sqrt(norm) || 1;
  v.forEach((w, t) => v.set(t, w / norm));
  return v;
}

const docVecs = docTerms.map(vectorize);

function cosine(a, b) {
  let s = 0;
  a.forEach((w, t) => {
    const o = b.get(t);
    if (o) s += w * o;
  });
  return s;
}

// Signed feature-hashing of the query terms into a short vector, for the "embedding" bars.
export function embedPreview(ts, dims = 24) {
  const v = new Array(dims).fill(0);
  ts.forEach((t) => {
    const i = Math.floor(hash(t) * dims);
    v[i] += hash(t + "#") > 0.5 ? 1 : -1;
  });
  const max = Math.max(1, ...v.map(Math.abs));
  return v.map((x) => x / max);
}

export function retrieve(question, k = 3) {
  const raw = rawTokens(question);
  const base = terms(question);
  const expanded = [];
  raw.forEach((t) =>
    (HINTS[t] || []).forEach((e) => {
      const s = stem(e);
      if (!base.includes(s) && !expanded.includes(s)) expanded.push(s);
    }),
  );
  base.forEach((t) =>
    (EXPAND[t] || []).forEach((e) => {
      const s = stem(e);
      if (!base.includes(s) && !expanded.includes(s)) expanded.push(s);
    }),
  );
  const q = vectorize([...base, ...base, ...expanded]); // original words weigh more
  const scored = docVecs
    .map((d, i) => ({ chunk: CHUNKS[i], score: cosine(q, d) }))
    .sort((a, b) => b.score - a.score);
  const hits = scored.slice(0, k).filter((h) => h.score > 0.08);

  let qx = 50;
  let qy = 47;
  if (hits.length) {
    const total = hits.reduce((s, h) => s + h.score, 0);
    qx = hits.reduce((s, h) => s + h.chunk.x * h.score, 0) / total;
    qy = hits.reduce((s, h) => s + h.chunk.y * h.score, 0) / total;
  }

  return {
    raw,
    stop: raw.filter((t) => t.length <= 1 || STOP.has(t)),
    base,
    expanded,
    vector: embedPreview([...base, ...expanded]),
    hits,
    point: { x: qx, y: qy },
    answer: compose(hits),
  };
}

function compose(hits) {
  if (!hits.length) {
    return [
      {
        t: "I couldn't find that in Sameer's CV. Try asking about his experience, projects, skills or AI work.",
      },
    ];
  }
  return [
    {
      t: `Found ${hits.length} relevant passage${hits.length > 1 ? "s" : ""} in Sameer's CV:`,
    },
    ...hits.map((h, i) => ({ t: h.chunk.text, cite: i + 1 })),
  ];
}

export const SAMPLE_QUESTIONS = [
  "What AI and LLM tools does Sameer use?",
  "Has he worked with AWS?",
  "What has he built with React and Laravel?",
  "Where does he work now?",
  "What did he study?",
];
