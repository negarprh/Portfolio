import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
export function CurrentlyBuilding() {
  return (
    <section id="building" aria-label="Currently Building">
      <RunningHead number="III" name="Currently building" />
      <Divider
        id="building"
        number="III"
        title="Currently building"
        note="04 / In development"
      />
      <div className="section building-spread" data-boundary="spread">
        <div className="reading-page">
          <p className="eyebrow">Currently in development</p>
          <p>
            I’m building a platform for the audience around my Canadian tech
            internships repository.
          </p>
          <p>It’s launching soon. I’ll share more here when it’s ready.</p>
        </div>
        <TurnSheet label="Currently building" />
        <Folio label="Currently building" page="08" />
      </div>
    </section>
  );
}
