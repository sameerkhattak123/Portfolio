const ITEMS = [
  "React",
  "Laravel",
  "Node.js",
  "AWS Lambda",
  "MySQL",
  "MongoDB",
  "REST APIs",
  "Tailwind CSS",
  "LangGraph",
  "Express",
  "Power Platform",
];

export default function Marquee() {
  const row = ITEMS.map((t) => (
    <span key={t} className="marquee__item">
      {t}
      <i aria-hidden>✦</i>
    </span>
  ));
  return (
    <div className="marquee" aria-label={`Tech stack: ${ITEMS.join(", ")}`}>
      <div className="marquee__track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
