import { Divider, Folio, RunningHead } from "./editorial";
import { projects, profile } from "@/lib/content";
export function SelectedWork({ stars }: { stars: number | null }) {
  return (
    <section id="work" aria-label="Selected Work">
      <RunningHead number="II" name="Selected work" />
      <Divider
        id="work"
        number="II"
        title="Selected work"
        note="03 / Projects"
      />
      <div className="work-spreads">
        <article className="flagship section">
          <div className="spread-content">
            <div className="project-copy">
              <p className="eyebrow">Open source · 2027</p>
              <h3>
                Canadian Tech
                <br />
                Internships
              </h3>
              <p>
                I started and maintain this repository to help students find
                tech internships in Canada.
              </p>
              <p>
                GitHub Actions workflows check submissions and keep the listings
                updated.
              </p>
              <p className="star-count mono">
                ☆{" "}
                {stars === null
                  ? "Open source on GitHub"
                  : `${stars.toLocaleString("en-CA")} GitHub stars`}
              </p>
              <a
                className="text-link"
                href={`${profile.github}/Canadian-Tech-Internships-2027`}
              >
                View repository <span aria-hidden="true">↗</span>
              </a>
            </div>
            <figure>
              <a
                className="project-image repo-image"
                href={`${profile.github}/Canadian-Tech-Internships-2027`}
                aria-label="Explore Canadian Tech Internships 2027 on GitHub"
              >
                <img
                  src="/images/internships-2027.png"
                  width="1440"
                  height="1000"
                  alt="Canadian Tech Internships 2027 repository and README on GitHub"
                  loading="lazy"
                />
              </a>
              <figcaption className="mono">
                Canadian Tech Internships · GitHub
              </figcaption>
            </figure>
          </div>
          <Folio label="Selected work" page="05" />
        </article>
        {projects.map((project, i) => (
          <article className="project-spread section" key={project.name}>
            <div className="spread-content">
              <div className="project-copy">
                <p className="eyebrow">{project.category}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p className="mono stack">{project.stack}</p>
                <a
                  className="text-link"
                  href={`${profile.github}/${project.repo}`}
                >
                  View project <span aria-hidden="true">↗</span>
                </a>
              </div>
              <figure>
                <a
                  className="project-image"
                  href={`${profile.github}/${project.repo}`}
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <img
                    src={`/images/${project.image}`}
                    alt={project.alt}
                    width={project.width}
                    height={project.height}
                    loading="lazy"
                  />
                </a>
                <figcaption className="mono">
                  {project.name} · Application screenshot
                </figcaption>
              </figure>
            </div>
            <Folio label="Selected work" page={`0${i + 6}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
