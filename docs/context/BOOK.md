# Book product and interaction contract

Last reconciled: 2026-09-27. This is the current-state design contract. Historical experiments and rationale live in `DECISIONS.md` and are not requirements unless repeated here.

## Product concept

The portfolio is one continuous physical book: front cover → 01 Introduction → 02 Experience → 03 Skills → 04 Projects → 05 Education → 06 Contact (back cover). Roman chapter marks match these numbers (I–VI); reading-spread folios run from 01 through 10. Currently Building is removed, and SearchStop is not relocated. Scrolling opens covers and turns leaves at chapter or reading-spread boundaries. A visible spine, paper edges, running heads, mirrored margins/folios, and deliberate divider pages support the book metaphor. The bookmark/index lands at the exact chapter start using stable document positions, including when returning to Introduction from later chapters; “Contact” opens the back cover rather than a separate slide.

The cover is minimal and centered: an enormous name, one restrained NP crest, small role/location/edition details, and generous empty space. The back cover uses matching cloth: NP crest, CONTACT, and “Let’s talk.”, and “I’m currently open to software” / “development opportunities.” Center Email, LinkedIn, and GitHub in one row at a legible 16px with brighter paper-colored ink, followed by “Montréal · 2026.” Omit Résumé and the separate name line. Do not add a secondary cover illustration, object, graph, or competing mark.

The front cover omits the 2025–2026 range and TYPESCRIPT & PYTHON label; retain its location and volume/edition labels. Its centered bottom opening link uses a larger “Open the book” title, a small “Scroll down to begin” hint, and a static fine-line downward cue; it remains clickable and keyboard-accessible.

The favicon echoes the NP seal: a compact serif NP monogram in warm gold, on a dark ink square with a restrained inset rule. Its letterforms are vector paths so small browser-tab rendering does not depend on installed fonts.

On screens wider than 700px, vertically center the introduction’s right-hand facts within the spread beside the biography. Retain stacked phone layout. Availability reads “Open to Montréal and remote roles.”

Experience uses the same labeled brand-icon language as Skills, with static accomplishment anchors approved 2026-10-12: Tail’ed’s 4.7h → 1.8h median runtime comparison, Lienzo’s 24% → 72% backend test coverage comparison, and Ozex’s 35% faster API responses. Keep authentication in Ozex’s copy and stack. Preserve the book layout.

The Projects chapter at `#work` presents exactly three editorial spreads: Canadian Tech Internships, Evenly, and AirSense. Preserve the shared divider, paper palette, typography, mirrored margins, running head, and turn boundaries. Each spread shows an actual project screenshot at its natural aspect ratio: the existing internships repository capture, Evenly’s repository dashboard capture with a sample-data caption, and the existing AirSense city-search image. Internships pairs dynamic stars and 197K+ views above its image, with smaller Google visibility and recruiting-cycle notes. No generic cards, repository grid, or extra-project page. External project actions use plain underlined “View on GitHub” and “Visit live site” labels, without arrow icons, with accessible names, new tabs, and `noopener noreferrer`. Contact links use plain underlined service names. External links strengthen their underline on hover and have a visible keyboard focus outline.

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
- Phone introduction and experience paragraphs use left-aligned 15px type, 1.6 line height, a 38ch maximum measure, pretty wrapping, and one-em paragraph gaps. Preserve complete copy and measured page fitting, including static fallbacks.
- Front-cover name only: local Orbitron 400. Preserve its scale, centered composition, and letterpress shadows.
- Technical labels: system `"Courier New", monospace`; interior folios use Georgia.
- Introduction/project technology lists and experience dates use 16px on desktop. Phone typography may be smaller to fit the full original content on one centered page. Display experience dates without day numbers, retaining verified months, seasons, and years. Preserve regular monospace, the original softer colors, and uppercase date styling; do not substitute heavier type or a different font.
- Education remains one reading spread: large two-line COMPUTER / SCIENCE type and a small SOFTWARE DEVELOPMENT line on the left; location, LaSalle College, credential, program, subtle 12px dates, and one contextual sentence on the right. Use the existing spread grid and responsive stacking, typography, paper, folios, and turn boundary. No year-focused artwork, logos, skills, course lists, or experience repetition.
- The cover-name size remains `clamp(88px, 11.7vw, 190px)` desktop and `clamp(72px, 19vw, 132px)` mobile.
- Use recognizable local SVG brand marks with text labels for experience and skills. Attributions and licenses remain in `README.md` and `public/licenses/`.
- Skills uses two reading spreads: short intro immediately above Backend on the first left page, with Frontend opposite; Databases & Data and Tools & Testing on the second left page, with Infrastructure & Cloud and AI Development opposite. Original category numbers remain attached to their categories; AI Development is 06. The spreads retain all 13/18 entries of the approved 31-item inventory. All six categories share one heading/rule anatomy and two-column inventory, falling back to one column only when page width requires it. On desktop, one SkillItem uses a fixed 32px icon column, 12px text gap, 40px minimum row height, and 16px names. Phones use a compact version and measured page fitting without removing entries. Spacing tokens control rules, headings, rows, and category separation. A Skills-local SVG filter compresses logo luminance into a muted gray range while retaining internal details; optical sizes compensate for dense marks and internal SVG whitespace. Reuse the existing spread grid, paper, and turn boundaries; no proficiency ratings.

