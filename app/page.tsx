import { CoverSeal } from "@/components/cover-seal";
import { CoverName } from "@/components/cover-name";
import { Closing } from "@/components/closing";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { SelectedWork } from "@/components/selected-work";
import { getGitHubStars } from "@/lib/github";
import { BookMotion } from "@/components/book-motion";
import { Experience } from "@/components/experience";
import { BookIndex } from "@/components/book-index";
import {
  ContactLinks,
  Folio,
  RunningHead,
  TurnSheet,
} from "@/components/editorial";
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
        <div className="book-opening">
          <section className="cover" aria-labelledby="cover-title">
            <div className="cover-art">
              <CoverSeal />
              <div className="cover-spine mono" aria-hidden="true">
                NEGAR PIRASTEH - SELECTED WORK & EXPERIENCE
              </div>
              <div className="cover-content">
                <div className="cover-top mono">
                  <span className="cover-mark-space" aria-hidden="true" />
                  <span>MONTRÉAL, QC</span>
                  <span>VOL. 01 / 2026</span>
                </div>
                <div className="cover-heading">
                  <p className="eyebrow">Selected work & experience</p>
                  <CoverName />
                  <div className="cover-role">
                    <span className="small-rule" />
                    SOFTWARE DEVELOPER
                  </div>
                </div>
                <div className="cover-bottom">
                  <p>Selected work & experience</p>
                  <a className="open-book" href="#introduction">
                    <span className="open-book-copy">
                      <span className="open-book-title">Open the book</span>
                      <span className="open-book-hint">
                        Scroll down to begin
                      </span>
                    </span>
                    <svg
                      className="open-book-cue"
                      viewBox="0 0 20 32"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M10 2v26m-6-6 6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <TurnSheet label="" />
          </section>
          <section
            id="introduction"
            className="paper section introduction"
            aria-labelledby="intro-title"
          >
            <RunningHead number="I" name="Introduction" />
            <div className="running-head mono">
              <span>01 / INTRODUCTION</span>
              <span>HELLO, I’M NEGAR</span>
            </div>
            <div className="intro-grid">
              <div>
                <h2 id="intro-title">Hi, I’m Negar!</h2>
                <p className="body-copy">
                  I’m a software developer based in Montréal. I enjoy building
                  things from scratch, understanding how systems work, and
                  turning ideas into products people actually use.
                </p>

                <p className="body-copy">
                  I’ve worked on production software across three teams, from
                  backend systems and APIs to full-stack features. Outside of
                  work, I built Canadian Tech Internships, an open-source
                  project
                  {stars !== null
                    ? ` that has grown to ${stars > 1200 ? "over 1,200" : stars.toLocaleString("en-CA")} GitHub stars`
                    : " on GitHub"}
                  .
                </p>

                <p className="body-copy">
                  I’m someone who takes ownership, digs into challenging
                  problems, and cares about the details that make software
                  better. The best part is seeing something I’ve built being
                  used by real people.
                </p>
              </div>
              <aside className="intro-facts">
                <dl>
                  <dt>ROLE</dt>
                  <dd>Backend / Full-Stack Developer</dd>
                  <dt>BASED IN</dt>
                  <dd>Montréal, Canada</dd>
                  <dt>CORE STACK</dt>
                  <dd className="mono">TypeScript · Node.js · Python</dd>
                </dl>
                <ContactLinks compact />
              </aside>
            </div>
            <Folio label="Negar Pirasteh" page="01" />
          </section>
          <div className="opening-runway" aria-hidden="true" />
        </div>
        <Experience />
        <Skills />
        <SelectedWork stars={stars} />
        <Education />
        <Closing />
      </main>
    </>
  );
}
