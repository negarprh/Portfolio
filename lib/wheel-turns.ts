import { INPUT_TURN_MS } from "./book-effects";
import { canReadFurther, readingSurface } from "./reading-scroll";

export function createWheelTurns(options: {
  enabled: () => boolean;
  position: () => number;
  stops: () => number[];
  travel: () => number;
  seek: (y: number) => void;
}) {
  let frame = 0;
  let destination: number | undefined;
  let lower = 0;
  let upper = 0;
  let turningDirection = 0;
  let boundaryFrame = 0;
  let boundaryTime = 0;
  let silence = 0;
  let previous = 0;
  let peak = 0;
  let accumulated = 0;
  let direction = 0;
  let consumed = false;
  let decaying = false;
  let reading: HTMLElement | null = null;
  let lastEvent = -Infinity;
  let valley = Infinity;
  let renewedDistance = 0;
  let renewedSamples = 0;
  const intent = 4;
  const stopAnimation = () => {
    const wasMoving = destination !== undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    destination = undefined;
    if (wasMoving) delete document.documentElement.dataset.bookInputMoving;
  };
  const cancel = () => {
    stopAnimation();
    cancelAnimationFrame(boundaryFrame);
    boundaryFrame = 0;
    previous = peak = accumulated = direction = 0;
    consumed = decaying = false;
    reading = null;
    lastEvent = -Infinity;
    valley = Infinity;
    renewedDistance = renewedSamples = 0;
  };
  const watchBoundary = (now: number) => {
    // Snapshot preparation or a slow device can block the main thread. Such a
    // stall is not a pause in the user's gesture; count responsive frames only.
    silence += Math.min(32, now - boundaryTime);
    boundaryTime = now;
    boundaryFrame = silence < 220 ? requestAnimationFrame(watchBoundary) : 0;
  };
  const retainInput = (now: number) => {
    silence = 0;
    if (!boundaryFrame) {
      boundaryTime = now;
      boundaryFrame = requestAnimationFrame(watchBoundary);
    }
  };
  const holdScroll = () => {
    if (!options.enabled() || (!boundaryFrame && destination === undefined))
      return;
    // Some wheel streams become noncancelable; diagonal native scrolling also
    // carries a vertical component. Never let either bypass the turn timeline.
    const expected = options.position();
    if (Math.abs(scrollY - expected) > 0.5) options.seek(expected);
  };
  const turn = (nextDirection: number) => {
    const stops = options.stops();
    if (!stops.length) return;
    const current = options.position();
    const reversing =
      destination !== undefined && turningDirection !== nextDirection;
    // Never queue a second leaf. Reversal retraces the current physical sheet.
    if (destination !== undefined && !reversing) return;
    let index: number;
    if (!reversing) {
      const origin = Math.max(
        0,
        stops.findLastIndex((y) => y <= current + 1),
      );
      const partial = origin < stops.length - 1 && current > stops[origin] + 1;
      index = partial
        ? nextDirection > 0
          ? origin + 1
          : origin
        : Math.max(0, Math.min(stops.length - 1, origin + nextDirection));
      lower = partial ? origin : Math.min(origin, index);
      upper = partial ? origin + 1 : Math.max(origin, index);
    } else index = nextDirection > 0 ? upper : lower;
    const target = stops[index];
    stopAnimation();
    if (Math.abs(target - current) < 1) return;
    destination = target;
    turningDirection = nextDirection;
    const travel = options.travel();
    // Skip only invisible resting runway; chapter dividers respond immediately.
    const from =
      nextDirection > 0 ? Math.max(current, target - travel) : current;
    const visualTarget =
      target < from
        ? Math.min(from, Math.max(target, stops[index + 1] - travel))
        : target;
    options.seek(from);
    window.dispatchEvent(new Event("bookturnstart"));
    document.documentElement.dataset.bookInputMoving = "true";
    const duration = Math.max(
      180,
      Math.min(
        INPUT_TURN_MS,
        (Math.abs(visualTarget - from) / travel) * INPUT_TURN_MS,
      ),
    );
    let elapsed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!options.enabled()) {
        cancel();
        return;
      }
      elapsed += Math.min(32, now - last);
      last = now;
      const p = Math.min(1, elapsed / duration);
      options.seek(from + (visualTarget - from) * p * p * (3 - 2 * p));
      if (p < 1) frame = requestAnimationFrame(tick);
      else {
        options.seek(target);
        stopAnimation();
      }
    };
    frame = requestAnimationFrame(tick);
  };
  const wheel = (event: WheelEvent) => {
    if (
      !options.enabled() ||
      event.ctrlKey ||
      event.metaKey ||
      (event.target as Element).closest(
        ".book-index, input, textarea, select, [contenteditable]",
      )
    )
      return;
    const now = performance.now();
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
      // Horizontal scrolling remains native. Hold only the book's vertical
      // coordinate if a diagonal gesture also makes the document scroll.
      if (event.deltaY) retainInput(now);
      return;
    }
    if (event.cancelable) event.preventDefault();
    const unit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = event.deltaY * unit;
    const magnitude = Math.abs(delta);
    const nextDirection = Math.sign(delta);
    // WheelEvent has no gesture phase. Silence, reversal, or a renewed impulse
    // starts intent; finishing an animation never rearms an inertial tail.
    const reversed = nextDirection !== direction && magnitude >= intent;
    const floor = Math.min(valley, previous);
    if (
      consumed &&
      decaying &&
      magnitude >= previous &&
      magnitude > floor * 1.8
    ) {
      renewedDistance += magnitude;
      renewedSamples++;
    } else renewedDistance = renewedSamples = 0;
    const impulse =
      consumed &&
      destination === undefined &&
      decaying &&
      floor <= Math.max(4, peak * 0.1) &&
      (magnitude >= Math.max(16, floor * 4, peak * 0.45) ||
        (renewedSamples >= 2 && renewedDistance >= Math.max(8, peak * 0.2)));
    const residualTail =
      consumed &&
      !reading &&
      decaying &&
      nextDirection === direction &&
      magnitude <= previous &&
      now - lastEvent < 650;
    if (
      (!boundaryFrame && !residualTail) ||
      !direction ||
      reversed ||
      impulse
    ) {
      accumulated = peak = 0;
      consumed = decaying = false;
      reading = null;
      direction = nextDirection;
      valley = Infinity;
      renewedDistance = renewedSamples = 0;
    }
    lastEvent = now;
    retainInput(now);
    if (magnitude < previous && magnitude < peak * 0.7) decaying = true;
    if (decaying) valley = Math.min(valley, magnitude);
    peak = Math.max(peak, magnitude);
    previous = magnitude;
    if (direction !== nextDirection) return;
    const surface = reading ?? readingSurface(event.target);
    if (
      reading ||
      (!consumed && destination === undefined && canReadFurther(surface, delta))
    ) {
      reading = surface;
      if (reading) reading.scrollTop += delta;
      consumed = true;
      return;
    }
    accumulated += magnitude;
    if (consumed || accumulated < intent) return;
    consumed = true;
    turn(nextDirection);
  };
  window.addEventListener("wheel", wheel, { passive: false });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);
  window.addEventListener("scroll", holdScroll, { passive: true });
  document.addEventListener("visibilitychange", cancel);
  return {
    cancel,
    destroy() {
      cancel();
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("scroll", holdScroll);
      document.removeEventListener("visibilitychange", cancel);
    },
  };
}
