/** Supplemental print figures. The original HTML metrics remain authoritative. */
export function RuntimeFigure() {
  const x = (hours: number) => 56 + (hours / 5) * 224;
  return (
    <svg
      className="engineering-figure runtime-figure"
      viewBox="0 0 300 112"
      aria-hidden="true"
      focusable="false"
    >
      <g className="figure-guides">
        {[0, 1, 2, 3, 4, 5].map((hour) => (
          <path key={hour} d={`M${x(hour)} 24v54`} />
        ))}
      </g>
      <g className="figure-labels">
        <text x="0" y="39">
          Before
        </text>
        <text x="0" y="69">
          After
        </text>
        {[0, 1, 2, 3, 4, 5].map((hour) => (
          <text key={hour} x={x(hour)} y="15" textAnchor="middle">
            {hour}h
          </text>
        ))}
        <text x="56" y="103">
          Multithreaded concurrency · −62%
        </text>
      </g>
      <path className="figure-baseline" d={`M56 35H${x(4.7)}`} />
      <circle className="figure-before" cx={x(4.7)} cy="35" r="4" />
      <path className="figure-result" d={`M56 65H${x(1.8)}`} />
      <circle className="figure-after" cx={x(1.8)} cy="65" r="4" />
    </svg>
  );
}

export function CoverageFigure() {
  return (
    <svg
      className="engineering-figure coverage-figure"
      viewBox="0 0 300 112"
      aria-hidden="true"
      focusable="false"
    >
      {[24, 72].map((coverage, group) => (
        <g key={coverage} transform={`translate(${group * 150}, 0)`}>
          {Array.from({ length: 100 }, (_, i) => (
            <circle
              key={i}
              cx={4 + (i % 10) * 9}
              cy={4 + Math.floor(i / 10) * 9}
              r="2.4"
              className={i < coverage ? "coverage-tested" : "coverage-untested"}
            />
          ))}
        </g>
      ))}
      <text className="figure-labels" x="0" y="108">
        1 dot = 1% · CQRS commands &amp; queries
      </text>
    </svg>
  );
}

export function RepositoryFigure() {
  return (
    <div className="repository-figure" aria-hidden="true">
      <span className="repository-caption">Repository automation</span>
      <div className="repository-root mono">GitHub Actions</div>
      <svg viewBox="0 0 300 22" preserveAspectRatio="none" focusable="false">
        <path d="M150 0v10M50 22V10h200v12M150 10v12" />
      </svg>
      <div className="repository-branches">
        <span>
          Issue-to-PR
          <br />
          <small>Submissions</small>
        </span>
        <span>
          Table updates
          <br />
          <small>Listings</small>
        </span>
        <span>
          Python checks
          <br />
          <small>Closed links</small>
        </span>
      </div>
    </div>
  );
}

export function ResponseFigure() {
  return (
    <div className="response-comparison" aria-hidden="true">
      <div className="response-comparison-row">
        <span>Before</span>
        <span className="response-track">
          <i className="response-before" />
        </span>
        <span>100</span>
      </div>
      <div className="response-comparison-row">
        <span>After</span>
        <span className="response-track">
          <i className="response-after" />
        </span>
        <span>65</span>
      </div>
      <span className="response-scale">Relative time · before = 100</span>
    </div>
  );
}
