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
        NEGAR PIRASTEH — SELECTED WORK & EXPERIENCE — 2025–2026
      </div>
      <span className="cover-seal closing-seal" aria-hidden="true">
        <span className="seal-monogram">NP</span>
      </span>
      <div className="colophon">
        <p className="eyebrow">End of volume one</p>
        <h2 id="contact-title">That’s all for now.</h2>
        <p className="colophon-note">
          I’m currently looking for my next software engineering opportunity.
        </p>
        <p className="colophon-name">Negar Pirasteh</p>
        <ContactLinks />
      </div>
      <p className="colophon-device mono">Montréal · 2026</p>
      <TurnSheet label="End" />
    </footer>
  );
}
