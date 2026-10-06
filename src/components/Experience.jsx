import Section from "./Section";
import { experience } from "../data/profile";

export default function Experience() {
  return (
    <Section id="experience" index={2} title="Where I've worked">
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.company} className="timeline__item">
            <span className="timeline__dot" aria-hidden />
            <div className="timeline__head">
              <h3>
                {job.role} <span className="accent">@ {job.company}</span>
              </h3>
              <p className="mono muted small">
                {job.period} · {job.location}
              </p>
            </div>
            <ul className="ticks">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <ul className="tags">
              {job.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
