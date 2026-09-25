import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
import { skills } from "@/lib/content";
export function Skills() {
  return (
    <section id="skills" aria-label="Skills">
      <RunningHead number="V" name="Skills" />
      <Divider id="skills" number="V" title="Skills" note="06 / Skills" />
      <div className="section skills-spread" data-boundary="spread">
        <p className="skills-intro">
          TypeScript and Python are my main backend languages. Here are the
          tools I’ve worked with.
        </p>
        {skills.map((group, i) => (
          <div className="skill-group" key={group.label}>
            <h3>
              <span className="mono">0{i + 1}</span>
              {group.label}
            </h3>
            <ul>
              {group.items.map(([label, icon]) => (
                <li key={label}>
                  <img
                    src={`/icons/${icon}.svg`}
                    alt=""
                    width="34"
                    height="34"
                    loading="lazy"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <TurnSheet label="Skills" />
        <Folio label="Skills" page="10" />
      </div>
    </section>
  );
}
