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
