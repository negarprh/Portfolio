# Validation evidence and limits

Read this file only for performance claims, motion regressions, or interpreting earlier browser runs. It records evidence, not a permanent performance guarantee.

## Existing browser evidence

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
- Interior ink remains in original DOM, opaque and untransformed, with no cloned paragraphs; clipping follows the existing eased leaf rotation. Forward/reverse samples check reversible geometry and fully exposed endpoints.
- Desktop and mobile checks sample multiple transition positions and endpoints.

Screenshots at sampled positions do not prove every intermediate frame. Structural separation of reading ink from turning paper is the stronger invariant.

## How to make a new performance claim

Record browser/version, renderer, viewport, input source, trace method, sample size, median and worst intervals, long tasks, layout shifts, network activity, and whether hardware was physical or simulated. Compare against an unchanged baseline and preserve raw output under ignored `test-results/`. If those details are absent, describe the result as a visual or automated regression check rather than a performance measurement.
