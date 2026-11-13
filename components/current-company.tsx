import { currentEmployment } from "@/lib/content";
import { Folio, TurnSheet } from "./editorial";
import { RocketIllustration } from "./rocket-illustration";

export function CurrentCompany() {
  return (
    <article
      className="section current-company"
      data-boundary="spread"
      aria-labelledby="current-company-title"
    >
      <div className="spread-content current-company-content">
        <div className="job-heading current-company-heading">
          <p className="eyebrow current-company-dates">
            {currentEmployment.dates}
          </p>
          <h3 id="current-company-title" className="current-company-name">
            {currentEmployment.company}
          </h3>
          <p className="job-role">{currentEmployment.title}</p>
          <p className="current-company-team">{currentEmployment.team}</p>
        </div>
        <div className="current-company-art">
          <RocketIllustration />
        </div>
      </div>
      <TurnSheet label="Experience" />
      <Folio label="Experience · Present" page="02" />
    </article>
  );
}
