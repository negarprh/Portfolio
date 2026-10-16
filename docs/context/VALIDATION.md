# Validation evidence and limits

Read this file only for performance claims, motion regressions, or interpreting earlier browser runs. It records evidence, not a permanent performance guarantee.

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
