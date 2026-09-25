# Book product and interaction contract

Last reconciled: 2026-09-24. This is the current-state design contract. Historical experiments and rationale live in `DECISIONS.md` and are not requirements unless repeated here.

## Product concept

The portfolio is one continuous physical book: front cover → 01 Introduction → 02 Experience → 03 Skills → 04 Projects → 05 Education → 06 Contact (back cover). Roman chapter marks match these numbers (I–VI); reading-spread folios run from 01 through 10. Currently Building is removed, and SearchStop is not relocated. Scrolling opens covers and turns leaves at chapter or reading-spread boundaries. A visible spine, paper edges, running heads, mirrored margins/folios, and deliberate divider pages support the book metaphor. The bookmark/index lands at the exact chapter start using stable document positions, including when returning to Introduction from later chapters; “Contact” opens the back cover rather than a separate slide.

The cover is minimal and centered: an enormous name, one restrained NP crest, small role/location/edition details, and generous empty space. The back cover uses matching cloth: NP crest, CONTACT, “Have a role in mind?” / “Let’s talk.”, and “I’m currently open to software” / “development opportunities.” Center Email, LinkedIn, and GitHub in one row at a legible 16px with brighter paper-colored ink, followed by “Montréal · 2026.” Omit Résumé and the separate name line. Do not add a secondary cover illustration, object, graph, or competing mark.

The front cover omits the 2025–2026 range and TYPESCRIPT & PYTHON label; retain its location and volume/edition labels.

The favicon echoes the NP seal: a compact serif NP monogram in warm gold, on a dark ink square with a restrained inset rule. Its letterforms are vector paths so small browser-tab rendering does not depend on installed fonts.

Experience uses the same labeled brand-icon language as Skills, but each role keeps a distinct static accomplishment anchor: Tail’ed’s runtime comparison, Lienzo’s backend logic/data/tests diagram, and Ozex’s authentication mark. Do not collapse the roles into an identical generic template.

The Projects chapter at `#work` presents exactly three editorial spreads: Canadian Tech Internships, Evenly, and AirSense. Preserve the shared divider, paper palette, typography, mirrored margins, running head, and turn boundaries. Each spread shows an actual project screenshot at its natural aspect ratio: the existing internships repository capture, Evenly’s repository dashboard capture with a sample-data caption, and the existing AirSense city-search image. Internships pairs dynamic stars and 197K+ views above its image, with smaller Google visibility and recruiting-cycle notes. No generic cards, repository grid, or extra-project page. External project actions use existing underlined links with accessible names, new tabs, and `noopener noreferrer`.

## Non-negotiable behavior

- Complete content renders server-side in static document order. With JavaScript disabled, every chapter and the back cover remain readable, native links work, and the `<details>` index functions.
- Fully support `prefers-reduced-motion`, including preference changes while open. Static final states must be immediately readable; navigation and normal scrolling remain available.
- Scrolling is native and bidirectional. Upward scrolling reverses the same leaf rotation, opacity, and shadow progress. Fast reversals settle at the actual scroll position without queues or competing animations.
- Do not add WebGL, canvas physics, a 3D engine, scroll interception, cursor tracking, or pointermove/mousemove visual effects.
- Except for the explicitly approved cover signature’s `stroke-dashoffset`, animate only `transform`, `opacity`, or `clip-path`. Never animate layout dimensions/coordinates or `box-shadow`.
- No continuous loop except the restrained 10-second gold accent-dot opacity cycle. Cover signature and seal entrances happen once per mount and settle permanently when interrupted.
- No purple, glassmorphism, drop-shadow cards, or generic technology-cube imagery.

## Material and palette

Existing static CSS gradients are intentionally retained for cloth, paper grain, binding, page edges, and cast-shadow layers. This predates the “no gradients” direction. Do not add new gradients, remove the retained material treatment without approval, or inaccurately describe the site as gradient-free. Physical cover/page shading is not a drop-shadow card style.

The exposed page blocks use one non-tiled SVG paper texture on both sides, mirrored at the binding. Negar approved irregular sheet spacing, varied fine seams, restrained warm sheet tones, sparse darker gaps, subtle fibers/grain, 1–2px edge offsets, and a shallow natural bow with soft contact/outer shading. Preserve their existing 27px/21px dimensions, opacity, and thickness-transfer transforms. Keep the paper clean and modern, without yellowing, damage, or obvious repeating stripes.

Base tokens in `app/globals.css`:

| Token      | Value     | Use                               |
| ---------- | --------- | --------------------------------- |
| `--ink`    | `#24241f` | Dark olive-charcoal cover and ink |
| `--paper`  | `#f2efe6` | Ivory paper and cover lettering   |
| `--accent` | `#b9a06a` | Muted amber/gold                  |
| `--line`   | `#cecabd` | Interior rules                    |
| `--muted`  | `#65655b` | Secondary copy                    |

Chapter paper/ink pairs:

