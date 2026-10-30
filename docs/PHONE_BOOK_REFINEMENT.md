# Phone book depth — 2026-10-30

The phone layout now exposes a narrow stack of real sheet edges, a left-side binding shade, and a fine charcoal cover-board lip. These details reuse the existing materials. They sit inside the existing outer margins, keeping the page and reading area at their previous widths.

Mobile turns use stronger perspective and articulated flex, clearer face shading, and a wider contact shadow. The gesture pacing, swipe travel, single-leaf navigation, stationary reading pages, and desktop rendering coefficients are unchanged. Reduced motion and no-JavaScript still use native reading.

Changed implementation: `app/book-material.css`, `app/chapters.css`, `app/makeover.css`, and the visual coefficients in `lib/book-stage.ts`. Regression coverage lives in `tests/book-material.spec.ts`. The current design/engineering context and `DECISIONS.md` record the change.

## Visual review

The following strips show the resting page, three intermediate points, and the settled destination:

| Viewport | Before | Production result |
| --- | --- | --- |
| 320 × 568 | [Before](../test-results/phone-depth-before/320-sequence.png) | [After](../test-results/phone-depth-production/320-sequence.png) |
| 390 × 844 | [Before](../test-results/phone-depth-before/390-sequence.png) | [After](../test-results/phone-depth-production/390-sequence.png) |
| 412 × 915 | [Before](../test-results/phone-depth-before/412-sequence.png) | [After](../test-results/phone-depth-production/412-sequence.png) |
| 1440 × 900 | [Before](../test-results/phone-depth-before/1440-sequence.png) | [Desktop reference](../test-results/phone-depth-production/1440-sequence.png) |

Production fitting measurements are identical to the baseline for all ten reading blocks at all four sizes. No additional text shrinking was introduced. Generated captures live under ignored `test-results/`; regenerate them with `node scripts/review-phone-depth.cjs before` or `production`, setting `BOOK_TEST_BASE_URL` for the intended server.

A [forward/reverse video preview](../test-results/phone-depth-video/phone-turn.webm) shows the renderer at 390×844. Regenerate with `node scripts/review-phone-depth.cjs video`. This preview uses programmatic progression to isolate the visual effect; gesture behavior is checked separately by the touch regression tests.

The narrowest phone still uses the existing measured content fitting. This change improves the visual book effect without resolving that separate readability limitation. Input and viewport checks use Chromium emulation, not a physical phone, and do not establish a frame-rate guarantee.

## Verification

- `npm run typecheck` and `npm run build`: passed.
- Full production suite on port 3002: `npm test -- --output test-results/phone-regression` with `BOOK_TEST_BASE_URL=http://localhost:3002`; all 89 tests passed in 8.4 minutes.
- Coverage includes reversible curves, touch swipes/rollback/braking, index/history navigation, axe accessibility and rendered contrast, no-JS, live reduced motion, phone fitting/resize, complete project/skill content, and wide-monitor geometry.
- Production screenshots at all four sizes were visually reviewed; fitting measurements matched the baseline exactly.
- Review script syntax and `git diff --check`: passed.
