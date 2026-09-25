import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
import { projects } from "@/lib/content";

export function SelectedWork({ stars }: { stars: number | null }) {
  return (
    <section id="work" aria-label="Projects">
      <RunningHead number="II" name="Projects" />
      <Divider
        id="work"
        number="II"
        title="Projects"
        note="03 / Three selected projects"
      />
      <div className="work-spreads">
        {projects.map((project, i) => (
          <article
            className={`project-spread section${i === 0 ? " flagship" : ""}`}
            data-boundary="spread"
            aria-labelledby={`${project.id}-title`}
            key={project.id}
          >
            <div className="spread-content">
              <div className="project-copy">
                <h3 id={`${project.id}-title`}>{project.name}</h3>
                <p className="eyebrow">{project.category}</p>
                {project.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <dl className="project-tech mono">
                  <dt>Tech</dt>
                  <dd>{project.stack}</dd>
                </dl>
                <div className="project-links">
                  {project.live && (
                    <a
                      className="text-link"
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.name} live (opens in a new tab)`}
                    >
                      View Live <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  <a
                    className="text-link"
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} on GitHub (opens in a new tab)`}
                  >
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              <div className="project-evidence">
                {project.visual === "community" && (
                  <aside
                    className="project-note community-note"
                    aria-label="Community response"
                  >
                    <div className="project-impact">
                      {stars === null ? (
                        <p className="project-proof fallback-proof">
                          Open source
                          <br />
                          on GitHub
                        </p>
                      ) : (
                        <p className="project-proof">
                          {stars.toLocaleString("en-CA")}
                          <span className="mono">GitHub stars</span>
                        </p>
                      )}
                      <p className="project-proof">
                        197K+
                        <span className="mono">
                          views in the past 12 months
                        </span>
                      </p>
                    </div>
                    <p className="project-discovery">
                      <strong>Top Google result</strong> for “Canadian tech
                      internships”
                    </p>
                  </aside>
                )}
                <figure>
                  <a
                    className="project-image"
                    href={project.live || project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Explore ${project.name} (opens in a new tab)`}
                  >
                    <img
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      loading="lazy"
                    />
                  </a>
                  <figcaption className="mono">
                    {project.image.caption}
                  </figcaption>
                </figure>
                {project.visual === "community" && (
                  <p className="mono project-maintenance">
                    <strong>2026 → 2027</strong> · Actively maintained across
                    recruiting cycles
                  </p>
                )}
              </div>
            </div>
            <TurnSheet label="Projects" />
            <Folio label="Projects" page={`0${i + 5}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
