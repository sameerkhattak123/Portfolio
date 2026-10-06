import Section from "./Section";
import { experience } from "../data/profile";

export default function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      label="Experience"
      title={
        <>
          Where I've <em>worked.</em>
        </>
      }
    >
      <ol className="jobs">
        {experience.map((job, i) => (
          <li
            key={job.company}
            className="job"
            data-reveal
            style={{ "--d": `${i * 0.06}s` }}
          >
            <p className="job__period label">{job.period}</p>
            <div className="job__main">
              <h3>
                {job.role}
                <span className="job__company"> · {job.company}</span>
              </h3>
              <p className="job__loc label">{job.location}</p>
              <ul className="job__points">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <ul className="job__stack">
              {job.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
