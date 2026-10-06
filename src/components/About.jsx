import Section from "./Section";
import {
  education,
  experience,
  extras,
  languages,
  profile,
} from "../data/profile";
import { yearsSince } from "../hooks";

export default function About() {
  const facts = [
    ["Based in", profile.location],
    ["Experience", `${yearsSince(profile.careerStart)}+ years professional`],
    ["Currently", `${experience[0].role}, ${experience[0].company}`],
    ["Education", `${education.degree}, COMSATS`],
    ["Scholarship", "PEEF, full four-year degree"],
    ["Languages", languages.join(", ")],
  ];

  return (
    <Section
      id="about"
      index="01"
      label="About"
      title={
        <>
          Pragmatic engineering, <em>thoughtful</em> delivery.
        </>
      }
    >
      <div className="about">
        <div className="about__text">
          {profile.about.map((p, i) => (
            <p key={i} data-reveal style={{ "--d": `${i * 0.08}s` }}>
              {p}
            </p>
          ))}
          <p data-reveal style={{ "--d": "0.16s" }}>
            Off the clock: {extras[0].title.toLowerCase()} for {extras[0].org},
            plus chess, guitar and puzzle-solving.
          </p>
        </div>

        <dl className="facts" data-reveal style={{ "--d": "0.1s" }}>
          {facts.map(([k, v]) => (
            <div key={k} className="facts__row">
              <dt className="label">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