| Section            | Paper     | Ink       |
| ------------------ | --------- | --------- |
| Introduction       | `#f4efe3` | `#7d6844` |
| Experience         | `#f1ebdc` | `#7d6339` |
| Projects           | `#e5edf0` | `#456675` |
| Education          | `#eeeddf` | `#615e3b` |
| Skills             | `#e3eade` | `#53674a` |

Enhanced chapter surfaces also use `--chapter-fold` and `--chapter-edge`; preserve their role when changing a palette.

The visible contact surface is the shared dark cloth back cover. Retained `#contact` paper tokens are not its active presentation.

## Typography and imagery

- Interior display: local DM Serif Display under `Editorial, Georgia, serif`.
- Body: local Manrope under `Body, Arial, sans-serif`.
- Front-cover name only: local Orbitron 400. Preserve its scale, centered composition, and letterpress shadows.
- Technical labels: system `"Courier New", monospace`; interior folios use Georgia.
- Introduction/project technology lists and experience dates use 16px, matching the introduction’s “Montréal, Canada” value at all widths. Preserve regular monospace, the original softer colors, and uppercase date styling; do not substitute heavier type or a different font.
- Education remains one reading spread: large two-line COMPUTER / SCIENCE type and a small SOFTWARE DEVELOPMENT line on the left; location, LaSalle College, credential, program, subtle 12px dates, and one contextual sentence on the right. Use the existing spread grid and responsive stacking, typography, paper, folios, and turn boundary. No year-focused artwork, logos, skills, course lists, or experience repetition.
- The cover-name size remains `clamp(88px, 11.7vw, 190px)` desktop and `clamp(72px, 19vw, 132px)` mobile.
- Use recognizable local SVG brand marks with text labels for experience and skills. Attributions and licenses remain in `README.md` and `public/licenses/`.
- Skills uses two reading spreads: short intro immediately above Backend on the first left page, with Frontend opposite; Data and Tools & Testing on the second left page, with Infra & Cloud opposite. Original category numbers remain attached to their categories; the spreads retain all 16/17 entries. All five categories share one heading/rule anatomy and two-column inventory, falling back to one column only when page width requires it. One SkillItem uses a fixed 32px icon column, 12px text gap, 40px minimum row height, and 16px names. Spacing tokens control rules, headings, rows, and category separation. A Skills-local SVG filter compresses logo luminance into a muted gray range while retaining internal details; optical sizes compensate for dense marks and internal SVG whitespace. Reuse the existing spread grid, paper, and turn boundaries; no proficiency ratings.

## Motion contract

- Cover and chapter turns share `TURN_DURATION = 1800`, `TURN_EASING = cubic-bezier(.24,.12,.22,1)`, `TURN_TRAVEL = 0.85`, and `TURN_RESPONSE_MS = 32` from `lib/book-effects.ts`.
- Duration is a paused animation coordinate, not a queued 1.8-second playback. Visual progress follows actual scroll position with the 32ms exponential response, snaps within 0.1px, and synchronizes immediately after large jumps or remeasurement.
- Desktop interior boundaries use paired blank paper leaves under the server-rendered reading layer; mobile uses one leaf. Never clone paragraph text onto interior turning paper.
- Reading ink uses directional clip-path strips calculated from the existing leaf animation's eased rotation and perspective-projected outer edge. Desktop strips uncover from both outer edges toward the spine; mobile uncovers from right to left. Ink is fully exposed when the front leaf passes the spine. The outgoing clip is the complementary region; entry/exit regions intersect. Reverse input retraces the same geometry.
- Ink stays fully opaque and untransformed, with no timers, delayed fades, completion events, or new runways. Child bounds are cached during measurement so all blocks use the same spread coordinates. Clearing enhancement removes all ink clipping properties.
- Prepare inert leaf copies and paused timelines during enhancement setup, not while crossing a boundary. Skip unchanged timeline writes.
- Chapter divider wrappers remain 175svh desktop / 150svh mobile around 100svh title pages.
- Covers retain the two-sided jacket mechanism. The stationary front jacket clears behind the opaque reverse before the introduction is revealed; the final reverse contains an inert cloth back-cover copy.
- The one-time cover signature uses authored SVG centreline paths and precomputed nib geometry. It waits for fonts/window load, runs for 2.48 seconds, then cross-fades to Orbitron. No-JS, reduced motion, scroll-away, or tab hiding resolve immediately to resting type; it never replays on scroll.
- The front NP seal also waits for fonts and page assets, enters once, and remains still. Its static fallback stays visible without JavaScript or with reduced motion.

## Accessibility and truthfulness checks

- Preserve skip link, semantic headings, native anchor targets, keyboard index behavior, and honest image alternative text.
- Do not hide content based on animation completion.
- Browser wheel/trackpad tests simulate input. They do not establish physical-device performance or guarantee zero dropped frames.
- After visual changes, inspect both desktop and mobile covers/chapters in addition to automated assertions.
