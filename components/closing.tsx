import { ContactLinks, TurnSheet } from "./editorial";
import { ChapterIllustration } from "./chapter-illustration";
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
        <h2 id="contact-title">Contact</h2>
        <ContactLinks />
      </div>
      <p className="colophon-device mono">Montréal · 2026</p>
      <ChapterIllustration chapter="contact" />
      <TurnSheet label="End" />
    </footer>
  );
}
