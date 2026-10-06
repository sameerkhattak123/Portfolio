import { FiArrowUpRight } from "react-icons/fi";
import { profile } from "../data/profile";
import { useLocalTime } from "../hooks";

export default function Contact() {
  const time = useLocalTime();
  const links = [
    ["LinkedIn", profile.socials.linkedin],
    ["GitHub", profile.socials.github],
    ["Résumé", profile.cv],
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <p className="label" data-reveal>
          <span className="section__index">05</span> Contact
        </p>
        <h2 className="contact__title" data-reveal style={{ "--d": "0.06s" }}>
          Have a project or role in mind? <em>Let's talk.</em>
        </h2>
        <a
          className="contact__email"
          href={`mailto:${profile.email}`}
          data-reveal
          style={{ "--d": "0.12s" }}
        >
          {profile.email}
          <FiArrowUpRight aria-hidden />
        </a>

        <div className="contact__grid" data-reveal style={{ "--d": "0.18s" }}>
          <div>
            <p className="label">Phone</p>
            <a
              className="link"
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
            >
              {profile.phone}
            </a>
          </div>
          <div>
            <p className="label">Location</p>
            <p>
              {profile.location} · {time}
            </p>
          </div>
          <div>
            <p className="label">Elsewhere</p>
            <p className="contact__links">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  className="link"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label} <FiArrowUpRight aria-hidden />
                </a>
              ))}
            </p>
          </div>
        </div>
      </div>

      <footer className="container footer label rule-top">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a className="link" href="#top">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
