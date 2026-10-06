import {
  FiArrowRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { profile } from "../data/profile";

function yearsSince(date) {
  const ms = Date.now() - new Date(date).getTime();
  return Math.floor(ms / (365.25 * 24 * 3600 * 1000));
}

export default function Hero() {
  const years = yearsSince(profile.careerStart);

  return (
    <section className="hero" id="top">
      <div className="hero__grid container">
        <div className="hero__text">
          <p className="mono eyebrow">
            <span className="status-dot" aria-hidden /> Associate Software Engineer @
            Code District
          </p>
          <h1 className="hero__title">
            Hi, I'm {profile.name.split(" ")[0]}.
            <br />
            <span className="gradient">I build for the web.</span>
          </h1>
          <p className="hero__lead">
            {profile.tagline}. I take features from database schema to polished
            UI, and lately I've been wiring systems together with serverless
            integrations and LLM tooling.
          </p>

          <div className="hero__cta">
            <a
              className="btn btn--primary"
              href={profile.cv}
              download="Sameer-Rehman-CV-v1.pdf"
            >
              <FiDownload aria-hidden /> Download CV
            </a>
            <a className="btn btn--ghost" href="#projects">
              View my work <FiArrowRight aria-hidden />
            </a>
          </div>

          <ul className="hero__meta mono">
            <li>
              <FiMapPin aria-hidden /> {profile.location}
            </li>
            <li>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FiGithub />
              </a>
            </li>
            <li>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <FiMail />
              </a>
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__photo">
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width="750"
              height="961"
            />
          </div>
          <pre className="code-card mono" aria-hidden>
            {[
              [["c-key", "const"], " ", ["c-var", "sameer"], " = {"],
              ["  role: ", ["c-str", '"Software Engineer"'], ","],
              ["  stack: [", ["c-str", '"React"'], ", ", ["c-str", '"Laravel"'], ", ", ["c-str", '"Node"'], "],"],
              ["  experience: ", ["c-num", `${years}+`], " ", ["c-com", "// years"]],
              ["};"],
            ].map((line, i) => (
              <span key={i} className="code-line">
                {line.map((tok, j) =>
                  typeof tok === "string" ? tok : <span key={j} className={tok[0]}>{tok[1]}</span>
                )}
              </span>
            ))}
          </pre>
        </div>
      </div>

      <div className="container stats">
        <div>
          <strong>{years}+</strong>
          <span>years professional experience</span>
        </div>
        <div>
          <strong>3</strong>
          <span>companies &amp; internships</span>
        </div>
        <div>
          <strong>10+</strong>
          <span>projects shipped &amp; built</span>
        </div>
        <div>
          <strong>6</strong>
          <span>AI / LLM certifications</span>
        </div>
      </div>
    </section>
  );
}
