import { FiAward, FiExternalLink } from "react-icons/fi";
import Section from "./Section";
import { certifications, skills } from "../data/profile";

export default function Skills() {
  return (
    <Section id="skills" index={4} title="Skills & certifications">
      <div className="skills">
        {skills.map((s) => (
          <div key={s.group} className="card skills__group">
            <h3 className="mono card__label">{s.group}</h3>
            <ul className="tags">
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="subhead">Courses & certificates</h3>
      <ul className="certs">
        {certifications.map((c) => (
          <li key={c.title} className="card cert">
            <FiAward className="accent" size={22} aria-hidden />
            <div>
              <p className="cert__title">
                {c.link ? (
                  <a href={c.link} target="_blank" rel="noreferrer">
                    {c.title}{" "}
                    <FiExternalLink size={13} aria-label="View certificate" />
                  </a>
                ) : (
                  c.title
                )}
              </p>
              <p className="muted small">{c.issuer}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
