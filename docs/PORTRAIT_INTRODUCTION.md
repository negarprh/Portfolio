# Introduction: author portrait

Historical record: superseded on 2026-11-04. Negar requested complete portrait removal. The source, public export, extraction script and portrait layout are removed; see [the current book contract](context/BOOK.md) for the six SVG chapter illustrations.

The subsequent [professional-details refinement](DETAILS_REFINEMENT.md) places the portrait beside the phone metadata and standardizes its typography. The extraction/fidelity details below remain current; screenshots and checks here record the preceding portrait integration.

Implemented on `makeover` on 2026-10-31. This change is confined to the Introduction composition, its image preparation, affected tests, and current documentation. Existing material/engineering refinements and unrelated working-tree changes remain intact. No page-turn or navigation implementation was changed.

## Image fidelity and transparency

- Source: the supplied `Portrait/Portrait.png`, 1448×1086. The source remains untouched.
- Output: `public/images/author-portrait.webp`, 768×576, 319,782 bytes, lossless WebP with a real alpha channel. The exported aspect ratio matches the original; there is no stretching, regenerated face, sharpening, recoloring, or CSS filter.
- `scripts/prepare-author-portrait.cjs` removes surrounding cream paper deterministically, follows the original hair/shoulder silhouette, retains opaque facial pixels, and unmattes translucent pencil edges. A protected 103,600-pixel facial region is checked for full opacity and exact original RGB values in the native-resolution master.
- The full-size transparent PNG master and extraction report are saved under ignored `.context-local/portrait-refinement/`. Only the optimized WebP is loaded by the site. Its file size is about 89% smaller than the supplied PNG.
- The former generated introductory asset and its active code/document references are removed. Its filter/blend styles and the unused greeting typography are removed. No image-generation service or credits were used for this change.

Recreate the asset with:

```sh
node scripts/prepare-author-portrait.cjs
```

## Composition

The greeting heading is removed and all three biography paragraphs remain unchanged. The section retains its accessible Introduction label. Desktop/tablet center the biography beside a portrait/details column; the portrait sits above professional details with no frame or visible rectangular background. Image transparency supplies the soft pencil edges directly, without blend modes or shadows.

The portrait is up to 330px wide on desktop and up to 260px on tablet. Phones now place it in a 120px column to the right of the professional details, or 92px at compact widths, instead of above them. The opening paragraph reserves space for the fixed index bookmark at compact widths. Body font size and paragraph copy remain unchanged; the existing measured fitting engine is untouched.

## Verification

- `npm run typecheck`: passed.
- `npm run build`: passed.
- 30 relevant production Playwright tests passed together: document accessibility, responsive fitting across 15 viewport sizes, introduction/contact typography, reversed turns, phone input pacing, no-JS, reduced motion, and rendered text contrast.
- The cover link / Introduction bookmark regression test passed separately.
- After the final compact-phone clearance adjustment, both 320×568 and 360×640 fitting checks and the mobile accessibility check passed again. The fitting spec now checks text-range intersection with the fixed index bookmark.
- Axe reported no violations in tested desktop/mobile states. All 65 sampled rendered text colors passed the existing AA contrast thresholds; the minimum ratio was 4.53:1.
- The deterministic extraction guard and script syntax check passed. No new dependency was added.

| Viewport | Prior Introduction scale | Final scale | Screenshot |
| --- | --- | --- | --- |
| 1440×900 | 1× | 1× | [Desktop](../.context-local/portrait-refinement/after/1440-introduction.png) |
| 768×1024 | 1× | 1× | [Tablet](../.context-local/portrait-refinement/after/768-introduction.png) |
| 390×844 | 1× | 1× | [Phone](../.context-local/portrait-refinement/after/390-introduction.png) |
| 320×568 | 0.776× | about 0.794× | [Compact phone](../.context-local/portrait-refinement/after/320-introduction.png) |

Before/after screenshots and fitting JSON are retained in `.context-local/portrait-refinement/before/` and `after/`. The baseline was captured from the existing working application before the portrait change; final screenshots use the production build. The compact phone still uses the existing complete-leaf fitting, with a deliberately small portrait to preserve text readability. Browser inputs are simulated; physical-device behavior was not tested.
