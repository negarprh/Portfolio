import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
import { projects } from "@/lib/content";
import { RepositoryFigure } from "./engineering-figures";
import { ChapterIllustration } from "./chapter-illustration";

export function SelectedWork({ stars }: { stars: number | null }) {
  return (
    <section id="work" aria-label="Projects">
      <RunningHead number="IV" name="Projects" />
      <Divider
        id="work"
        number="IV"
        title="Projects"
        note="04 / Three selected projects"
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
              <header className="project-heading">
                <h3 id={`${project.id}-title`}>{project.name}</h3>
              </header>
              <div className="project-evidence">
                <figure>
                  <div className="project-image">
                    <img
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      loading="lazy"
                    />
                  </div>
                  {project.id === "evenly" && (
                    <figcaption>{project.image.caption}</figcaption>
                  )}
                </figure>
                {project.visual === "community" && (
                  <p className="project-proof community-note">
                    {stars === null ? (
                      "Open source on GitHub"
                    ) : (
                      <>
                        <strong>{stars.toLocaleString("en-CA")}</strong> GitHub
                        stars
                      </>
                    )}
                    <span aria-hidden="true"> · </span>
                    <span>
                      <strong>197K+</strong> views in the past 12 months
                    </span>
                  </p>
                )}
                {project.visual === "community" && <RepositoryFigure />}
              </div>
              <div className="project-copy">
                {project.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <dl className="project-tech mono">
                <dt className="sr-only">Technologies</dt>
                <dd>
                  {project.stack}
                  {i === 0 && <ChapterIllustration chapter="work" />}
                </dd>
              </dl>
              <div
                className="project-links"
                role="group"
                aria-label={`${project.name} links`}
              >
                {project.live && (
                  <a
                    className="text-link"
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} live (opens in a new tab)`}
                  >
                    Visit live site
                  </a>
                )}
                <a
                  className="text-link"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} on GitHub (opens in a new tab)`}
                >
                  View on GitHub
                </a>
              </div>
            </div>
            <TurnSheet label="Projects" />
            <Folio label="Projects" page={`0${i + 7}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
