# The Book: decisions and implementation record

Recorded 2026-09-13 from current source, Git history, and the user's design instructions. Active work is on `makeover`; the operating constraints and source map are in [AGENTS.md](AGENTS.md).

## Built and retained

| Commit | Verified implementation |
| --- | --- |
| `21e63f0` | Preserved the completed book portfolio on `makeover`: all chapters, local fonts/icons/project images, live API-derived GitHub stars, native bookmark navigation, paper/spine/edge system, running heads, distinct chapter palettes and pinned title dividers. |
| `7f2c189` | Added cloth/embossed cover styling, font/load-gated seal entrance, restrained accent-dot pulse, experience icon chips, and distinct Tail'ed runtime / Lienzo backend / Ozex authentication anchors. |
| `d33a494` | Replaced the separate NP wordmark with a single larger pressed seal; strengthened cloth, border, and letterpress treatments. |
| `518b93f` | Centered the cover composition, made every chapter/reading-spread turn scroll-position-driven and reversible, and replaced the separate closing slide/plain footer with a matching cloth back cover at `#contact`. Added the overlapping cover/introduction runway, native opening-link alignment, full-height mobile cover, and bidirectional input tests. |

The front crest is now a quiet publisher-style mark above the dominant name; the back crest is static. The shadow sweep and page rotation retrace the same timeline on upward scroll. Cover opening/closing follows scroll position too. Paper stacks transfer thickness left/right and disappear at the closed covers. Existing no-JS and reduced-motion behavior remains static, complete, and readable.

## Rejected or superseded directions

- **Asymmetric text-left / object-right hero:** explicitly rejected in favor of a centered, single-axis jacket composition with generous empty space.
- **Cat illustration, graph, or another secondary cover object:** user-rejected direction; the cover should remain professionally restrained, not playful or filled for the sake of filling space. This records the user's rejection, not a claim that a cat experiment was implemented in the inspected commits. The factual "cat person" line in About is separate and remains in current copy.
- **Separate NP wordmark plus seal:** implemented previously, then removed because the two marks competed.
- **Small/faint material or seal treatment:** superseded after the user said the cover still read as a typeset webpage. Keep visibly woven cloth, embossed edges, and pressed type; later centering made the crest quieter without removing the material treatment.
- **One-shot, forward-only chapter observers:** replaced with reusable paused timelines driven by scroll position. Do not restore a "seen" set that disables backward turns.
- **Fade/slide/dissolve as the chapter-transition mechanism:** rejected in favor of the spine-axis rotation and shadow sweep. Opacity is still used by shadow/face layers within that turn; it is not a substitute for the turn.
- **Cursor tracking / mousemove-driven decoration:** ruled out for jank risk.
- **Flat/plain-text skills or identical company templates:** use grouped real icons and distinct accomplishment anchors instead.
- **Self-negative or generic inflated About copy; Python-only positioning:** replaced with factual backend TypeScript/NestJS and Python experience, including React contributions.
- **Plain closing slide and unrelated footer:** superseded by a single matching back cover containing the closing message and contact links.

## Current-state caveats

- The literal new "no gradients" instruction and the pre-existing gradient-based material treatment are in tension. [AGENTS.md](AGENTS.md) records both accurately. This documentation task changes no rendering and does not silently remove the user's retained cloth/paper/spine treatment.
- "Live stars" currently means GitHub API data with hourly ISR and an honest non-numeric error fallback, not continuous polling or a hardcoded number.
- Email/resume placeholders remain until verified URLs are configured; Currently Building intentionally withholds product/architecture details.
- Browser tests cover full forward/back journeys and rapid reversals using simulated wheel and trackpad-style traces. Screenshots were visually reviewed; physical input hardware was not tested. Generated review images are ignored artifacts, not permanent source assets.

## 2026-09-13: persistent context

Expanded the root `AGENTS.md` while preserving Next.js's generated instruction block; documented actual font assets, CSS tokens, file ownership, content facts, branch workflow, and resolved decisions. Added this decision record and corrected stale README descriptions of forward-only turns. No application code, content, or visual behavior was changed in this documentation task.

## 2026-09-13: scoped transition and cover type refinements

