import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
import { experience } from "@/lib/content";

function RoleAnchor({ index }: { index: number }) {
  if (index === 0)
    return (
      <figure className="role-anchor runtime-anchor">
        <figcaption>Median GitHub Actions runtime</figcaption>
        <div className="runtime-values">
          <span>
            <small>Before</small>
            <strong>
              4.7<em>h</em>
            </strong>
          </span>
          <span className="runtime-arrow" aria-hidden="true">
            →
          </span>
          <span>
            <small>After</small>
            <strong>
              1.8<em>h</em>
            </strong>
          </span>
        </div>
        <span className="sr-only">
          Median runtime reduced by 62%, from 4.7 hours to 1.8 hours.
        </span>
        <div className="runtime-bars" aria-hidden="true">
          <span />
          <span />
        </div>
      </figure>
    );
  if (index === 1)
    return (
      <figure className="role-anchor coverage-anchor">
        <figcaption>Backend test coverage</figcaption>
        <div className="runtime-values">
          <span>
            <small>Before</small>
            <strong>
              24<em>%</em>
            </strong>
          </span>
          <span className="runtime-arrow" aria-hidden="true">
            →
          </span>
          <span>
            <small>After</small>
            <strong>
              72<em>%</em>
            </strong>
          </span>
        </div>
        <div className="coverage-bars" aria-hidden="true">
          <span />
          <span />
        </div>
      </figure>
    );
  return (
    <figure className="role-anchor response-anchor">
      <figcaption>API response times</figcaption>
      <div className="runtime-values">
        <span>
          <strong>
            35<em>%</em>
          </strong>
          <small>Faster API responses</small>
        </span>
      </div>
      <p>Through query and endpoint optimization.</p>
    </figure>
  );
}
export function Experience() {
  return (
    <section id="experience" aria-label="Experience">
      <RunningHead number="II" name="Experience" />
      <Divider
        id="experience"
        number="II"
        title="Experience"
        note="02 / Work history"
      />
      <div className="experience-spreads">
        {experience.map((job, i) => (
          <article
            className={`experience-row section role-${i}`}
            data-boundary="spread"
            key={job.company}
          >
            <div className="spread-content">
              <div className="job-heading">
                <p className="eyebrow">{job.dates}</p>
                <h3>{job.company}</h3>
                <p className="job-role">{job.title}</p>
                <ul
                  className="stack-chips"
                  aria-label={`${job.company} technologies`}
                >
                  {job.technologies.map(([name, icon]) => (
                    <li key={name}>
                      <img
                        src={`/icons/${icon}.svg`}
                        alt=""
                        width="24"
                        height="24"
                        loading="eager"
                      />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
                <RoleAnchor index={i} />
              </div>
              <div className="job-detail">
                {job.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <TurnSheet label="Experience" />
            <Folio label="Experience" page={`0${i + 2}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
