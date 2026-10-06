import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { profile } from "../data/profile";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <p className="mono accent">05. What's next?</p>
        <h2 className="contact__title">Let's build something together.</h2>
        <p className="muted contact__lead">
          I'm open to new opportunities and collaborations, from full-stack
          product work to integrations and AI-powered features. My inbox is
          always open.
        </p>
        <div className="hero__cta center">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <FiMail aria-hidden /> Say hello
          </a>
          <a
            className="btn btn--ghost"
            href={profile.cv}
            download="Sameer-Rehman-CV-v1.pdf"
          >
            <FiDownload aria-hidden /> Download CV
          </a>
        </div>

        <ul className="contact__list mono">
          <li>
            <a href={`mailto:${profile.email}`}>
              <FiMail aria-hidden /> {profile.email}
            </a>
          </li>
          <li>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
              <FiPhone aria-hidden /> {profile.phone}
            </a>
          </li>
          <li>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
              <FiLinkedin aria-hidden /> /in/sameer-rehmank
            </a>
          </li>
          <li>
            <a href={profile.socials.github} target="_blank" rel="noreferrer">
              <FiGithub aria-hidden /> /sameerkhattak123
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
