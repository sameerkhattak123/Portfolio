import Section from "./Section";
import { education, extras, languages, profile } from "../data/profile";

export default function About() {
  return (
    <Section id="about" index={1} title="About me">
      <div className="about">
        <div className="about__text">
          {profile.about.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <p>
            Outside of work: chess, guitar, puzzles and speed-cubing. I speak{" "}
            {languages.join(", ")}.
          </p>
        </div>

        <aside className="card about__facts">
          <h3 className="mono card__label">// education</h3>
          <p className="about__school">{education.degree}</p>
          <p className="muted">{education.school}</p>
          <p className="mono muted small">{education.period}</p>
          <ul className="ticks">
            {education.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>

          <h3 className="mono card__label">// leadership</h3>
          {extras.map((x) => (
            <div key={x.title}>
              <p className="about__school">{x.title}</p>
              <p className="muted">{x.org}</p>
            </div>
          ))}
        </aside>
      </div>
    </Section>
  );
}
