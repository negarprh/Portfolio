# Editorial refinement — 2026-10-30

Implemented on `makeover`. The starting working tree was clean. The requested `PORTFOLIO_AUDIT.md` was not present; current implementation and focused project context supplied the baseline.

## Visual changes

The hardcover now separates charcoal cloth from interior ink, with a quieter cool weave, coordinated brass tooling, and matching front/back treatment. The NP seal, Orbitron name, local fonts, opening entrance, page edges, and physical turn engine remain intact. Favicon raster fallbacks and the 1200×630 share image were refreshed.

Chapter stocks share an ivory base and coordinated fold/edge shades. Neutral binding and leaf lighting replace the stronger brown shading. The same paper tokens apply to static no-JavaScript and reduced-motion views. Brass remains a cover/decorative color; chapter ink identifies interior links, while forest plus an underline identifies active index navigation.

Desktop paragraphs use tighter 1.8 line height. Company headings have closer spacing and consistent upright serif type; roles use chapter ink, while regular monospace dates become quieter at 14px. Project titles use 44px/1.14 at the base desktop size, retaining existing responsive sizes. Skills headings use primary ink with tighter tracking. Phone introduction/experience paragraphs retain 15px/1.6 before existing measured fitting.

Project screenshots retain their natural aspect ratios; their fine outlines follow the image rather than framing empty space. Stronger hover underlines, 2px focus outlines, image focus feedback, and restrained pressed feedback clarify interactions. All original career copy, metrics, links, and 31 skills remain unchanged.

## Final palette

| Role | Color |
| --- | --- |
| Hardcover | `#252824` |
| Primary paper | `#F5F1E8` |
| Primary text | `#252923` |
| Secondary text | `#62665E` |
| Functional accent | `#355747` |
| Brass | `#B59A64` |
| Decorative rules | `#D5D0C5` |

| Chapter | Paper | Ink | Fold | Edge |
| --- | --- | --- | --- | --- |
| Introduction | `#F5F1E8` | `#355747` | `#E2DDD2` | `#ECE7DD` |
| Experience | `#F1E9DB` | `#70543D` | `#DDD2C1` | `#E8DFD0` |
| Skills | `#E9EEE7` | `#355747` | `#D0D9CC` | `#DFE6DC` |
| Projects | `#E8EDF0` | `#36596A` | `#CDD7DC` | `#DCE4E8` |
| Education | `#F0EDE5` | `#595D50` | `#DBD7CB` | `#E6E2D8` |

## Files and ownership

- `app/globals.css`: foundational tokens, typography, active navigation, introduction links.
- `app/book-material.css`: paper fallback, grain, neutral cast and binding shades.
- `app/chapters.css`: coordinated chapter tokens, native fallback stocks, divider hierarchy.
- `app/makeover.css`: matching covers, brass, experience/skills/project hierarchy, interaction states, turn-light tint.
- `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `app/opengraph-image.png`: coordinated identity assets.
- `scripts/review-editorial.cjs`: repeatable four-viewport captures, overview sheets, fitting measurements, optional `--share` capture.
- `tests/editorial-contrast.spec.ts`: representative text contrast against actual rendered cloth/paper pixels.
- `docs/context/BOOK.md`, `docs/context/ENGINEERING.md`, `DECISIONS.md`: current visual contract, verification workflow, rationale.

## Screenshots

Production Chromium captures were visually inspected at all four requested sizes. Each overview orders cover, introduction, experience, skills, projects, education, contact, and a chapter divider. Full screenshots and fitting measurements are generated artifacts under ignored `test-results/editorial-final/`.

| Viewport | Overview |
| --- | --- |
| 1440 × 900 | [Desktop](../test-results/editorial-final/1440-overview.png) |
| 768 × 1024 | [Tablet](../test-results/editorial-final/768-overview.png) |
| 390 × 844 | [Phone](../test-results/editorial-final/390-overview.png) |
| 320 × 568 | [Compact phone](../test-results/editorial-final/320-overview.png) |

| Surface | Desktop | Phone |
| --- | --- | --- |
| Cover | [1440](../test-results/editorial-final/1440-cover.png) | [390](../test-results/editorial-final/390-cover.png) |
| Introduction | [1440](../test-results/editorial-final/1440-introduction.png) | [390](../test-results/editorial-final/390-introduction.png) |
| Experience | [1440](../test-results/editorial-final/1440-experience.png) | [390](../test-results/editorial-final/390-experience.png) |
| Skills | [1440](../test-results/editorial-final/1440-skills.png) | [390](../test-results/editorial-final/390-skills.png) |
| Projects | [1440](../test-results/editorial-final/1440-projects.png) | [390](../test-results/editorial-final/390-projects.png) |
| Education | [1440](../test-results/editorial-final/1440-education.png) | [390](../test-results/editorial-final/390-education.png) |
| Contact | [1440](../test-results/editorial-final/1440-contact.png) | [390](../test-results/editorial-final/390-contact.png) |

Regenerate after running Playwright, which clears its output folder:

```powershell
$env:BOOK_TEST_BASE_URL='http://localhost:3001'
node scripts/review-editorial.cjs final
```

## Accessibility and responsive limits

Verification completed against a production server at `http://localhost:3001`:

