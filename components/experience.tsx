import { Divider, Folio, RunningHead } from "./editorial";
import { experience } from "@/lib/content";

function RoleAnchor({ index }: { index: number }) {
  if (index === 0)
    return (
      <figure className="role-anchor runtime-anchor">
        <figcaption>Workday processing time</figcaption>
        <div className="runtime-values">
          <span>
            <small>Before · about</small>
            <strong>
              6<em>h</em>
            </strong>
          </span>
          <span className="runtime-arrow" aria-hidden="true">
            →
          </span>
          <span>
            <small>After · roughly</small>
            <strong>
              1<em>h</em>45<em>m</em>
            </strong>
          </span>
        </div>
        <span className="sr-only">
          Reduced from about 6 hours to roughly 1 hour 45 minutes.
        </span>
        <div className="runtime-bars" aria-hidden="true">
          <span />
          <span />
        </div>
      </figure>
    );
  if (index === 1)
    return (
      <figure className="role-anchor backend-anchor">
        <figcaption>End-to-end backend features</figcaption>
        <svg
          viewBox="0 0 360 92"
          role="img"
          aria-label="Application logic, data interactions, and tests"
        >
          <path d="M54 32H306" />
          <circle cx="54" cy="32" r="18" />
          <rect x="162" y="14" width="36" height="36" rx="2" />
          <circle cx="306" cy="32" r="18" />
          <path className="diagram-tick" d="m298 32 6 6 11-13" />
          <text x="54" y="78">
            Logic
          </text>
          <text x="180" y="78">
            Data
          </text>
          <text x="306" y="78">
            Tests
          </text>
        </svg>
        <p>TypeScript & NestJS</p>
      </figure>
    );
  return (
    <figure className="role-anchor auth-anchor">
      <svg viewBox="0 0 84 96" role="img" aria-label="Authentication">
        <path d="M42 7 72 19v26c0 22-30 40-30 40S12 67 12 45V19Z" />
        <rect x="29" y="39" width="26" height="22" rx="2" />
        <path d="M34 39v-8a8 8 0 0 1 16 0v8M42 47v6" />
      </svg>
      <div>
        <figcaption>
          Authentication
          <br />
          with Supabase
        </figcaption>
        <p>
          Alongside REST APIs
          <br />
          and React components.
        </p>
      </div>
    </figure>
  );
}
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
          <article
            className={`experience-row section role-${i}`}
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
                        loading="lazy"
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
            <Folio label="Experience" page={`0${i + 2}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
