import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import { useRevealOnScroll } from "./hooks";
import { usePointerEffects, useScrollProgress } from "./motion";

export default function App() {
  useRevealOnScroll();
  useScrollProgress();
  usePointerEffects();

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