- `npm run typecheck`: passed.
- `npm run build`: passed, including refreshed identity assets.
- `BOOK_TEST_BASE_URL=http://localhost:3001 npm test`: all 87 Playwright tests passed in 8.3 minutes.
- The full suite includes axe checks with no violations in the tested document states, no new page errors in the desktop document check, native no-JS links, live reduced-motion changes, keyboard/index/history navigation, project destinations, inventory/content preservation, overflow/fitting, and forward/reverse wheel/touch turns.
- The rendered contrast check was also run independently with its raw JSON retained; all 72 samples passed.
- Production screenshots were inspected at all four requested sizes after the material/outline refinement. No extra fitting reduction was introduced.
- `node --check scripts/review-editorial.cjs` and `git diff --check`: passed.

The rendered contrast regression temporarily makes sampled text transparent, preserving real paper gradients, grain, cover cloth, and binding underneath. It compares computed foreground color to the screenshot background and applies AA thresholds (4.5:1 normal text; 3:1 large text). All 72 sampled elements pass, with a lowest measured ratio of 4.55:1. This checks representative text, not every pixel or every interaction frame. Decorative numerals and quiet rules are not interface boundaries. Functional focus uses chapter/cover ink rather than those low-contrast rules.

| Surface | Lowest sampled ratio |
| --- | --- |
| Front cover | 4.55:1 |
| Introduction | 5.06:1 |
| Experience | 4.73:1 |
| Skills | 8.12:1 |
| Projects | 4.83:1 |
| Education | 4.79:1 |
| Back cover | 4.81:1 |

The [raw contrast samples](../test-results/editorial-final/contrast.json) are retained beside the screenshots.

Before/after fitting measurements at the four requested viewports showed no additional shrinking. Desktop/tablet blocks remain at 1×. At 390px, the flagship improves from about 0.983× to 0.987×; other reading blocks stay at 1×. At 320×568, existing fitting remains: introduction about 0.776×, experience 0.696–0.735×, second Skills spread 0.748×, and flagship 0.754×. AirSense improves slightly (0.874× to 0.877×).

The compact phone still renders dense content, tiny screenshot evidence, and small metadata. The fixed index bookmark can crowd long titles near the right edge. These are remaining usability limitations of fitting complete content onto a single leaf; this refinement does not rewrite the fitting/turn architecture. Tablet retains the existing two-page layout. Browser input is simulated; physical-device behavior and real mobile browser-chrome changes remain unverified. External link destinations and attributes are tested, not authenticated remote application flows.
