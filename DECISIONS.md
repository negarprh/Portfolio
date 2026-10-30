# The Book: decisions and implementation record

## 2026-10-30: coordinated modern editorial materials

Use Negar's charcoal/ivory/forest/brass foundation with coordinated cream, sand, pale green, blue-gray, and stone chapter stocks. Separate cover cloth from primary text ink and functional forest from decorative brass. Carry chapter colors into native fallbacks, fold/edge shades, neutral binding, and turning-sheet lighting. Keep existing fonts, complete content, and physical turn mechanics; refine heading proportions, date hierarchy, links, and screenshot boundaries without adding cards or increasing phone fitting. This supersedes the earlier warmer disconnected chapter palette. Verify against rendered textures and compare measured fitting at the four requested sizes.

This is a historical ledger, not the default source of current behavior. Load it only when a task revisits rationale, an accepted direction, or a rejected experiment. Current facts live in [`docs/context/CAREER.md`](docs/context/CAREER.md), the active design contract in [`docs/context/BOOK.md`](docs/context/BOOK.md), and implementation ownership in [`docs/context/ENGINEERING.md`](docs/context/ENGINEERING.md).

Recorded from current source, Git history, and the user’s design instructions beginning 2026-09-13. Active work is on `makeover`.

## Ledger rules

- Append an entry only for a durable choice with meaningful alternatives, a rejected direction likely to recur, or a current contract being superseded.
- Ordinary copy/fact updates belong in `docs/context/CAREER.md`, not here.
- State whether a new entry is **accepted**, **rejected**, or **superseded**, and link the decision it replaces when applicable.
- Never copy the whole chronology into `AGENTS.md`; keep that file as a lightweight router.

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

## 2026-09-21: scroll-scrubbed reading opacity

The user replaced the rejected endpoint-gating/timer proposals with direct opacity ramps from the existing filtered rotation progress. Outgoing ink fades over 0–15%; incoming ink fades over 85–100%. Reverse input retraces these same values. A surface's entry/exit tracks compose using their minimum to avoid competing writes when neighboring turns overlap. There are no timers, completion events, equality gates, new layout runways, or navigation offsets. Rotation keyframes, duration, easing, 85vh travel and 32ms response are unchanged. Original reading DOM stays untransformed; only its opacity changes. Covers retain their existing material tracks while text follows the same ramps. Clearing enhancement removes all ink properties, so no-JS and reduced motion remain fully visible. This supersedes September 17's always-opaque reading text.

The new ink CSS is restricted to prefers-reduced-motion: no-preference. If an in-flight scroll update observes reduced motion before the preference-change handler runs, it clears enhancement immediately instead of merely returning; no timer or additional animation loop is used. The mobile closing test now compares the timeline with the browser’s actual integer scroll position rather than its fractional requested destination.

## 2026-09-24: three selected Projects spreads

Replace the four-entry Selected work chapter with exactly Canadian Tech Internships, Evenly, and AirSense, preserving `#work`, the shared book surfaces, native scrolling, and turn behavior. Use concise copy, verified explicit external URLs, dynamic GitHub-star proof, an expense workflow diagram, and the existing AirSense image. Remove WealthWise and InvestGuard from the public chapter without adding an archive/grid. SearchStop remains unpublished. Subsequent folios shift down one spread; unrelated section content stays unchanged.

## 2026-09-24: geometric reading reveal

Replace September 21's uniform ink fades with clip-path regions following the existing leaf animation's eased, perspective-projected edge. Desktop retains its paired mirrored leaves and mobile its single leaf. Regions share spread coordinates across individual content blocks; incoming/outgoing regions intersect and reverse deterministically. Once the front passes the spine, incoming ink is fully readable, without a settling fade. Cache bounds during measurement, skip unchanged clips, and remove clipping on reduced motion or cleanup. Navigation, native scroll, layout, typography, and leaf physics remain unchanged.

