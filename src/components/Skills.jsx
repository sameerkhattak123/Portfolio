import { FiArrowUpRight } from "react-icons/fi";
import Section from "./Section";
import { certifications, skills } from "../data/profile";

export default function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      label="Capabilities"
      title={
        <>
          Tools I <em>reach for.</em>
        </>
      }
    >
      <div className="skills">
        {skills.map((s, i) => (
          <div
            key={s.group}
            className="skills__col"
            data-reveal
            style={{ "--d": `${(i % 4) * 0.06}s` }}
          >
            <h3 className="label">{s.group}</h3>
            <ul>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="subhead label" data-reveal>
        Courses &amp; certificates
      </h3>
      <ul className="certs">
        {certifications.map((c, i) => (
          <li
            key={c.title}
            className="certs__row"
            data-reveal
            style={{ "--d": `${i * 0.04}s` }}
          >
            {c.link ? (
              <a
                className="certs__title link"
                href={c.link}
                target="_blank"
                rel="noreferrer"
              >
                {c.title} <FiArrowUpRight aria-hidden />
              </a>
            ) : (
              <span className="certs__title">{c.title}</span>
            )}
            <span className="label">
              {c.issuer.replace(" · Short course", "")}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