The front cover now uses the same `animateLeaf` rotation and shadow keyframes, 1800ms paused timeline, easing, and 85vh scroll travel as chapter leaves. The cover now uses the actual two-sided TurnSheet: a half-width leaf hinged at the center gutter on desktop and a full-width leaf on mobile. The stationary jacket clears behind the opaque reverse before the paper face reveals the introduction. The name alone uses upright locally hosted Manrope (`Body`), preserving scale, composition, and pressed shadows. Moving leaves no longer clone divider titles or carry oversized chapter numerals; the dedicated divider beat and persistent running heads retain chapter identity.

## 2026-09-14: final leaf and introduction typography

The final turn uses the existing two-sided leaf with a sanitized, inert cloth back-cover copy on its reverse. It retains the shared scroll timeline and restores the static contact page under reduced motion. The introduction now uses locally hosted Source Sans 3 (Adobe's upright variable WOFF2): weight 600 for the greeting and 400 for reading text. The cover name and other chapters retain their existing typography.

## 2026-09-14: corrected typography scope and merged introduction

Source Sans 3 in the introduction was rejected: the requested distinct typeface applies to the cover name. Removed that font and restored the shared Editorial heading / Body copy. Merged the unique About facts (LaSalle background, repository maintenance, and cat-person detail) into the introduction without repeating the backend/React summary. Removed the separate About component and bookmark entry; Skills now leads to the back cover.

## 2026-09-14: wheel response and cover handoff

The user requested a crisper opening and one shared transition standard. Keep native scrolling and the 85vh travel, with a 32ms exponential visual response to soften discrete wheel notches (95% settled in about 96ms). Use `cubic-bezier(.24,.12,.22,1)` and one continuous 0 to -180 degree rotation for every leaf. The 1800ms paused timeline is not an imposed playback duration. Prebuild decorative copies, skip unchanged animation times, preload the first page's fonts, and overlap the stationary jacket's opacity fade behind the opaque reverse to remove the discrete handoff. Reduced motion cancels the response immediately. Exact constants and test expectations are recorded in AGENTS.md.

Five actual-cover typeface screenshots were requested before selecting a replacement: Bodoni Moda 600, Roboto Slab 700, Fraunces 850 with SOFT/WONK disabled, Archivo 800, and Syne 800. These are previews only, with identical scale/layout/shadows; the selected cover font remains Manrope.

## 2026-09-17: paper motion beneath sharp reading text

The user chose readability-first interior spread transitions. Both paper halves turn on a synchronized timeline beneath original text; reading ink is never cloned onto the rotating interior leaf, transformed, blurred, or faded. Native document flow keeps adjacent spreads spatially separate and makes incoming text immediately readable, with no completion-triggered handoff. Mirror the left leaf at the spine, keep the finalized cover easing/scroll response, and clip decorative projection within its own spread. Mobile uses one leaf; reduced motion removes the enhancement and no-JS retains static content. The front/back jacket mechanism remains unchanged. This supersedes the earlier outgoing paragraph copies on interior leaves.

## 2026-09-20: signature entrance, unchanged resting cover

Added original name-specific centreline paths for a brief connected handwriting entrance with a small nib following the stroke. This is an explicitly requested exception permitting stroke-dashoffset animation, restricted to the front name. After 2.48 seconds the existing Manrope name and pressed shadows remain. Font/asset readiness gates the entrance; no-JS and reduced motion bypass it, and scrolling or backgrounding settles it immediately. Signature paths do not appear on the inert turn copy or back cover. The separate Currently Building illustration experiment remains reverted.


## 2026-09-20: experience copy from updated resume facts

Recast the user’s Tail’ed, Lienzo, and Ozex resume/LinkedIn bullets as three short portfolio paragraphs per role. Keep the existing spreads and distinct visual anchors. Tail’ed now uses median GitHub Actions runtime (4.7h → 1.8h, 62% reduction), replacing the old Workday-only figure; its scope and coverage metrics are user-provided snapshots. Lienzo includes recurring tasks, Angular integration, 20+ services/APIs, and 24% → 72% backend test coverage. Ozex emphasizes backend work, 35% lower API response times, Supabase/JWT access control, and Swagger documentation. No role titles or dates changed.

## 2026-09-20: selected Orbitron cover typography

The user selected Orbitron for Negar Pirasteh on the hero. Orbitron 400 is locally hosted and preloaded, replacing Manrope only on the front-cover heading and its inert turn copy. Existing scale, composition, letterpress shadows, and the handwriting entrance remain; interior typography is unchanged.