## Motion contract

- Cover, interior, and closing turns use one stationary stage and the same scroll geometry. Native scroll maps linearly onto a 180-degree turn over `TURN_TRAVEL = 0.85` viewport heights, with the existing `TURN_RESPONSE_MS = 32` exponential response. Large jumps and remeasurement synchronize immediately.
- Original reading surfaces occupy one fixed viewport-height paper rectangle. All interior surfaces use identical bounds, including nested spreads whose section borders previously narrowed them. The front cover retains its existing full-width dimensions; its turn uses the same mechanism at that width.
- One right-hand sheet crosses the center spine on desktop. Twelve connected 3D segments bend continuously during the rotation, with outgoing recto and incoming verso content, hidden reverse faces, a moving cast shadow, contact shadow, and restrained face lighting. Adjacent joints share endpoints. No paired outward-opening leaves, crossfades, vertical spread translations, or blank decorative sheets.
- The next spread is rendered beneath the outgoing spread. Its right page is exposed by the sheet lifting; its left page arrives on the reverse of that sheet. At rest, the original semantic content owns reading and links. Decorative snapshots are inert, omit IDs and boundary attributes, and preserve the existing typography/materials. Snapshot preparation is warmed while resting and refreshed if the source reading position changes.
- Phones use the same physical turn at full page width with a left-edge hinge. Reading pages have no nested vertical or horizontal scrolling. Full original paragraphs remain present on every screen; do not substitute summaries, truncate, or hide important copy to fit.
- Fit and vertically center each complete reading block inside symmetric page bounds on measurement, font readiness, and resize. Responsive type, spacing, and image sizes establish the layout; a measured layout scale reduces it only as necessary to fit. The fit is static during a turn. Folios and running heads stay anchored. Every reading runway occupies one viewport height, including Evenly.
- Empty document runways retain native scroll distance and stable chapter destinations. Index, cover link, and inline chapter links use those destinations; hidden reading surfaces are inert. Clearing enhancement removes the fixed positioning, runways, snapshots, visibility and clipping state, restoring the original static document.
- Divider wrappers retain 175svh desktop / 150svh mobile runways. Paper texture, page blocks, INDEX, navigation labels, content and typography remain unchanged.
- The one-time cover pen entrance reveals the actual Orbitron heading one line at a time using clip-path, with no font swap. It waits for fonts/window load and runs for 2.48 seconds. No-JS, reduced motion, scroll-away, or tab hiding resolve immediately to resting type; it never replays on scroll.
- The front NP seal also waits for fonts and page assets, enters once, and remains still. Its static fallback stays visible without JavaScript or with reduced motion.

## Accessibility and truthfulness checks

- Preserve skip link, semantic headings, native anchor targets, keyboard index behavior, and honest image alternative text.
- Do not hide content based on animation completion.
- Browser wheel/trackpad tests simulate input. They do not establish physical-device performance or guarantee zero dropped frames.
- After visual changes, inspect both desktop and mobile covers/chapters in addition to automated assertions.
