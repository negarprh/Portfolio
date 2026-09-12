import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
export function About() {
  return (
    <section id="about" aria-label="About">
      <RunningHead number="VI" name="About" />
      <Divider
        id="about"
        number="VI"
        title="About me"
        note="07 / A little background"
      />
      <div className="section about-spread" data-boundary="spread">
        <div className="reading-page">
          <p>
            I’m Negar, a Computer Science graduate from LaSalle College in
            Montréal.
          </p>
          <p>
            I build backend features with TypeScript and NestJS, and write
            Python automation. I also work with React when a feature needs
            frontend changes.
          </p>
          <p>
            Outside that work, I maintain Canadian Tech Internships, an
            open-source repository that helps students find opportunities across
            Canada.
          </p>
          <p>I’m also a cat person.</p>
          <p className="signature">Negar</p>
        </div>
        <TurnSheet label="About" />
        <Folio label="About" page="12" />
      </div>
    </section>
  );
}
