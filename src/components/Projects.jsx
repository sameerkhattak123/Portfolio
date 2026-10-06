import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import Section from "./Section";
import { profile, projects } from "../data/profile";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <Section
      id="work"
      index="03"
      label="Selected work"
      title={
        <>
          Things I've <em>built.</em>
        </>
      }
    >
      <div className="work">
        {featured.map((p, i) => (
          <article
            key={p.title}
            className={`work__card ${p.image ? "work__card--image" : ""}`}
            data-tilt="4"
            data-reveal
            style={{ "--d": `${i * 0.08}s` }}
          >
            {p.image ? (
              <a
                className="work__media"
                data-progress="through"
                data-cursor="View"
                href={p.live}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
              >
                <img
                  src={p.image}
                  alt={`${p.title} screenshot`}
                  loading="lazy"
                />
              </a>
            ) : (
              <div className="work__media work__media--type" aria-hidden>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
            )}
            <div className="work__body">
              <p className="label">
                {p.kind} · {p.stack.slice(0, 3).join(" / ")}
              </p>
              <h3>{p.title}</h3>
              <p className="muted">{p.description}</p>
              {(p.live || p.repo) && (
                <div className="work__links">
                  {p.live && (
                    <a
                      className="link"
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live site <FiArrowUpRight aria-hidden />
                    </a>
                  )}
                  {p.repo && (
                    <a
                      className="link"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source <FiGithub aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <h3 className="subhead label" data-reveal>
        More projects
      </h3>
      <ul className="index">
        {others.map((p, i) => (
          <li
            key={p.title}
            className="index__row"
            data-reveal
            style={{ "--d": `${i * 0.05}s` }}
          >
            <span className="label index__num">
              {String(i + featured.length + 1).padStart(2, "0")}
            </span>
            <span className="index__title">{p.title}</span>
            <span className="index__desc muted">{p.description}</span>
            <span className="label index__stack">{p.stack.join(" · ")}</span>
          </li>
        ))}
      </ul>

      <p className="more" data-reveal>
        <a
          className="link"
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
        >
          See everything on GitHub <FiArrowUpRight aria-hidden />
        </a>
      </p>
    </Section>
  );
}
