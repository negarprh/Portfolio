# Career source of truth

Last reconciled: 2026-09-24. This file stores public, durable career facts for portfolio copy. `lib/content.ts` and the page components are the rendered implementation; update this file and the implementation together.

## Evidence and writing rules

Use evidence in this order:

1. New facts explicitly supplied by Negar.
2. A resume, LinkedIn export, job record, or project source Negar identifies as current.
3. Existing verified facts in this file and the working implementation.
4. Public repository metadata for repository-specific facts only.

Do not infer dates, seniority, degree equivalence, business impact, ownership, team size, production scale, or proficiency. Keep first-person copy plain and specific. Prefer “built,” “implemented,” or “maintained” plus concrete scope over generic claims such as “passionate,” “expert,” or “results-driven.” When two sources conflict, keep the last verified public value and list the conflict for Negar instead of silently choosing.

## Positioning

- Name: Negar Pirasteh.
- Location: Montréal, Québec, Canada.
- Public role label: Software Developer.
- Introduction ROLE label: Backend / Full-Stack Developer (approved 2026-09-24); the cover keeps Software Developer.
- Introduction CORE STACK: TypeScript · Node.js · NestJS · Python · FastAPI; PostgreSQL · React / Next.js · Docker.
- Focus: backend software development.
- Core backend stacks: TypeScript with NestJS; Python with FastAPI.
- Additional verified experience: Node.js, Express, Java/Spring Boot, Prisma/PostgreSQL, SQLAlchemy, Redis, Docker, cloud/tooling, and React/frontend contributions as needed.
- Do not describe Negar as Python-only or imply TypeScript was only frontend work.
- Current public status: open to software engineering opportunities.

## Introduction facts

- Computer Science graduate from LaSalle College.
- Work includes healthcare platforms, job-collection pipelines, and React contributions.
- Started and maintains the Canadian Tech Internships repository.
- Approved personal detail: cat person; omitted from the current introduction at Negar’s request to use her original copy.
- Current introduction uses Negar’s supplied four-paragraph wording: building products from the ground up, ownership, persistent improvement, whole-system understanding, backend/frontend contributions, and seeking a strong engineering team and interesting problems. This supersedes the longer assistant rewrite. Education and stack details remain elsewhere in the portfolio.
- User-supplied public claim in that approved copy (2026-09-24): her open-source project grew from a personal idea into a resource used by thousands of people across Canada. This is Negar’s supplied usage claim, not a figure inferred from GitHub stars or independently measured here.

## Experience

### Tail’ed — Software Developer Intern

- Dates: Summer 2026.
- Built Python ingestion across 3,680 company sources and nine ATS platforms.
- Named ATS examples: Workday, Greenhouse, Lever, Ashby, iCIMS, and Oracle HCM.
- Work included discovery, classification, normalization, deduplication, and archival.
- Supported 11,700+ active listings across 1,300+ companies.
- Expanded active coverage to 4.4× the prior level.
- Added multithreaded concurrency that reduced median GitHub Actions runtime by 62%, from 4.7 hours to 1.8 hours.
- Connected aggregated data to website search and filtering.
- Public technology emphasis: Python, Express, GitHub Actions, React, Firebase. Negar explicitly confirmed Express for the system backend on 2026-09-24.
- The median 4.7h → 1.8h figure supersedes the older Workday-only 6h → 1h45m figure.

### Lienzo — Backend Developer

- Dates: Dec 8, 2025 — Mar 31, 2026.
- Built backend features for healthcare coordination with TypeScript, Node.js, NestJS, PostgreSQL, and Prisma.
- Worked across data models, APIs, business logic, automated tests, and Angular integration.
- Implemented recurring to-dos with daily, weekly, biweekly, and monthly schedules.
- Supported updating one occurrence or an entire recurring series.
- CQRS command/query testing increased backend coverage from 24% to 72%.
- Maintained and improved 20+ services and APIs involving authentication, RBAC, soft deletes, and core backend behavior.
- Worked with trunk-based development, CI/CD, pull requests, reviews, and daily stand-ups.
- Keep the portfolio emphasis on backend work.
- Displayed role stack: TypeScript, Node.js, NestJS, Prisma, PostgreSQL, Angular, Vitest. Negar explicitly confirmed Angular and Vitest for Lienzo on 2026-09-24; this supersedes the earlier uncertainty about the testing framework.

