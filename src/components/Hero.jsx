import { FiArrowDown, FiDownload } from "react-icons/fi";
import { certifications, experience, profile } from "../data/profile";
import { useCountUp, useLocalTime, yearsSince } from "../hooks";
import HeroField from "./HeroField";
import TypeRotate from "./TypeRotate";

const BUILD_WORDS = ["products", "APIs", "AI agents", "systems"];

function Stat({ value, suffix = "", label }) {
  const [ref, n] = useCountUp(value);
  return (
    <div className="stat" ref={ref}>
      <strong>
        {n}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export default function Hero() {
  const time = useLocalTime();
  const current = experience[0];

  return (
    <section className="hero" id="top" data-progress="exit">
      <HeroField />
      <div className="container hero__grid">
        <div className="hero__text">
          <p className="label hero__label anim" data-wire="<Status />" style={{ "--d": "0.05s" }}>
            <span className="dot" aria-hidden /> Available for new opportunities
          </p>

          <h1 className="hero__title" data-wire='<Heading as="h1" />'>
            <span className="line">
              <span style={{ "--d": "0.12s" }}>Software engineer</span>
            </span>
            <span className="line">
              <span style={{ "--d": "0.22s" }}>building reliable</span>
            </span>
            <span className="line">
              <span style={{ "--d": "0.32s" }}>
                <TypeRotate words={BUILD_WORDS} />, <em>end to end.</em>
              </span>
            </span>
          </h1>

          <p className="hero__lead anim" data-wire="<Intro />" style={{ "--d": "0.5s" }}>
            I'm {profile.name}, a full-stack developer in{" "}
            {profile.location.split(",")[0]}. I work with React, Laravel and
            Node.js, and I take features from schema design and APIs through to
            a polished interface. Lately that includes serverless integrations
            on AWS and LLM tooling.
          </p>

          <div className="hero__cta anim" data-wire="<Actions />" style={{ "--d": "0.62s" }}>
            <a
              className="btn btn--dark magnetic"
              href={profile.cv}
              download="Sameer-Rehman-CV-v1.pdf"
            >
              <FiDownload aria-hidden /> Download résumé
            </a>
            <a className="btn btn--line magnetic" href="#work">
              View selected work <FiArrowDown aria-hidden />
            </a>
          </div>
        </div>

        <figure className="hero__portrait" data-tilt="10" data-wire="<Portrait />">
          <div className="portrait">
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width="960"
              height="1200"
            />
          </div>
          <figcaption className="portrait__card">
            <span className="label">Currently</span>
            <p>
              {current.role}
              <br />
              <span className="accent">@ {current.company}</span>
            </p>
          </figcaption>
          <p className="portrait__time label">Lahore · {time} PKT</p>
        </figure>
      </div>

      <div className="container stats rule-top" data-reveal data-wire="<Stats />">
        <Stat
          value={yearsSince(profile.careerStart)}
          suffix="+"
          label="Years in industry"
        />
        <Stat value={experience.length} label="Companies & internships" />
        <Stat value={10} suffix="+" label="Projects built" />
        <Stat value={certifications.length} label="AI / LLM certifications" />
      </div>
    </section>
  );
}