## 2026-09-24: restore visual evidence in Projects

At Negar’s request, supersede the text-only community/expense compositions with real project screenshots while preserving the three existing spreads and turn behavior. Reuse the internships and AirSense assets and Evenly’s repository dashboard screenshot, explicitly captioned as sample data. Pair dynamic GitHub stars with user-supplied 197K+ annual views, supported by Google visibility and 2026 → 2027 maintenance. Keep the concise description’s cycle reference general so the exact years appear only in the supporting visual note. Do not duplicate Tail’ed pipeline metrics.

## 2026-09-24: Education as a field-and-credential spread

Replace the empty left page with large COMPUTER / SCIENCE typography and a small SOFTWARE DEVELOPMENT line. Keep the credential on the right and the user-supplied 2023–2026 dates as quiet metadata. Retain a single reading spread with the existing grid, responsive stacking, paper, and turn mechanics. No employer repetition, internship counts, coursework, or graduation-year focal point.

## 2026-09-25: five Skills categories across two spreads

Keep the existing numbered editorial inventory and monochrome logo/name treatment while adopting Negar’s exact 33 technologies and flexible backend/full-stack intro. Split Backend from Data, and place Frontend, Infra & Cloud, and Tools & Testing on the second spread. Each heading stays on the same page as its list, replacing the disconnected heading-left/list-right layout. Use optical logo sizing and Skills-only responsive columns, without proficiency ratings, extra concepts, or changes to other chapters or motion.

## 2026-09-25: unify Skills layout and logo ink

Following visual review, retain all approved Skills copy and replace the mixed one-/two-column category variants with one shared two-column system and a width-based narrow fallback. Pair Backend and Frontend on the first spread; place Data and Infra & Cloud opposite Tools & Testing on the second. This gives 16 and 17 entries per spread, retaining each category’s original number. Use a short intro above the first aligned heading row, align number/icon and title/name columns, and use shared vertical spacing tokens. Compress logo luminance through a local ink filter while preserving internal detail, rather than relying on grayscale and reduced opacity, which left several logos faint.

## 2026-09-25: final chapter order and Skills page composition

Remove Currently Building without relocating SearchStop. The final order is Introduction, Experience, Projects, Skills, Education, Contact, numbered 01–06 with matching Roman marks. Experience and Projects demonstrate the work before Skills supplies the inventory. Supersede the previous Skills page placement: intro and Backend opposite Frontend; Data and Tools & Testing opposite Infra & Cloud. Keep all content, category numbers, typography, logos, and SkillItem styling; bring the intro closer to Backend within its left page.

## 2026-09-25: Skills before Projects, precise index landing, and paper edges

Negar’s later instruction supersedes the preceding chapter order: Introduction, Experience, Skills, Projects, Education, Contact. Keep the approved Skills composition. Index clicks seek stable document positions instead of relying on native scrolling to sticky rectangles; retain native fallback anchors and hash history. Replace uniform exposed-page stripes with a shared static, non-tiled sheet texture with restrained variation, shallow contours, and soft shadows, preserving dimensions and all turn/thickness-transfer behavior. Contact now uses the approved email and three brighter 16px links, with no Résumé.

## 2026-09-26: stationary book, one flexible sheet, shared opening geometry

Negar explicitly requires a stationary book with a physical page crossing the spine, including the first transition and phones. Replace the competing normal-flow spreads and paired blank leaves with fixed original reading surfaces and one connected, two-sided articulated sheet. Scroll drives the same reversible geometry for the front cover, chapters, and closing. Inert content snapshots on the sheet supersede the earlier no-cloned-ink approach; stationary originals retain links and semantics. Keep existing content, typography, cover dimensions, paper, page edges, and index. Long phone content uses native scrolling within stationary paper at rest; during a turn only the sheet moves. Reduced motion and no JavaScript retain the original document flow.

## 2026-09-27: preserve all copy, fit and center each reading page

