# The Book — Negar Pirasteh

A server-rendered, single-page developer portfolio composed as a continuous physical book. It uses Next.js App Router, React, TypeScript, and Tailwind CSS. JavaScript progressively enhances the native document with reversible, scroll-scrubbed page turns; the full portfolio remains readable without JavaScript and with reduced motion.

Active development is on `makeover`. Do not merge it into `main` unless explicitly requested.

## Context that stays useful

Project knowledge is split by purpose so future work loads only what it needs:

| Need                                                      | Read                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| Agent entrypoint and routing                              | [`AGENTS.md`](AGENTS.md)                                     |
| Verified career facts and public-copy boundaries          | [`docs/context/CAREER.md`](docs/context/CAREER.md)           |
| Current visual and interaction contract                   | [`docs/context/BOOK.md`](docs/context/BOOK.md)               |
| Source ownership, runtime, and verification               | [`docs/context/ENGINEERING.md`](docs/context/ENGINEERING.md) |
| Scope and limits of existing browser/performance evidence | [`docs/context/VALIDATION.md`](docs/context/VALIDATION.md)   |
| Copy-paste prompts for career and portfolio updates       | [`docs/UPDATE_PLAYBOOK.md`](docs/UPDATE_PLAYBOOK.md)         |
| Accepted, rejected, and superseded directions             | [`DECISIONS.md`](DECISIONS.md)                               |

Current truth belongs in the focused context files. `DECISIONS.md` is a historical ledger and should only be loaded when rationale matters.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production preview:

```sh
npm run build
npm start
```

## Verification

```sh
npm run typecheck
npm run build
npm test
```

Playwright expects a running server at `http://localhost:3000`, overridable with `BOOK_TEST_BASE_URL`, and an installed Chromium browser (`npx playwright install chromium`). Generated reports and screenshots live in ignored paths.

## Deploy on Vercel

Import the repository, select the Next.js framework preset, and use the repository root. Keep the normal server build so hourly ISR can refresh the public GitHub star count; do not use `output: "export"` or the legacy GitHub Pages workflow.

The approved public email is stored in `lib/content.ts`; contact links need no environment configuration. Résumé links are intentionally omitted. Never commit secrets or invent a contact value.

## Content maintenance

For a new role, metric, project, skill, education item, or contact change, use a prompt from [`docs/UPDATE_PLAYBOOK.md`](docs/UPDATE_PLAYBOOK.md). The workflow updates public content, canonical career context, and affected tests together while keeping private or unreleased details out of the site.

Private drafts and generated context exports belong in `.context-local/`, `*.context.local.md`, or `docs/context/generated/`; these paths are ignored. The authoritative files under `docs/context/` stay tracked so the context survives clones and career-long updates.

## Architecture at a glance

- `app/page.tsx`: book order, cover, and introduction.
- `lib/content.ts`: structured experience, projects, skills, index entries, and public profile links.
- `components/`: chapter, cover, index, and progressive-motion components.
- `lib/book-effects.ts`: shared leaf geometry and motion constants.
- `lib/github.ts`: server-side GitHub star lookup with hourly ISR, five-second timeout, and `null` fallback.
- `app/*.css`: base tokens, paper mechanics, chapter identity, and final cover refinements.
- `public/`: local fonts, SVG brand marks, screenshots, and licenses.

See [`docs/context/ENGINEERING.md`](docs/context/ENGINEERING.md) for exact ownership and the verification matrix.

## Assets and attribution

DM Serif Display, Manrope, and Orbitron 400 are locally hosted under the SIL Open Font License. Technical labels use the system monospace font.

Skill marks come from Devicon (MIT, including MongoDB and Pytest) and Simple Icons (CC0; Zod and the retained Stripe asset), with supplied AWS artwork retained. New marks are sourced from `devicons/devicon` (`icons/mongodb/mongodb-original.svg`, `icons/pytest/pytest-original.svg`) and `simple-icons/simple-icons` (`icons/zod.svg`). Brand marks belong to their respective owners. License texts are in `public/licenses/`.

Project images originated in the supplied portfolio. `scripts/capture-repo.cjs` intentionally refreshes the Canadian Tech Internships repository screenshot; the displayed star count is fetched separately through ISR.
