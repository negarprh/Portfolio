import { CoverSeal } from "@/components/cover-seal";
import { Closing } from "@/components/closing";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { CurrentlyBuilding } from "@/components/currently-building";
import { SelectedWork } from "@/components/selected-work";
import { getGitHubStars } from "@/lib/github";
import { BookMotion } from "@/components/book-motion";
import { Experience } from "@/components/experience";
import { BookIndex } from "@/components/book-index";
import { ContactLinks, Folio, RunningHead } from "@/components/editorial";
export const revalidate = 3600;
export default async function Home() {
  const stars = await getGitHubStars();
  return (
    <>
      <a className="skip-link" href="#introduction">
        Skip to introduction
      </a>
      <BookIndex />
      <BookMotion />
      <main id="top">
        <section className="cover" aria-labelledby="cover-title">
          <CoverSeal />
          <div className="cover-spine mono" aria-hidden="true">
            NEGAR PIRASTEH — SELECTED WORK & EXPERIENCE — 2025–2026
          </div>
          <div className="cover-content">
            <div className="cover-top mono">
              <span className="cover-mark-space" aria-hidden="true" />
              <span>MONTRÉAL, QC</span>
              <span>VOL. 01 / 2026</span>
            </div>
            <div className="cover-heading">
              <p className="eyebrow">Selected work & experience</p>
              <h1 id="cover-title">
                Negar
                <br />
                <em>
                  Pirasteh<span className="accent cover-dot">.</span>
                </em>
              </h1>
              <div className="cover-role">
                <span className="small-rule" />
                SOFTWARE DEVELOPER
              </div>
            </div>
            <div className="cover-bottom">
              <p>
                Selected work & experience
                <br />
                <span className="muted">2025–2026</span>
              </p>
              <a className="open-book" href="#introduction">
                Open the book <span aria-hidden="true">↓</span>
              </a>
              <span className="edition mono">
                TYPESCRIPT & PYTHON
                <br />
                MONTRÉAL, CANADA
              </span>
            </div>
          </div>
        </section>
        <section
          id="introduction"
          className="paper section introduction"
          aria-labelledby="intro-title"
        >
          <RunningHead number="01" name="Introduction" />
          <div className="running-head mono">
            <span>01 / INTRODUCTION</span>
            <span>HELLO, I’M NEGAR</span>
          </div>
          <div className="intro-grid">
            <div>
              <h2 id="intro-title">Hi, I’m Negar.</h2>
              <p className="body-copy">
                I’m a software developer in Montréal. Most of my work is on the
                backend, using TypeScript with NestJS and Python with FastAPI.
              </p>
              <p className="body-copy">
                I’ve built backend features for healthcare platforms, worked on
                job-collection pipelines, and contributed to frontend work in
                React.
              </p>
            </div>
            <aside className="intro-facts">
              <p className="availability">
                <span /> Open to opportunities
              </p>
              <dl>
                <dt>ROLE</dt>
                <dd>Software Developer</dd>
                <dt>BASED IN</dt>
                <dd>Montréal, Canada</dd>
                <dt>CORE STACK</dt>
                <dd className="mono">
                  TypeScript · NestJS · Python · FastAPI
                  <br />
                  React / Next.js · PostgreSQL · Docker
                </dd>
              </dl>
              <ContactLinks compact />
            </aside>
          </div>
          <Folio label="Negar Pirasteh" page="01" />
        </section>
        <Experience />
        <SelectedWork stars={stars} />
        <CurrentlyBuilding />
        <Education />
        <Skills />
        <About />
        <Closing />
      </main>
    </>
  );
}
