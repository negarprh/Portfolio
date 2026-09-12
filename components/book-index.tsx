import { chapters } from "@/lib/content";
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
          {chapters.map(([id, label], i) => (
            <li key={id}>
              <a href={`#${id}`}>
                <span className="mono">0{i + 1}</span>
                {label}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="mono index-foot">NEGAR PIRASTEH · VOL. 01</p>
      </nav>
    </details>
  );
}