Negar rejected nested phone scrolling and shortened summaries. Restore the complete original introduction, experience, and project copy, including both Evenly paragraphs. Supersede the previous mobile overflow behavior: responsive sizing and a measured static layout scale fit the complete reading block within one page, centered vertically across viewport sizes. Scrolling exclusively advances the document's physical turns. Do not solve overflow by clipping text, removing paragraphs, or pinning content to the top. Static no-JS and reduced-motion layouts remain readable in normal flow.

## 2026-10-09: consistent cover lettering and restrained link arrows

Negar requested that the pen entrance match the finished name. Reveal the actual Orbitron heading line by line, with a decorative nib, instead of cross-fading from a separate cursive signature. Keep the one-time entrance and immediate static fallbacks. Replace text-glyph external arrows with a shared small, fine-line SVG that inherits the link ink.

## 2026-10-09: plain editorial links supersede external arrows

Negar still disliked arrows beside GitHub and other outbound links. Remove the icons, keep the underlined text treatment, and use “View repository” and “Visit website” for project actions. Contact links retain their recognizable service names. Existing destinations and new-tab behavior remain intact.

## 2026-10-11: clearer reading cue and outbound destinations

Display career dates without day numbers while preserving exact verified dates in career context. Refine project labels to “View on GitHub” and “Visit live site,” with stronger hover underlines and visible keyboard focus; retain plain contact labels and omit external arrows. Enlarge and center the cover opening link, pairing it with “Scroll down to begin” and a static downward cue. Keep native scrolling and the clickable introduction destination.

## 2026-10-12: experience-led introduction and accomplishment anchors

Use Negar’s latest supplied three-paragraph introduction and role descriptions, with “Hi, I’m Negar!” as the introduction heading. Replace Lienzo’s logic/data/tests diagram with 24% → 72% backend test coverage and Ozex’s authentication mark with 35% faster API responses; retain Tail’ed’s runtime visual. Phone introduction and experience copy uses visible paragraph gaps, 1.6 line height, a restrained text measure, and pretty wrapping while preserving full content and page fitting. Keep introduction stars backed by the existing server fetch. Negar confirmed that Resume links remain omitted for now.

## 2026-10-12: focused skills inventory and AI development tools

Use Negar’s supplied 31-item inventory in six categories, with the full Databases & Data and Infrastructure & Cloud labels. Add AI Development beneath Infrastructure & Cloud on the second spread; preserve the two-spread structure and existing category numbers. OpenAI Codex and Claude Code describe development tools, without adding AI/ML expertise claims.

## 2026-10-16: full-height mobile paper and visible turns during touch flings

Negar reported a bottom gap on her S24 Ultra and disappearing turns during fast touch scrolling. Fill the visible stage with dynamic viewport height while keeping small-viewport scroll runways stable. Replace touch-distance snapping with bounded visual catch-up toward the latest native position; reverse without queued turns and retain immediate explicit navigation. Keep scrolling passive. Remove job-search availability from the introduction and back cover because Negar has found a role; no new job details are public.

## 2026-10-27: a single direct index effect

Negar rejected the multi-page index journey as slow and impractical. Replace it with one 360ms paper effect directly between current and destination surfaces. No intermediate chapters are rendered. Reuse the articulated sheet with arbitrary source/destination pairing, preserve the stationary document during animation, and retain interruption, URL/focus, and reduced-motion behavior. This supersedes the earlier riffling sequence.

## 2026-10-27: paper turns for index navigation

Negar requested that choosing a chapter from the index visibly turns the paper instead of jumping. Traverse the existing physical leaves in the requested direction, omit motionless runway time, and accelerate distant trips into a short riffling sequence. Keep the selected hash stable until arrival, focus the destination afterward, and allow input/new selections to interrupt. Reduced motion, browser history, initial hashes, and inline anchors retain immediate navigation. Reconcile live reduced-motion completion with static document geometry after teardown.

