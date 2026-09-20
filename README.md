# The Book — Negar Pirasteh

A single-page, editorial developer portfolio built with Next.js App Router, TypeScript, and Tailwind CSS. Complete content is prerendered in document order. JavaScript only enhances the native chapter index and adds restrained page turns.

Project instructions and verified design/content constraints: [AGENTS.md](AGENTS.md). Accepted and rejected directions: [DECISIONS.md](DECISIONS.md). Active development is on `makeover`; merge to `main` only when explicitly requested.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm start
```

## Deploy on Vercel

Import this repository, choose the **Next.js** framework preset, and use the repository root. The normal `next build` output supports ISR; do not use `output: 'export'` or the legacy GitHub Pages workflow. No credentials are required for the public GitHub star count.

Optional environment variables (copy `.env.example` to `.env.local` locally):

- `NEXT_PUBLIC_CONTACT_EMAIL`: the verified public email address. Omitted until confirmed.
- `NEXT_PUBLIC_RESUME_URL`: a verified resume URL or `/resume.pdf` after adding that file under `public/`. Until configured, a non-clickable “Resume coming soon” placeholder is shown.

## Content and structure

- `app/page.tsx`: cover, introduction, and ordered chapter composition.
- `lib/content.ts`: verified work history, project copy, grouped skills, and links.
- `lib/github.ts`: public GitHub API fetch, hourly revalidation, five-second timeout, and a non-numeric fallback when unavailable.
- `components/`: editorial chapter components and the native HTML index.
- `components/book-motion.tsx`: optional browser enhancement; scroll-position-driven bidirectional turns, reduced-motion changes, index focus management, Escape, and outside-click dismissal.
- `app/globals.css`: ink/paper/amber design system and separate mobile composition.
- `app/chapters.css`: chapter-specific paper/ink palettes, contained running heads, margin numerals, and sticky full-height title spreads. Openings stay pinned for 75vh of additional scroll on desktop and 50vh on mobile; scrolling is never blocked.
- `app/book-material.css`: progressive paper grain, gutter/edge lighting, mirrored margins and folios, and fixed fore-edge stacks.
- `lib/book-effects.ts`: inert outgoing-page copies, spine-axis rotation, and a separately composited cast shadow.
- `public/`: locally hosted fonts, recognizable SVG icons, and real project screenshots.

The original `index.html`, `head.html`, and `assets/` remain as source material for the previous portfolio. Next.js does not serve those pages.

## Verification

```sh
npm run typecheck
npm run build
npm test
```

The browser suite expects a running local server on port 3000 and a Playwright Chromium installation (`npx playwright install chromium` if needed). It checks chapter content and assets, keyboard/index navigation, 320/390/768px layouts, JavaScript-disabled navigation, live reduced-motion changes, and reversible chapter/spread turns, including simulated wheel/trackpad journeys and rapid reversals. Axe checks cover desktop and mobile. Screenshots are saved in `test-results/`.

## Assets and attribution

Display: DM Serif Display. Body: Manrope. Both are locally hosted Google Fonts under the SIL Open Font License. Technical labels use the system monospace font.

Skill marks: Devicon (MIT) and Simple Icons (CC0; Stripe), with AWS artwork retained from the supplied portfolio. Brand marks belong to their respective owners. See `public/licenses/`.

Existing project images came from the supplied portfolio. The 2027 repository screenshot is captured from the actual public GitHub page by `scripts/capture-repo.cjs`. Refresh intentionally when the README changes; the star label is independently refreshed by ISR.

Motion only uses transform, opacity, and clip-path. Static gradients and fine CSS grain give the pages a paper surface. Shaded centre bindings and outer edges frame desktop spreads. Fixed fore-edge stacks accumulate on the left and diminish on the right with scroll progress (transform only). Chapter leaves carry inert copies of the preceding right-page content and rotate 180 degrees around the spine with a separate moving shadow. Chapter-divider leaves stay opaque and land on the left; reading-spread and back-cover faces clear at the end of their reversible turn. No animation libraries, canvas, or scroll interception are used. Interior material refinements are gated behind the client-set `data-book-enhanced` attribute. Both cloth covers retain their material and typography without JavaScript or with reduced motion. Without JavaScript or in reduced-motion mode, the previous flat sections, margins, folios, and native navigation remain in place. Switching to reduced motion cancels page/entrance animations, disables the dot pulse, and removes decorative content copies. With JavaScript disabled, the index is a native `<details>` element: choose a chapter, then toggle the bookmark to close it.

Chapter review: `node scripts/review-chapters.cjs` captures three adjacent chapter content pages with every animation stopped, plus desktop/mobile divider views. `tests/chapters.spec.ts` verifies distinct static identity, running-head containment, a 600px wheel-scroll hold, and the unpinned reduced-motion fallback.
## Makeover branch refinements

The `makeover` branch begins with commit `21e63f0`, preserving the complete book portfolio before these refinements.

- `components/cover-seal.tsx` waits for `document.fonts.ready` and the page load event before a single seal entrance. It removes its temporary motion-preference listener when the entrance finishes. Without JavaScript or with reduced motion, the seal is static and visible.
- `app/makeover.css` adds a static woven cover, embossed edge and title shading. The title's gold dot has the only continuous animation: a restrained ten-second CSS opacity cycle, disabled for reduced motion.
- Experience uses skill-style icon chips and three different static anchors: Tail’ed’s median GitHub Actions runtime comparison, Lienzo’s backend feature diagram, and Ozex’s authentication/authorization mark. Role descriptions use the scope and outcome metrics supplied by Negar from her resume and LinkedIn.
- `tests/makeover.spec.ts` covers delayed fonts, one-time entrance, the single permitted loop, and readable no-JS/reduced-motion views. `scripts/review-makeover.cjs` captures desktop and mobile review images.
