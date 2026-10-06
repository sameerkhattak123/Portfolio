import { FiExternalLink, FiFolder, FiGithub } from "react-icons/fi";
import Section from "./Section";
import { profile, projects } from "../data/profile";

function Links({ project }) {
  return (
    <div className="project__links">
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} source code`}
        >
          <FiGithub />
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} live demo`}
        >
          <FiExternalLink />
        </a>
      )}
    </div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" index={3} title="Things I've built">
      <div className="featured">
        {featured.map((p) => (
          <article
            key={p.title}
            className={`card project project--featured ${p.image ? "has-image" : ""}`}
          >
            {p.image && (
              <a
                className="project__image"
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
            )}
            <div className="project__body">
              <div className="project__top">
                <p className="mono accent small">{p.kind}</p>
                <Links project={p} />
              </div>
              <h3>{p.title}</h3>
              <p className="muted">{p.description}</p>
              <ul className="tags">
                {p.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <h3 className="subhead">Other noteworthy projects</h3>
      <div className="grid-3">
        {others.map((p) => (
          <article key={p.title} className="card project">
            <div className="project__top">
              <FiFolder className="accent" size={26} aria-hidden />
              <Links project={p} />
            </div>
            <h3>{p.title}</h3>
            <p className="muted">{p.description}</p>
            <ul className="tags tags--plain mono">
              {p.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="center">
        <a
          className="btn btn--ghost"
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
        >
          <FiGithub aria-hidden /> More on GitHub
        </a>
      </div>
    </Section>
  );
}
