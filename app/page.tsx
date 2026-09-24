import { CoverSeal } from "@/components/cover-seal";
import { CoverName } from "@/components/cover-name";
import { Closing } from "@/components/closing";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { CurrentlyBuilding } from "@/components/currently-building";
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
                NEGAR PIRASTEH — SELECTED WORK & EXPERIENCE
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
                    Open the book <span aria-hidden="true">↓</span>
                  </a>
                  <span className="edition mono">MONTRÉAL, CANADA</span>
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
            <RunningHead number="01" name="Introduction" />
            <div className="running-head mono">
              <span>01 / INTRODUCTION</span>
              <span>HELLO, I’M NEGAR</span>
            </div>
            <div className="intro-grid">
              <div>
                <h2 id="intro-title">Hi, I’m Negar.</h2>
                <p className="body-copy">
                  I’m a software developer based in Montréal. I love building
                  from the ground up and turning ideas into things people
                  actually use.
                </p>

                <p className="body-copy">
                  I’ve helped build and launch the first versions of two
                  products, built a large-scale data system from scratch, and
                  created an open-source project that grew into a resource used
                  by thousands across Canada.
                </p>

                <p className="body-copy">
                  I like understanding the whole system, taking ownership, and
                  finding ways to make things faster, cleaner, and more
                  reliable.
                </p>
              </div>
              <aside className="intro-facts">
                <p className="availability">
                  <span /> Open to opportunities
                </p>
                <dl>
                  <dt>ROLE</dt>
                  <dd>Backend / Full-Stack Developer</dd>
                  <dt>BASED IN</dt>
                  <dd>Montréal, Canada</dd>
                  <dt>CORE STACK</dt>
                  <dd className="mono">
                    TypeScript · Node.js · NestJS · Python · FastAPI
                    <br />
                    PostgreSQL · React / Next.js · Docker
                  </dd>
                </dl>
                <ContactLinks compact />
              </aside>
            </div>
            <Folio label="Negar Pirasteh" page="01" />
          </section>
          <div className="opening-runway" aria-hidden="true" />
        </div>
        <Experience />
        <SelectedWork stars={stars} />
        <CurrentlyBuilding />
        <Education />
        <Skills />
        <Closing />
      </main>
    </>
  );
}
