import { ContactLinks, TurnSheet } from "./editorial";
export function Closing() {
  return (
    <footer
      id="contact"
      className="back-cover"
      data-boundary="contact"
      aria-labelledby="contact-title"
    >
      <div className="cover-spine mono" aria-hidden="true">
        NEGAR PIRASTEH - SELECTED WORK & EXPERIENCE
      </div>
      <span className="cover-seal closing-seal" aria-hidden="true">
        <span className="seal-monogram">NP</span>
      </span>
      <div className="colophon">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">Let’s talk.</h2>
        <p className="colophon-note">
          I’m currently open to software
          <br />
          development opportunities.
        </p>
        <ContactLinks />
      </div>
      <p className="colophon-device mono">Montréal · 2026</p>
      <TurnSheet label="End" />
    </footer>
  );
}
