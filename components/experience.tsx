import { Divider, Folio, RunningHead } from "./editorial";
import { experience } from "@/lib/content";
export function Experience() {
  return (
    <section id="experience" aria-label="Experience">
      <RunningHead number="I" name="Experience" />
      <Divider
        id="experience"
        number="I"
        title="Experience"
        note="02 / Work history"
      />
      <div className="experience-spreads">
        {experience.map((job, i) => (
          <article className="experience-row section" key={job.company}>
            <div className="spread-content">
              <div className="job-heading">
                <p className="eyebrow">{job.dates}</p>
                <h3>{job.company}</h3>
                <p className="job-role">{job.title}</p>
                <p className="mono stack">{job.stack}</p>
              </div>
              <div className="job-detail">
                {job.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <Folio label="Experience" page={`0${i + 2}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
