import { Divider, Folio, RunningHead } from "./editorial";
export function Education() {
  return (
    <section id="education" aria-label="Education">
      <RunningHead number="IV" name="Education" />
      <Divider
        id="education"
        number="IV"
        title="Education"
        note="05 / Studies"
      />
      <div className="section education-spread">
        <div className="reading-page">
          <p className="eyebrow">Montréal, Québec</p>
          <h3>LaSalle College</h3>
          <p>
            DEC (DCS)
            <br />
            Computer Science
          </p>
        </div>
        <Folio label="Education" page="10" />
      </div>
    </section>
  );
}
