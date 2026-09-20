<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Book: persistent project context

Verified against the working code on 2026-09-13, application commit `518b93f`. Read this file before changing the portfolio; consult [DECISIONS.md](DECISIONS.md) for accepted and rejected directions. Update these documents when an intentional decision changes; do not treat historical experiments as current requirements.

## Concept

The Book is a single-page developer portfolio for Negar Pirasteh, composed as a continuous physical book: front cover -> introduction -> experience -> selected work -> currently building -> education -> skills -> back cover. Scrolling opens the cover and turns leaves at chapter boundaries and reading spreads, with a visible spine, paper edges, running heads, and deliberate chapter dividers. The native bookmark/index provides direct navigation; its final "Contact" entry opens the back cover, not a separate contact slide.

## Branch workflow

**`makeover` is the active working branch.** Continue work there. Do not edit or commit directly on `main`, reset it, or merge into it until the user explicitly requests a merge. At this verification, `main` is `6411a204dc04143d590465d7dbc0f65e978799a3`; `makeover` contains the completed book and subsequent refinements. Check branch and working-tree state before edits and preserve existing user changes.

## Non-negotiable constraints

- No WebGL, canvas physics, or 3D engine. CSS perspective/rotateY is the existing leaf mechanism, not an engine.
- No continuous looping animation except the existing restrained gold accent-dot pulse (10-second CSS opacity cycle). The seal enters once after fonts and page assets load, then stays still.
- Animate only `transform`, `opacity`, or `clip-path`. Never animate `width`, `height`, `top`, `left`, or `box-shadow`. Static layout values and static material shadows are permitted; moving shadows use separate layers with transform/opacity.
- With JavaScript disabled, every chapter and the back-cover content must render in static document order, with native links and the `<details>` index functional. Do not make content client-only or dependent on animation completion.
- Fully support `prefers-reduced-motion`, including changes while the page is open. Page turns and entrances have immediately readable static final states; ordinary scrolling and navigation remain available.
- Scrolling is bidirectional. Reverse the same leaf rotation and shadow sweep when scrolling up, including opening/closing the covers. Fast reversals must settle at actual scroll position without queued or overlapping competing animations.
- No purple, no gradients, no glassmorphism, no drop-shadow cards, and no generic tech-icon-cube imagery.
- No cursor tracking or mousemove/pointermove-driven visual effects anywhere; this direction was ruled out for jank risk. Normal index click, pointerdown dismissal, and keyboard handlers are unrelated and remain functional.

**Existing-code discrepancy to preserve accurately:** the current material implementation uses static CSS linear/radial/repeating gradients for cloth, paper grain, binding, page edges, and cast-shadow layers. This predates the "no gradients" instruction above. Do not add new gradients or silently describe the current code as gradient-free. This context-only task does not authorize stripping the existing, explicitly retained material treatment; reconcile that tension within any future task that actually changes materials. Physical page/cover shading is not a drop-shadow card design.

## Visual system and sources

The implementation is Next.js App Router with React, TypeScript, and Tailwind CSS 4. Design tokens live in CSS, not a Tailwind color/font configuration. `app/layout.tsx` loads styles in this order: `globals.css`, `book-material.css`, `chapters.css`, `makeover.css`; later rules intentionally refine earlier ones. Check final overrides, not just the first matching selector.

Base tokens in `app/globals.css`:

| Token | Implemented value | Use |
| --- | --- | --- |
| `--ink` | `#24241f` | Dark olive-charcoal cover/ink |
| `--paper` | `#f2efe6` | Base ivory paper and cover lettering |
| `--accent` | `#b9a06a` | Muted amber/gold, seal and dot |
| `--line` | `#cecabd` | Interior rules |
| `--muted` | `#65655b` | Secondary interior copy |

Enhanced chapter palettes in `app/chapters.css` use `--chapter-paper`, `--chapter-ink`, `--chapter-fold`, and `--chapter-edge`. Paper/ink pairs are:

| Section | Paper | Ink |
| --- | --- | --- |
| Introduction | `#f4efe3` | `#7d6844` |
| Experience | `#f1ebdc` | `#7d6339` |
| Selected work | `#e5edf0` | `#456675` |
| Currently building | `#f0e2d5` | `#74502f` |
| Education | `#eeeddf` | `#615e3b` |
| Skills | `#e3eade` | `#53674a` |

