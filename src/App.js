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
import BootLoader from "./components/BootLoader";
import CommandPalette from "./components/CommandPalette";
import Terminal from "./components/Terminal";
import { useRevealOnScroll } from "./hooks";
import { useEffect } from "react";
import { usePointerEffects, useScrollProgress } from "./motion";
import { profile } from "./data/profile";

export default function App() {
  useRevealOnScroll();
  useScrollProgress();
  usePointerEffects();

  useEffect(() => {
    console.log(
      "%c<sameer/>%c\n\nHey, fellow developer 👋 Thanks for peeking under the hood.\nThis site is React + vanilla CSS, no animation libraries.\nLet's talk: %s\nTip: press Ctrl/⌘ + K anywhere on the page.",
      "font: 600 22px Georgia, serif; font-style: italic; color: #9b4a25;",
      "font: 13px ui-monospace, monospace; color: #3a3833;",
      profile.email,
    );
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <BootLoader />
      <CommandPalette />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Terminal />
        <Contact />
      </main>
    </>
  );
}
