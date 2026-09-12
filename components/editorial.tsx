import { profile } from "@/lib/content";
export function ContactLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "links" : "links closing-links"}>
      {profile.email && (
        <a href={`mailto:${profile.email}`}>
          Email <span aria-hidden="true">↗</span>
        </a>
      )}
      {!compact && !profile.email && (
        <span className="pending-link">
          Email <small>coming soon</small>
        </span>
      )}
      {!compact && (
        <a href={profile.linkedin}>
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
      )}
      <a href={profile.github}>
        GitHub <span aria-hidden="true">↗</span>
      </a>
      {profile.resume && (
        <a href={profile.resume}>
          Resume <span aria-hidden="true">↗</span>
        </a>
      )}
      {!profile.resume && (
        <span
          className="pending-link"
          title="A current public resume will be added soon"
        >
          Resume <small>coming soon</small>
        </span>
      )}
      {compact && (
        <a href="#contact">
          Contact <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}

export function Folio({
  label,
  page,
}: {
  label: React.ReactNode;
  page: string;
}) {
  const verso = Number(page) * 2;
  return (
    <div className="folio mono">
      <span className="folio-verso" aria-hidden="true">
        {String(verso).padStart(2, "0")}
      </span>
      <span className="folio-label">{label}</span>
      <span className="folio-number">
        <span className="folio-flat">{page}</span>
        <span className="folio-recto" aria-hidden="true">
          {String(verso + 1).padStart(2, "0")}
        </span>
      </span>
    </div>
  );
}
export function RunningHead({
  number,
  name,
}: {
  number: string;
  name: string;
}) {
  return (
    <div className="chapter-running">
      <div className="chapter-running-label">
        <span>{number}</span>
        <span>{name}</span>
      </div>
    </div>
  );
}
export function TurnSheet({ label }: { label: string }) {
  return (
    <>
      <div className="turn-shadow" aria-hidden="true" />
      <div className="turn-sheet" aria-hidden="true" inert>
        <div className="sheet-front">
          <span>Negar Pirasteh</span>
          <div className="sheet-outgoing" data-outgoing />
          <span>{label}</span>
        </div>
        <div className="sheet-back">
          <span>Selected work & experience</span>
          <span className="chapter-back-numeral">{label}</span>
        </div>
      </div>
    </>
  );
}
export function Divider({
  id,
  number,
  title,
  note,
}: {
  id: string;
  number: string;
  title: string;
  note: string;
}) {
  return (
    <div className="chapter-opening">
      <header className="divider" data-boundary={id}>
        <span className="chapter-display-numeral" aria-hidden="true">
          {number}
        </span>
        <div className="divider-top mono">
          <span>Negar Pirasteh</span>
          <span>Selected work & experience</span>
        </div>
        <div className="divider-title">
          <p className="eyebrow">Chapter {number}</p>
          <h2>{title}</h2>
          <span className="chapter-rule" aria-hidden="true" />
        </div>
        <p className="divider-note mono">{note}</p>
        <TurnSheet label={number} />
      </header>
    </div>
  );
}
