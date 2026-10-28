import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
export function Education() {
  return (
    <section id="education" aria-label="Education">
      <RunningHead number="V" name="Education" />
      <Divider
        id="education"
        number="V"
        title="Education"
        note="05 / Studies"
      />
      <div className="section education-spread" data-boundary="spread">
        <div className="spread-content education-content">
          <div className="education-field">
            <h3 className="education-program">Computer Science: Programming</h3>
            <p className="education-degree">DEC / Diploma of College Studies</p>
          </div>
          <div className="education-credential">
            <p className="education-college">LaSalle College</p>
            <p className="education-location">Montréal, Québec</p>
            <p className="education-dates mono">2023 - 2026</p>
            <p className="education-context">
              A three-year technical program centered on software development,
              combining computer science fundamentals with hands-on application.
            </p>
          </div>
        </div>
        <TurnSheet label="Education" />
        <Folio label="Education" page="10" />
      </div>
    </section>
  );
}
