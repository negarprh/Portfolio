# Illustrated engineering book

Historical record: the portrait phase referenced below was superseded by complete portrait removal on 2026-11-04. All six chapters now use original static SVG drawings; see [the current book contract](context/BOOK.md). The budget and verification below record the preceding engineering/material work.

Implemented on `makeover`. This extends the Modern Editorial identity described in `docs/context/BOOK.md`; it preserves the book, navigation, turn engine, complete copy, and 31-item skills inventory. Pre-existing `.gitignore` and `skills-lock.json` changes were preserved.

## Art direction

The material reference is a contemporary clothbound engineering publication: fine charcoal book cloth, pressed brass tooling, clean uncoated stocks, and selective engraved illustration. Preserve the NP seal, Orbitron cover name, DM Serif Display, Manrope, existing chapter colors, and all readable HTML copy.

## Assets and budget

Negar approved up to 8.25 credits from a 10-credit welcome balance. GPT Image 2.5 quoted 2.75 credits per 2K high-quality image but rejected generation with `job_minimum_basic_plan_required`; no credits were spent on that model. Nano Banana 2 quoted 2 credits per image. Two charcoal cloth requests were rejected with `nsfw` status and fully refunded. The initial woven-paths illustration and one refinement succeeded for **4 credits net**, leaving **6 credits**. No credits or subscription were purchased, and no further generation is planned for this change.

| Integrated asset | Source | Web size | Purpose |
| --- | --- | --- | --- |
| `author-portrait.webp` | Supplied pencil sketch, deterministic background extraction | 768×576, 319,782 bytes | Transparent author portrait above desktop details and beside phone details |
| `editorial-cloth.svg` | Original deterministic SVG | 1,049 bytes | Fine charcoal weave and subtle irregular fibers, shared by both covers and their turning surfaces |
| `editorial-paper.svg` | Original deterministic SVG | 477 bytes | Quiet neutral grain across chapter stocks, turning paper, and native fallbacks |
| Three project `.webp` files | Same-size derivatives of existing genuine PNG screenshots | 265,728 bytes combined | Uncropped project evidence with original alt text and sample-data attribution |

The earlier generated woven-paths artwork has been retired and removed from public assets. Its draft and refined originals remain in the ignored local production archive. The current portrait uses original facial pixels with a deterministic alpha matte, lossless WebP export, and meaningful alternative text. No credits were used for the portrait, and the earlier illustration's contrast/brightness filters and multiply compositing have been removed.

The three screenshot derivatives reduce their combined transferred image bytes by about 81% (1,429,219 to 265,728), without changing source dimensions or cropping. Original PNGs remain available. `scripts/capture-repo.cjs` refreshes both repository image formats. This is an asset-size comparison, not a measured page-load or frame-rate claim.

Textures add no layout height. The supplemental engineering figures appear only above 1000px; the author portrait appears at every viewport. All original paragraphs, HTML metrics, project actions and screenshots remain present on compact layouts. Skills gains aligned category tabs and quiet inventory rules; Education gains a small typographic double rule. Contact shares the refined hardcover material. No new dependency or animation was added.

## Implemented engineering figures

`components/engineering-figures.tsx` adds static supplemental SVG/HTML figures above 1000px. The original HTML comparisons and complete paragraphs remain visible at every size. These figures repeat verified evidence; their decorative copies are hidden from assistive technology.

- Tail’ed: before/after runtime endpoints share a labeled 0–5 hour scale. Values remain 4.7h and 1.8h, with the approved 62% reduction and multithreaded-concurrency method.
- Lienzo: two 100-dot fields show 24% and 72% backend test coverage. Each dot represents one percentage point; the caption identifies CQRS commands and queries. No individual test count is implied.
- Canadian Tech Internships: a GitHub Actions branching figure distinguishes issue-to-PR submissions, listing table updates, and Python closed-link checks. It does not depict an unpublished discovery system or borrow Tail’ed's pipeline.

The supplemental figures are omitted on smaller layouts to avoid adding to existing page fitting. No new animation, dependency, input handler, or motion-engine change is required.

## Verification

- Before/after Chromium captures cover all reading spreads at 1440×900, 768×1024, 390×844, and 320×568. A separate untouched `HEAD` development snapshot supplied the baseline; final captures use the production server. Captures wait for the actual signature completion instead of a fixed entrance delay.
- Fitting measurements are identical at the four comparison viewports: no additional shrinking. Desktop/tablet blocks remain at 1×. Existing compact-phone reductions remain.
- Typecheck and production build passed after integration.
- Initial 21 targeted checks passed. Six material/contrast checks passed after darkening the cloth highlights to retain brass-text contrast and updating the obsolete no-JS expectation of texture-free paper. The fallback test still checks native layout, folios and index navigation.
- All 66 representative rendered text samples pass AA thresholds; the minimum is 4.53:1. The contrast test retains a complete JSON report even when a sample fails, using soft assertions without relaxing thresholds.
- The full 90-test production run completed with 88 passes and the two initial material/contrast failures described above. Both failures were corrected; all six affected checks passed on rerun. After the refreshed production build and share image, the final 11-test material/document/accessibility/contrast run passed completely in 35.8 seconds. Axe reported no violations in the tested desktop/mobile document states. No unresolved test failure remains.
- `git diff --check` and syntax checks for both changed review/capture scripts passed. The final available Higgsfield balance was rechecked at 6 credits.

Screenshots and fitting JSON are under ignored `.context-local/illustrated-book/before/` and `after/`. Use `BOOK_REVIEW_OUTPUT` with `scripts/review-editorial.cjs` to preserve captures when Playwright clears `test-results/`. Local Brandkit state and working originals remain under the same ignored project directory; no generated approval was inferred or persisted.

| Viewport | Before | After |
| --- | --- | --- |
| Desktop · 1440×900 | [Overview](../.context-local/illustrated-book/before/1440-overview.png) | [Overview](../.context-local/illustrated-book/after/1440-overview.png) |
| Tablet · 768×1024 | [Overview](../.context-local/illustrated-book/before/768-overview.png) | [Overview](../.context-local/illustrated-book/after/768-overview.png) |
| Phone · 390×844 | [Overview](../.context-local/illustrated-book/before/390-overview.png) | [Overview](../.context-local/illustrated-book/after/390-overview.png) |
| Compact phone · 320×568 | [Overview](../.context-local/illustrated-book/before/320-overview.png) | [Overview](../.context-local/illustrated-book/after/320-overview.png) |

Remaining limitations: the existing complete-leaf fitting remains dense on compact phones, including the pre-existing oversized cover-name crop at 320px. Supplemental engineering diagrams are omitted at tablet/phone widths to preserve reading scale; the author portrait remains visible. Browser interaction tests simulate input; physical devices and real mobile browser-chrome behavior were not tested. Contrast checks sample representative text rather than every pixel or state. External action destinations are checked, not authenticated application flows.
