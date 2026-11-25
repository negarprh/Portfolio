# Validation evidence and limits

Read this file only for performance claims, motion regressions, or interpreting earlier browser runs. It records evidence, not a permanent performance guarantee.

## 2026-11-14 text-only phone guidance

Typecheck, production build, formatting and whitespace checks passed. All six targeted guidance checks passed against the production server (37.9 seconds): desktop retention, phone message bounds/dismissal/session retirement at 320×568 and 390×844, 844×390 landscape, first phone appearance after desktop guidance in the same tab, and static reduced-motion expiry. Phone screenshots at 320px and 390px were visually reviewed: a muted regular 12px “Swipe up to turn the page” message appears above the opening link without an animated icon. Captures remain under ignored `test-results/gesture-hint-*.png`. Input/turn controllers were not changed, and the full motion suite was not rerun for this scoped hint refinement. These are browser simulations, not physical phone testing.

## 2026-11-14 installed Chrome and Edge verification

Negar identified Chrome/Edge as the desktop browsers in use. The three targeted desktop checks passed in both installed Chrome 157.0.8103.51 and Edge 157.0.4341.46 (six checks, one worker, production server, automated headless input). They cover gentle/sparse input and renewed ramps, diagonal/noncancelable bypass plus keyboard release, and five cold rapid turns with bounded frame gaps, decorative workload and stylesheet teardown/restoration. The same three checks passed again in bundled Chromium. Typecheck, formatting and whitespace checks passed. No product code or animation behavior changed in this verification follow-up.

The first installed-browser run exposed a test measurement error: its 180ms wall-clock assertion included time spent waiting for four `setTimeout` callbacks to generate the tiny input events. A Chrome trace recorded the fourth event at 809.7ms and turn start at 810.2ms; the long wait preceded input delivery, rather than recognition. The corrected check records delivery separately and asserts under 50ms from the fourth 1px delta to recognition. It retains exact turn-count, momentum and renewed-input assertions. The original installed results of 581.8ms/568.7ms must not be interpreted as application recognition latency. Local reproduction/configuration lives under ignored `.context-local/installed-desktop.config.cjs` and `installed-startup-trace.json`.

The corrected supplementary Windows WebKit case passed the recognition assertion but still failed its later renewed-turn count under the software browser (one start rather than two); no full WebKit pass is claimed. The earlier 3279ms startup result below likewise included synthetic input scheduling, so it alone does not establish a Safari-specific recognition defect. Physical trackpad feel remains unverified; the installed-browser checks establish the tested automated behavior only.

## 2026-11-13 desktop smoothness follow-up

Negar reported visible desktop stutter and skipped turns after the earlier behavior suite passed. That suite established endpoints and geometry, not desktop smoothness. A cold production probe reproduced heavy sheet preparation and native-scroll bypass paths. The follow-up shares frozen CSS across faces, copies only intersecting strip ink, starts gentle input at 4 normalized pixels, and contains diagonal/noncancelable native movement. New input checks include sparse tails, coalesced bumps and gradual renewed intent during momentum.

Typecheck, production build, formatting and whitespace checks passed. All **123 production Chromium Playwright checks passed with two workers (4.4 minutes)**. The three desktop checks record actual frame samples and enforce bounded decorative DOM/style size, intermediate motion, prompt gentle intent, sparse-tail containment, renewed ramps, native-scroll bypass containment, keyboard release and generated stylesheet cleanup. Desktop/mobile intermediate frames were reviewed against before captures; layout preservation explicitly includes inline breaks, baseline-aligned siblings, resolved grid tracks and inherited text fill.

The comparable cold five-turn probes used Playwright-simulated wheel input (14px, then four 2400px gestures without preparation waits), a 1440×900 viewport, headless Chromium 153.0.8010.12 on Windows, ANGLE Vulkan SwiftShader/Subzero (software rendering, driver 5.0.0). Page-injected `requestAnimationFrame` samples and `PerformanceObserver` long-task entries were saved under ignored `.context-local/desktop-baseline.json` and `desktop-optimized-production.json`. Active samples include the frame after movement stops. The initial viewport/assets/fonts are separate from the measured input window.

| Five-turn probe | Active samples | Median interval | 95th percentile | Worst interval | Long tasks in probe | Final prepared sheet HTML / nodes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Before | 205 | 16.7ms | 233.3ms | 933.4ms | 29; longest 953ms | 33,721,184 bytes / 3,830 |
| After | 166 | 16.7ms | 16.8ms | 66.7ms | 2; longest 79ms | 90,546 bytes / 671 |