The file also retains `#contact` paper/ink tokens (`#ede7d9` / `#75613c`), but the visible back cover uses the shared dark cloth override in `app/makeover.css`, not that paper surface.

Fonts are locally hosted; `@font-face` definitions are in `app/globals.css`. `scripts/fonts.cjs` identifies the original families; licenses are in `public/licenses/`.

| Actual family | CSS alias / stack | File |
| --- | --- | --- |
| DM Serif Display, regular 400 | `Editorial, Georgia, serif` | `public/fonts/editorial.woff2` |
| DM Serif Display, italic 400 | `Editorial, Georgia, serif` with italic style | `public/fonts/editorial-italic.woff2` |
| Manrope, 400 | `Body, Arial, sans-serif` | `public/fonts/body.woff2` |
| System technical labels | `"Courier New", monospace` | No font asset |

Interior folios also use `Georgia, serif`. Keep the huge name treatment: desktop `clamp(88px, 11.7vw, 190px)`, mobile `clamp(72px, 19vw, 132px)` in `app/globals.css`; centered composition and pressed title shadows are final overrides in `app/makeover.css`.

- Covers: identical dense woven cloth, dark ink base, embossed double edging, static letterpress shadows, and one centered NP crest. Front crest entrance lives in `components/cover-seal.tsx`; the back crest is static. Material and jacket layout live in `app/makeover.css` and apply in static fallbacks too.
- Interior: soft ivory/chapter-tinted paper, fine grain, center gutter, outer/spine edge shading, mirrored inner margins and folios, and accumulated fore-edge stacks. `app/book-material.css` implements these, with chapter tones/running heads in `app/chapters.css`. Enhanced interior materials are gated by `html[data-book-enhanced]`; static fallbacks retain flat readable sections.
- Icons: real local SVG brand marks in `public/icons/`, rendered with text labels. Sources/attributions are in `README.md` and `public/licenses/`. Reuse these assets for experience chips and skills.

## File/component map

| Area | Open these files |
| --- | --- |
| Page composition, front cover, introduction | `app/page.tsx` |
| Front seal entrance | `components/cover-seal.tsx` |
| Experience: Tail'ed, Lienzo, Ozex | `components/experience.tsx`; facts/stacks in `lib/content.ts` |
| Selected work and displayed star count | `components/selected-work.tsx`; other projects in `lib/content.ts` |
| Currently building | `components/currently-building.tsx` |
| Education | `components/education.tsx` |
| Skills | `components/skills.tsx`; category/icon mapping in `lib/content.ts` |
| Personal background (merged into introduction) | `app/page.tsx` |
| Back cover / `#contact` | `components/closing.tsx` |
| Shared dividers, running heads, folios, inert turn markup, contact links | `components/editorial.tsx` |
| Bookmark/index | `components/book-index.tsx`; entries in `lib/content.ts` |
| Scroll synchronization, cover rotation, stacks, motion preference and index enhancement | `components/book-motion.tsx` |
| Leaf keyframes, shadow sweep, sanitized inert outgoing copies | `lib/book-effects.ts` |
| Server-side GitHub API fetch | `lib/github.ts`, called by `app/page.tsx` |
| Base styles, paper mechanics, chapter identity, final cover/role refinements | `app/globals.css`, `app/book-material.css`, `app/chapters.css`, `app/makeover.css` |

`book-motion.tsx` maintains one paused animation set per boundary and sets its time from scroll position. `TURN_DURATION = 1800` is the keyframe timeline length, not a queued 1.8-second event on each crossing. Boundary travel is 85% of viewport height. Measure chapter-opening wrappers, not the pinned divider rectangle. Chapter dividers have 175svh wrappers on desktop / 150svh on mobile around 100svh title pages; preserve their reading beat. `.book-opening` overlaps the hinged cover and stationary introduction only when enhanced; `.opening-runway` and introduction scroll margins make native opening/bookmark links land correctly. Do not restore a once-seen observer or replace turns with fades/slides.

Legacy `index.html`, `head.html`, and `assets/` are reference material from the prior site, not the active Next.js page.

## Content facts