## 2026-10-27: quicker balanced scroll pacing

Negar found the 1.6-second pace too slow. Set the shared full-turn pace to 850ms, phone release to 300–850ms, and phone drag travel to 0.95 viewport heights. Raise wheel/trackpad gain from 40% to 75%. Retain per-frame limits, one-leaf phone gestures, bounded pending wheel travel, and immediate reversal/braking so responsiveness improves without returning to skipped turns. Pacing tests enforce both a visible turn and a shorter completion time.

## 2026-10-27: one education heading

Negar found the large COMPUTER SCIENCE artwork repetitive beside Computer Science: Programming. Use the exact program name once as the left-page heading, with the DEC credential beneath it. Group college, location, dates, and the existing context on the right. Remove the redundant Software Development label and unused duplicate-heading styles; retain the book spread and verified facts.

## 2026-10-19: visibly slower phone and trackpad turns

Negar reported that controlled phone swipes still jumped through the physical turn and requested slower laptop trackpad scrolling too. Rate-limit displayed phone dragging rather than seeking immediately on each touch event, reduce drag gain, and replace the 160–420ms release with a 650–1600ms smooth turn. Intercept enhanced vertical wheel/trackpad input at 40% gain with one turn per 1.6 seconds and bounded pending movement; reversing discards old momentum. This extends the earlier phone-only interception exception to vertical wheel/trackpad input. Preserve instant explicit navigation, native keyboard/horizontal/zoom input, and reduced-motion/no-JS fallbacks. Validate turn duration and intermediate frames rather than only final landing positions.

## 2026-10-16: controlled phone turns and degree-first education

Native snap and bounded visual catch-up still felt uncontrolled on Negar’s phone, with a vertical shift during the first opening. Replace enhanced phone vertical panning with a finger-driven gesture limited to one adjacent leaf. Release settles or rolls back; a fresh touch brakes immediately. Permit pinch zoom and preserve native wheel/keyboard, reduced-motion, and no-JS behavior. This explicitly supersedes the earlier passive-phone/no-interception direction. Keep paper fixed from the first gesture and verify its top coordinate during actual simulated swipes. In Education, promote Computer Science: Programming over the college name while retaining the verified DEC credential.

## 2026-10-16: project hierarchy and chapter-label turns

Negar requested more visible project links and less clutter on phones, especially Canadian Tech Internships. Move the underlined actions directly below each title/category, strengthen their type and tap areas, and use full-width metrics followed by an uncropped screenshot and quieter contextual notes. Preserve original descriptions and factual evidence. Hide standalone running chapter labels during turns rather than leaving outgoing ink over incoming paper; restore the appropriate label on the settled reading page.

## 2026-10-16: Home and navigation state

Add 00 Home to the index without renumbering chapters. Keep the URL fragment aligned with the visible chapter using history replacement during scrolling, so reload no longer follows a stale explicit selection. Preserve history state and explicit navigation entries. Stretch the cover artwork and content through the dynamic viewport to address the remaining phone cover gap. Simplify the introduction Core Stack to TypeScript, Node.js, and Python; keep the full inventory in Skills. Replace “Let’s talk.” with “Get in touch.” at Negar’s request for a simpler closing.

## 2026-10-16: wide-monitor proportions and native phone page stops

Negar clarified that the thin book occurs on very wide monitors. Grow the 1240px-capped paper proportionately with viewport width/height and enlarge reading blocks where space permits, sharing geometry with the fore-edges. Visual catch-up alone does not control native phone inertia: add native CSS spread stops during phone touch input and let a new finger contact cancel outstanding visual backlog at the visible page. Preserve passive gesture moves, native wheel/keyboard behavior, immediate bookmarks, and free no-JS/reduced-motion scrolling. Chapter divider runways remain longer than reading-spread runways, so a weak swipe may stay on the current chapter page.
