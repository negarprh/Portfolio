import { currentEmployment } from "@/lib/content";
import { Folio, TurnSheet } from "./editorial";

export function CurrentCompany() {
  return (
    <article
      className="section current-company"
      data-boundary="spread"
      aria-labelledby="current-company-title"
    >
      <div className="spread-content current-company-content">
        <div className="current-company-heading">
          <div className="current-company-rule" aria-hidden="true" />
          <h3 id="current-company-title">{currentEmployment.title}</h3>
        </div>
        <div className="current-company-identity">
          <div className="current-company-imprint">
            <p className="current-company-name">{currentEmployment.company}</p>
            <div className="current-company-imprint-rule" aria-hidden="true" />
            <p className="current-company-dates mono">
              {currentEmployment.dates}
            </p>
          </div>
        </div>
      </div>
      <TurnSheet label="Experience" />
      <Folio label="Experience · Present" page="02" />
    </article>
  );
}