Use plain, specific first-person copy. Keep the introduction affirmative and factual; do not invent weaknesses, inflated outcomes, or generic AI-sounding claims.

- Negar Pirasteh is a backend-focused software developer in Montreal. **TypeScript with NestJS and Python with FastAPI are both core backend skills**, with React/frontend contributions as needed. Do not summarize her work as only Python or imply TypeScript was only frontend. Java/Spring Boot, Prisma/PostgreSQL, SQLAlchemy, Redis, Docker, and cloud/tool experience are also represented; the full verified skill list is in `lib/content.ts`.
- **Tail'ed** (rendered `Tail’ed` in `lib/content.ts`): Software Developer Intern, **Summer 2026**. Python automation aggregates internship/new-grad jobs from Workday, Lever, and Greenhouse; concurrency/pipeline changes reduced Workday runtime from **about 6 hours to roughly 1 hour 45 minutes**. Work includes normalization/deduplication, location handling, filtering, archiving, and integration with the React website. Stack: Python, GitHub Actions, React, Firebase. The runtime anchor lives in `components/experience.tsx`, not the content array.
- **Lienzo**: Backend Developer, **Dec 8, 2025 - Mar 31, 2026**; the user confirmed the end date has not changed. End-to-end TypeScript/NestJS backend features for healthcare coordination; application logic, database interactions, and tests in a CQRS codebase using Prisma, PostgreSQL, Vitest, and Node.js. Preserve the backend emphasis even when mentioning frontend contributions; do not invent an unverified percentage or metric.
- **Ozex**: Software Developer Intern, **Feb - May 2025**. TypeScript REST APIs and React components for a mental health platform; Supabase authentication and PostgreSQL/Prisma database queries. The implemented role chips are TypeScript, React, Express, PostgreSQL, Docker, Supabase.
- Flagship repository: **`negarprh/Canadian-Tech-Internships-2027`**. Stars must come from the public GitHub API, never a hardcoded number. Current implementation uses hourly ISR (`revalidate: 3600`, also on `app/page.tsx`), a 5-second fetch timeout, and `null` on failure; the UI then says "Open source on GitHub" instead of inventing a count. This is cached live API data, not per-visitor realtime polling. Preserve server rendering/ISR; do not convert to static export.
- Education: **LaSalle College, DEC (DCS) in Computer Science**, Montreal. Do not recast it as a bachelor's degree or invent study dates.
- Currently Building is deliberately nonspecific: a platform for the audience around the Canadian tech internships repository, launching soon. **Never reveal specific product, architecture, implementation, or unreleased feature details.**
- Contact: existing verified profile links are in `lib/content.ts`. Email/resume come from `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_RESUME_URL`; when unset, non-clickable "coming soon" placeholders are intentional. Keep a configured resume URL; do not invent one or claim the repository contains a confirmed current public resume.

## Resolved decisions and verification

The cover is minimal and centered: enormous name, one quiet crest, small role/location/edition details, generous empty space, no secondary illustration/object. The back cover uses the same material with closing line, opportunity note, name, contact links, and "Montreal · 2026" closing device. Skills use recognizable icons grouped as Backend & Data, Frontend, Infra & Cloud, and Tools; experience uses the same icon treatment. The three role anchors intentionally differ: runtime comparison, backend logic/data/tests diagram, and authentication mark. These are accepted decisions, not prompts to redesign.

For code changes, use the applicable checks: `npm run typecheck`, `npm run build`, and `npm test`. Playwright expects a running server at `http://localhost:3000`, overridable with `BOOK_TEST_BASE_URL`, and installed Chromium. See `tests/book.spec.ts`, `tests/book-material.spec.ts`, `tests/chapters.spec.ts`, `tests/makeover.spec.ts`, and `tests/bidirectional.spec.ts`. Preserve no-JS, reduced-motion, native/keyboard navigation, static chapter differentiation, and rapid reversal coverage. `node scripts/review-jackets.cjs` produces desktop front/back comparisons and mobile cover screenshots in ignored `test-results/`; inspect them after visual changes. The wheel/trackpad tests simulate coarse and fine/inertial input traces; do not claim physical-device testing from those tests alone.

## Scoped refinements after the verification baseline

