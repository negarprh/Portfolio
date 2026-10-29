import { chapters } from "@/lib/content";
function IndexArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

export function BookIndex() {
  return (
    <details className="book-index" id="book-index">
      <summary aria-label="Open chapter index">
        <span className="index-symbol" aria-hidden="true">
          ☰
        </span>
        <span>Index</span>
      </summary>
      <nav aria-label="Chapter index">
        <div className="eyebrow">Negar Pirasteh</div>
        <h2>Contents</h2>
        <ol>
          <li>
            <a href="#top">
              <span className="mono">00</span>
              Home
              <IndexArrow />
            </a>
          </li>
          {chapters.map(([id, label], i) => (
            <li key={id}>
              <a href={`#${id}`}>
                <span className="mono">0{i + 1}</span>
                {label}
                <IndexArrow />
              </a>
            </li>
          ))}
        </ol>
        <p className="mono index-foot">NEGAR PIRASTEH · VOL. 01</p>
      </nav>
    </details>
  );
}
