import { ContactLinks, TurnSheet, Folio, RunningHead } from "./editorial";
export function Closing() {
  return (
    <>
      <section
        id="contact"
        className="closing section"
        aria-labelledby="contact-title"
        data-boundary="contact"
      >
        <RunningHead number="VII" name="Contact" />
        <div className="running-head mono">
          <span>08 / CONTACT</span>
          <span>Negar Pirasteh</span>
        </div>
        <div className="closing-content">
          <h2 id="contact-title">
            That’s all
            <br />
            <em>for now.</em>
          </h2>
          <p className="closing-note">
            I’m currently looking for my next
            <br className="desktop-break" /> software engineering opportunity.
          </p>
          <p className="closing-name">Negar Pirasteh</p>
          <ContactLinks />
        </div>
        <Folio label={<a href="#top">BACK TO THE COVER ↑</a>} page="13" />
        <TurnSheet label="Contact" />
      </section>
      <footer className="back-cover" data-boundary="back-cover">
        <span className="back-monogram" aria-hidden="true">
          np.
        </span>
        <p>Negar Pirasteh</p>
        <p className="mono">Montréal · 2026.</p>
        <TurnSheet label="End" />
      </footer>
    </>
  );
}