The cover name now uses upright Manrope (`Body`) at the existing scale; interior Editorial typography is unchanged. Cover and chapter turns use the same two-sided `TurnSheet` geometry and share `animateLeaf` in `lib/book-effects.ts`, including keyframes, shadow sweep, easing, timeline duration, and 85vh scroll travel. Decorative outgoing copies exclude divider titles, and leaf backs no longer carry oversized chapter numerals. Dedicated divider pages and running heads remain.

## 2026-09-14 refinements

Introduction typography uses the shared Editorial heading and Body text. Its copy includes the unique former About details; there is no separate About chapter or index entry. Only the cover name uses the distinct upright Manrope treatment. The final leaf's reverse carries an inert cloth jacket copy (`.closing-art`), built by the shared `turnPage`; it is removed when motion enhancement is disabled.

## 2026-09-14: scroll response standard

All cover/chapter turns share `TURN_EASING = cubic-bezier(.24,.12,.22,1)`, a continuous 0 to -180 degree rotation, and `TURN_TRAVEL = 0.85` viewport height. `TURN_DURATION = 1800` remains a paused timeline coordinate, not wall-clock playback duration. Native scrolling is never intercepted. The visual position follows the latest actual scroll position with `1 - exp(-elapsed / 32)` response (`TURN_RESPONSE_MS = 32`): about 95% settled after 96ms. Snap within 0.1px; jumps larger than one viewport and layout remeasurement synchronize immediately. This short settling response replaces direct per-notch seeking; do not add velocity, overshoot, event queues, or completion-triggered content changes. Stop requesting frames once settled and clear immediately on reduced-motion changes.

Experience SVG chips load eagerly: browser lazy-load proximity otherwise starts their requests during the opening. The rest of the site's deferred assets retain their existing loading policy. Final production traces used Chromium/SwiftShader software rendering and simulated wheel/trackpad input: roughly 16.7ms median frame intervals, no long tasks/layout shifts/transition-time requests; the wheel run included one 33.3ms interval. Do not describe this as guaranteed zero dropped frames or physical mouse testing.

Prepare all inert leaf copies and paused timelines during enhancement setup, not while crossing boundaries; skip unchanged timeline writes. The stationary front jacket fades over normalized keyframe offsets 0.72–0.88 behind the opaque reverse, before the leaf faces clear over 0.88–1. The introduction remains server-rendered in place and its Editorial/Body fonts are preloaded in `app/layout.tsx`. Cover typeface alternatives are review-only screenshots; Manrope remains selected pending the user's choice. `tests/premium-motion.spec.ts` covers discrete wheel interpolation, rapid reversal, the unchanged introduction DOM/position, clickable handoff, and live reduced-motion changes. Tests inspecting exact scroll positions must allow the bounded settling response (`tests/motion-helpers.ts`). Simulated input and Chromium traces do not establish physical-device performance.

A follow-up D3D11 hardware-accelerated Chromium check also measured ~16.7ms median intervals, with one 33.4ms interval in each wheel/trackpad run. Both had zero long tasks, layout shifts, and transition-time requests. The review video uses hardware acceleration; input remains simulated.

## 2026-09-17: readable paired interior turns

Interior chapter and reading-spread boundaries now use two blank paper leaves beneath the single server-rendered reading layer. The user selected readability first: paper supplies the physical motion, while text stays sharp and fully opaque in native document flow. Do not put outgoing paragraph copies back on interior leaves or animate reading text. Both halves share the finalized easing, 1800ms paused coordinate, 85vh travel, and 32ms response; the left leaf mirrors rotation/shadow direction around the gutter. Paper and shadow are clipped to their own spread to prevent projection over neighboring content. Phones retain one leaf for their single-page layout. Covers retain their existing jacket mechanism.

`tests/spread-readability.spec.ts` checks all interior boundaries at four intermediate positions plus completion, then reverses through the same positions, on desktop and mobile. It checks synchronized timelines, untransformed/opaque text and absence of duplicate paragraphs, and captures forward/reverse review frames. Live reduced-motion toggles remove paired enhancement layers and restore them without duplicates. No-JS DOM order is unchanged. Four sampled images cannot establish every possible device/frame; structural ink separation prevents perspective distortion throughout the timeline.