### Ozex — Software Developer Intern

- Dates: Feb — May 2025.
- Built backend functionality for a mental-health platform with TypeScript, Express, PostgreSQL, and Prisma.
- Developed REST APIs and application logic.
- Query and endpoint optimization reduced API response times by 35%.
- Implemented Supabase/JWT authentication and authorization.
- Worked on validation, error handling, database operations, API integration, and Swagger documentation.
- Public technology emphasis: TypeScript, Express, PostgreSQL, Prisma, Supabase, Swagger.
- React and Docker experience from this role is not retracted, but is not the current portfolio emphasis.

## Selected work

### Canadian Tech Internships 2027

- Repository: `negarprh/Canadian-Tech-Internships-2027`.
- Negar started and maintains it to help students find Canadian technology internships.
- GitHub Actions workflows check submissions and maintain listings.
- Stars must come from the public GitHub API through server rendering/hourly ISR. Never hardcode a star count. On API failure, use the non-numeric fallback “Open source on GitHub.”

### AirSense

- Built for NASA Space Apps Challenge 2025.
- Combines external air-quality APIs with a Spring Boot backend and caching for four-day forecasts.
- Public stack: Java, Spring Boot, React, Caffeine, AWS, Docker.
- Repository slug: `AirSense`.

### WealthWise

- Personal finance tracker bringing income, expenses, investments, market data, and portfolio charts together.
- Public stack: Python, Flask, SQLite, Pandas, Matplotlib.
- Repository slug: `Financial-Tracker`.

### InvestGuard

- Spring Boot application that calculates portfolio risk from stock inputs.
- Negar built the financial calculations and the input/review interface.
- Public stack: Java 17, Spring Boot, Maven, H2, JavaScript.
- Repository slug: `InvestGuard`.

## Education

- LaSalle College, Montréal.
- DEC (DCS) in Computer Science.
- Do not recast this credential as a bachelor’s degree.
- Study dates are not currently verified for public display.

## Public skills taxonomy

- Backend & Data: TypeScript, Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Java, Spring Boot, Node.js, NestJS, Prisma, Flask.
- Frontend: React, Next.js, Tailwind CSS, JavaScript, HTML, CSS.
- Infra & Cloud: Docker, AWS, GitHub Actions, Supabase, Firebase, Azure DevOps.
- Tools: Git, GitHub, Postman, Swagger, Stripe, Vitest.

This is a display taxonomy, not a proficiency ranking. Adding a skill requires an explicit user-provided fact or evidence from current work; do not scrape dependency files and present every package as a career skill.

## Private or incomplete information

- “Currently Building” may only say that it is a platform for the audience around the Canadian tech internships repository and that it is launching soon. Do not reveal product, architecture, implementation, or unreleased features without explicit approval.
- GitHub: `https://github.com/negarprh`.
- LinkedIn: `https://www.linkedin.com/in/negar-pirasteh/`.
- Show LinkedIn in the introduction contact links; omit the introduction’s unset-resume placeholder.
- Email comes from `NEXT_PUBLIC_CONTACT_EMAIL`.
- Resume comes from `NEXT_PUBLIC_RESUME_URL`.
- When email or resume is unset, keep the non-clickable “coming soon” behavior. Do not invent a value or claim a confirmed public resume exists.

## Fact-update checklist

When a career fact changes:

1. Label it verified, superseded, private, or still unverified.
2. Search for every old value or phrase across code, tests, metadata, and documentation.
3. Update the canonical entry here and the rendered source together.
4. Keep older numbers only when the history matters, clearly marked as superseded.
5. Check dates, units, denominators, typography, links, image alt text, and technology chips.
6. State exactly which supplied facts were used and which details remain unpublished or unresolved.