A fresh complete-book probe traversed all 16 adjacent turns to Contact, with 533 active samples: 16.7ms median, 16.8ms 95th percentile, 66.7ms worst; two long tasks of 60ms and 79ms. Its observed input window contained no layout-shift entries or browser network requests. Raw output and environment metadata are in `.context-local/desktop-complete-book-isolated.json`; the earlier complete-book probe ran alongside a supplementary WebKit check and is kept separately. Network/layout-shift telemetry was not collected in the original comparable five-turn baseline, so no before/after claim is made for those metrics.

Supplementary Windows WebKit checks passed diagonal/noncancelable bypass containment but failed the cold 1px-input startup limit (3279ms versus the check's 180ms limit). This is an unresolved timing limit in that software-rendered browser; it must not be described as Safari smoothness validation. Real trackpads, mouse wheels, macOS Safari and physical phones remain unverified. These short simulated probes show a large reduction in the measured rendering bottleneck, not flawless motion on every machine or a guaranteed frame rate.

## 2026-11-13 gesture recognition and temporary guidance

Typecheck, production build, formatting and whitespace checks passed. The final production Chromium run passed all 120 Playwright checks with one worker (9.2 minutes). Eleven gesture/guidance checks cover single-notch completion, long continuous trackpad traces and tails, immediate renewed intent, wheel units/exclusions/reversal, partial-leaf resumption, phone/tablet touch axis filtering, cancellation, recontact, orientation, oversized-content reading before navigation, and guidance placement/lifetime/session retirement/reduced motion. Existing navigation/history, no-JS, accessibility, complete-copy fitting, bidirectional curvature/shadows, tall-phone and wide-monitor checks also passed.

The baseline browser check reproduced the root issue: a 100px wheel notch moved only 75px toward the first 900px stop, with no visible turn. Gesture-boundary tests additionally exposed main-thread snapshot stalls being mistaken for input silence. The new boundary clock excludes stalled frames, independently of animation completion. These are behavioral observations, not before/after frame-rate measurements.

Desktop and phone material/turn sequences were visually reviewed at 320px, 390px, 412px and 1440px. Guidance was reviewed at 320×568, 390×844, 844×390 and 1440×900, including the compact landscape cover. Captures remain under ignored `test-results/phone-depth-after/`, `test-results/gesture-hint-*.png` and `.context-local/gesture-review/`. The mobile reverse-ink comparison now waits for gesture completion, samples after the articulated hinge crosses, and excludes intentional cast/contact shadows while comparing ink; the shadows remain in production and have separate geometry/material coverage.

A supplementary WebKit 26.6 Windows run initially passed six of nine checks: two exceeded the 5-second settling limit, and the mobile guidance check attempted unsupported mobile wheel injection. The mobile guidance test now uses tapping. A fresh production WebKit correctness smoke check with a 20-second settling allowance passed six forward/reverse adjacent stops, continuous-gesture containment and immediate renewed intent. Mobile WebKit emulation also passed guidance copy, synthetic DOM touch forward/reverse/horizontal rejection, dismissal and reduced-motion teardown. This does not establish WebKit pacing or native Safari touch delivery. The broader WebKit suite is not claimed to pass.

Real mouse-wheel/Mac or Windows trackpad input, physical iOS Safari and Android Chrome, and actual browser-chrome/safe-area behavior remain unverified. No new hardware trace or frame-rate claim is made.

## 2026-11-04 personalized illustration revision

After Negar rejected the botanical emphasis, all six drawings were replaced with software/personal studies and Contact changed to a small horizontal composition. Typecheck and production build passed. All 30 targeted production checks passed (the nine illustration checks, complete viewport-fitting matrix, Introduction/Contact refinement checks and direct/interrupted index turns). The prior full-suite result below belongs to the first collection; the full suite was not rerun for this SVG/Contact-placement revision. Fresh four-size review captures and edge-case screenshots are under ignored `.context-local/chapter-illustrations/personal/`. No motion code or content was changed.

## 2026-11-04 first illustrated collection

Typecheck and production build passed. The full production Playwright run passed 98 of 99 checks. The 412px simulated held-swipe check failed its fixed 700ms catch-up / 120ms stationary assertion once (scroll position changed from 223 to 343); the unchanged check then passed three consecutive isolated repetitions. No motion implementation or timing assertion was changed. This is a timing-sensitive remaining test uncertainty, not evidence of a guaranteed frame rate.

All nine new illustration checks passed: text clearance, page bounds and six-chapter coverage at 320×568, 390×844, 768×1024, 844×390 and 1440×900, plus no-JS/reduced-motion clearance at 320px and 1440px. Production screenshots of every reading spread and the illustrated openings were reviewed at four portrait/desktop sizes, followed by landscape and native-fallback captures. The landscape corner/Projects placements and native-divider flow were refined from rendered evidence. Captures and fitting measurements remain under ignored `.context-local/chapter-illustrations/final/`. These are Chromium simulations, not physical-device or new performance measurements.

## Historical browser evidence (before the stationary stage)

The finalized 32ms scroll response was traced in Chromium with simulated wheel and trackpad-style input:

- SwiftShader/software-rendered runs measured roughly 16.7ms median frame intervals, no long tasks, no layout shifts, and no transition-time network requests. The wheel run included one 33.3ms interval.
- A later D3D11 hardware-accelerated Chromium check also measured roughly 16.7ms median intervals, with one 33.4ms interval in each wheel and trackpad run. It reported no long tasks, layout shifts, or transition-time requests.
- The review video used hardware acceleration.

These runs support the implementation under the tested conditions only. Input was simulated even in hardware-accelerated Chromium. Do not describe the evidence as physical mouse/trackpad testing, guaranteed 60fps, zero dropped frames, or proof across all devices.

## What the test suite establishes

- Forward and reverse progression follow the same scroll-driven timelines.
- Rapid reversal settles toward current scroll position rather than completing a queued turn.
- No-JS content remains in native document order with working anchors and `<details>` navigation.
- Live reduced-motion changes remove enhancement layers and restore them without duplicates.
- Original reading pages remain opaque, untransformed, and stationary. Inert snapshots place ink on the curved sheet; forward/reverse samples check identical geometry and fully exposed endpoints.
- Desktop and mobile checks sample multiple transition positions and endpoints.
- Full original experience and project copy is checked against the content data. The fitting matrix includes 320×568, 360×640, 390×844, 430×932, 384×824, 412×915, 412×1000, 430×960, 768×1024, 844×390, and 1440×900; enhanced pages have no internal vertical scrolling.
- Tall-phone regression checks cover viewport-height changes and a coalesced touch-scroll jump beyond one screen, checking intermediate turn positions and reversal. Touch input uses Chromium CDP; this is not physical S24 Ultra testing. Desktop emulation does not reproduce the phone browser’s expanding/retracting address bar exactly; its on-device appearance remains to be confirmed.
- Native page-stop coverage dispatches fast CDP touch gestures across reading pages in both directions and tests touch-down braking. The fixture waits for warmed sheet snapshots and reads live destinations; reloading mid-gesture setup races browser scroll restoration and is not a valid fixed-position fixture. Chapter divider runways are longer, so a weaker swipe can stay on the current page.
- Wide-monitor checks cover centered book proportions and fore-edge alignment at 1920×1080, 2560×1440, 3440×1440, 3840×2160, and 5120×1440. The expanded fitting matrix also checks full reading content at the first four sizes.

Screenshots at sampled positions do not prove every intermediate frame. The stronger invariants are identical fixed interior bounds, continuous underlying surfaces, and reversible sheet geometry. Historical frame measurements above do not establish performance of the new articulated stage.

## How to make a new performance claim

2026-10-16 mobile regression run: production typecheck/build passed; all 59 Playwright tests passed. After resetting the visual coordinate on motion reinitialization, the final production build passed eight focused document, touch-swipe, tall-viewport, fling/reversal, and reduced-motion restoration checks. Desktop and 384×824 / 412×915 / 412×1000 screenshots were visually reviewed. This is regression evidence, not a frame-rate measurement or physical-device result.

2026-10-16 wide-monitor/native-stop follow-up: typecheck/build and the 70-test full suite passed. The final contact-runway height fix passed 16 focused production checks, including the visible/small-viewport mismatch case. Native-fling and brake checks also passed three consecutive repetitions after fixing the test's reload/scroll-restoration race. Wide-monitor introduction captures at 3440×1440 and 3840×2160 were visually reviewed. Physical Samsung input remains unverified.

Record browser/version, renderer, viewport, input source, trace method, sample size, median and worst intervals, long tasks, layout shifts, network activity, and whether hardware was physical or simulated. Compare against an unchanged baseline and preserve raw output under ignored `test-results/`. If those details are absent, describe the result as a visual or automated regression check rather than a performance measurement.
