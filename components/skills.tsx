import { Divider, Folio, RunningHead, TurnSheet } from "./editorial";
import { skills } from "@/lib/content";
function SkillItem({ label, icon }: { label: string; icon: string }) {
  return (
    <li>
      <span className="skill-mark" aria-hidden="true">
        <img
          src={`/icons/${icon}.svg`}
          data-icon={icon}
          alt=""
          width="32"
          height="32"
          loading="lazy"
        />
      </span>
      <span>{label}</span>
    </li>
  );
}

function SkillGroup({ index }: { index: number }) {
  const group = skills[index];
  return (
    <div className="skill-group">
      <h3 id={`skill-category-${index}`}>
        <span className="mono">0{index + 1}</span>
        {group.label}
      </h3>
      <ul aria-labelledby={`skill-category-${index}`}>
        {group.items.map(([label, icon]) => (
          <SkillItem key={label} label={label} icon={icon} />
        ))}
      </ul>
    </div>
  );
}
export function Skills() {
  return (
    <section id="skills" aria-label="Skills">
      <svg
        className="skills-icon-filter"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="skills-icon-ink" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              {/* Compress logo tones into muted ink while retaining internal detail. */}
              <feFuncR type="gamma" amplitude=".46" exponent="2" offset=".28" />
              <feFuncG type="gamma" amplitude=".46" exponent="2" offset=".28" />
              <feFuncB type="gamma" amplitude=".46" exponent="2" offset=".28" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <RunningHead number="III" name="Skills" />
      <Divider id="skills" number="III" title="Skills" note="03 / Skills" />
      <div className="section skills-spread" data-boundary="spread">
        <div className="spread-content skills-content">
          <div className="skills-page">
            <p className="skills-intro">
              I work primarily across backend and full-stack development.
            </p>
            <SkillGroup index={0} />
          </div>
          <div className="skills-page">
            <SkillGroup index={2} />
          </div>
        </div>
        <TurnSheet label="Skills" />
        <Folio label="Skills" page="05" />
      </div>
      <div className="section skills-spread" data-boundary="spread">
        <div className="spread-content skills-content">
          <div className="skills-page">
            <SkillGroup index={1} />
            <SkillGroup index={4} />
          </div>
          <div className="skills-page">
            <SkillGroup index={3} />
          </div>
        </div>
        <TurnSheet label="Skills" />
        <Folio label="Skills" page="06" />
      </div>
    </section>
  );
}
