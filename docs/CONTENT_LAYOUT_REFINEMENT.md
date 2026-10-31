# Projects and Experience cleanup — 2026-10-31

Projects now have one clear heading and a consistent action group after the description and stack. Desktop retains a two-page composition; phone and DOM order follow heading → screenshot/evidence → complete description → technology line → actions. Both actions use plain underlined text links.

Follow-up: phone titles are centered. Negar rejected boxed actions as unsuitable for the book. GitHub and live-site actions now use plain underlined text on all screens, without borders, logos, or background fills. Paired phone links retain equal-width tap areas; a single GitHub action spans the row. Centered phone labels, clear tap targets, and keyboard focus remain.

Removed visual clutter: repeated category labels, redundant screenshot captions, the visible TECH label, oversized community metrics, separate Google/cycle notes, and duplicate external links on screenshots. The flagship retains dynamic stars and the user-reported 197K+ views as one quiet evidence line. Evenly retains its required sample-data caption. All original project paragraphs, stacks, destinations, alt text, and new-tab accessibility remain intact. Provenance for omitted promotional notes remains in `docs/context/CAREER.md`.

Experience retains complete descriptions, technology inventories, and labeled runtime/coverage comparisons. The two decorative bars under Tail’ed and Lienzo were removed from markup and CSS; no replacement ornament was added.

## Review captures

| Layout | Project | Experience |
| --- | --- | --- |
| Desktop, 1440×900 | [Flagship](../test-results/content-final/1440-project-0.png) | [Tail’ed](../test-results/content-final/1440-experience-0.png) |
| Tablet, 768×1024 | [Flagship](../test-results/content-final/768-project-0.png) | [Lienzo](../test-results/content-final/768-experience-1.png) |
| Phone, 390×844 | [Flagship](../test-results/content-final/390-project-0.png) · [Evenly](../test-results/content-final/390-project-1.png) · [AirSense](../test-results/content-final/390-project-2.png) | [Tail’ed](../test-results/content-final/390-experience-0.png) · [Lienzo](../test-results/content-final/390-experience-1.png) |
| Compact, 320×568 | [Flagship](../test-results/content-final/320-project-0.png) | [Lienzo](../test-results/content-final/320-experience-1.png) |

`scripts/review-content-layout.cjs before|final` captures all three projects and all three roles at these four sizes, plus fitting measurements. Set `BOOK_TEST_BASE_URL` to select the server. Generated files live in ignored `test-results/`.

## Verification and limits

Project regression tests now verify the final action placement, screenshot-before-copy phone order, working destinations/attributes, preserved image proportions and captions, and rendered action targets of at least 44px at 320×568 as well as larger screens. Phone actions have a 52px unscaled minimum to compensate for the existing fitting scale.

All six reviewed reading blocks remain at 1× fitting on 390×844. At 320×568, the flagship improves from 0.754× to 0.876×, AirSense from 0.877× to 0.917×, Tail’ed from 0.735× to 0.762×, and Lienzo from 0.696× to 0.732×. Evenly and Ozex retain their baseline fitting. No reviewed block shrinks further.

Phone comparisons: [Projects before/after](../test-results/content-final/390-project-comparison.png) and [Experience before/after](../test-results/content-final/390-experience-comparison.png).

Original descriptions remain complete. Compact phones still use measured fitting, so body text and screenshot details remain smaller than ideal; this change simplifies the presentation and reduces shrinking without changing the page-turn/fitting engine. Validation uses browser emulation, not a physical phone or authenticated remote application sessions.

Final checks: `npm run typecheck`, `npm run build`, and the complete production Playwright suite passed. `BOOK_TEST_BASE_URL=http://localhost:3002 npm test -- --workers 2 --output test-results/content-regression` passed all 90 tests in 4.5 minutes, including axe accessibility, rendered contrast, original paragraph/inventory preservation, no-JS/reduced-motion behavior, touch/wheel/index reversals, page bounds, and responsive fitting. All three projects and all three roles were visually reviewed at the four capture sizes. `git diff --check` and review-script syntax checks passed.
