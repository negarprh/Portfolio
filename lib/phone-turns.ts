import { INPUT_TURN_MS, PHONE_DRAG_VIEWPORTS } from "./book-effects";

/** A phone swipe owns one leaf; both dragging and release have bounded speed. */
export function createPhoneTurns(options: {
  enabled: () => boolean;
  stops: () => number[];
  travel: () => number;
  position: () => number;
  seek: (y: number) => void;
}) {
  let frame = 0;
  let dragTarget = 0;
  let lastDragFrame = 0;
  let gesture:
    | {
        x: number;
        y: number;
        start: number;
        origin: number;
        stops: number[];
        delta: number;
        dragging: boolean;
      }
    | undefined;
  let suppressClickUntil = 0;
  const cancel = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastDragFrame = 0;
    gesture = undefined;
    delete document.documentElement.dataset.bookInputMoving;
  };
  const start = (event: TouchEvent) => {
    if (
      !options.enabled() ||
      event.touches.length !== 1 ||
      (event.target as Element).closest(
        ".book-index, input, textarea, select, [contenteditable]",
      )
    ) {
      cancel();
      return;
    }
    cancel();
    suppressClickUntil = 0;
    const stops = options.stops();
    if (!stops.length) return;
    const position = options.position();
    const origin = stops.reduce(
      (best, value, i) =>
        Math.abs(value - position) < Math.abs(stops[best] - position)
          ? i
          : best,
      0,
    );
    options.seek(position);
    gesture = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      start: position,
      origin,
      stops,
      delta: 0,
      dragging: false,
    };
  };
  const move = (event: TouchEvent) => {
    if (!gesture) return;
    if (event.touches.length !== 1 || !options.enabled()) {
      cancel();
      return;
    }
    const dx = gesture.x - event.touches[0].clientX;
    const dy = gesture.y - event.touches[0].clientY;
    if (!gesture.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        cancel();
        return;
      }
      gesture.dragging = true;
    }
    if (event.cancelable) event.preventDefault();
    gesture.delta = dy;
    const { stops, origin } = gesture;
    const next = stops[Math.min(stops.length - 1, origin + 1)];
    const previous = stops[Math.max(0, origin - 1)];
    const span = dy >= 0 ? next - stops[origin] : stops[origin] - previous;
    const travel = Math.min(span, options.travel());
    // Skip the resting runway without moving any ink. Even a long chapter
    // divider responds immediately once a vertical drag is recognized.
    const base =
      dy >= 0 ? Math.max(gesture.start, next - travel) : gesture.start;
    const position =
      base + (dy / (innerHeight * PHONE_DRAG_VIEWPORTS)) * travel;
    dragTarget = Math.max(previous, Math.min(next, position));
    document.documentElement.dataset.bookInputMoving = "true";
    if (!frame) {
      const follow = (now: number) => {
        const elapsed = lastDragFrame ? Math.min(32, now - lastDragFrame) : 16;
        lastDragFrame = now;
        const distance = dragTarget - options.position();
        const step = Math.max(1, (options.travel() * elapsed) / INPUT_TURN_MS);
        options.seek(
          options.position() +
            Math.sign(distance) * Math.min(Math.abs(distance), step),
        );
        frame =
          Math.abs(dragTarget - options.position()) > 1
            ? requestAnimationFrame(follow)
            : 0;
        if (!frame) lastDragFrame = 0;
      };
      frame = requestAnimationFrame(follow);
    }
  };
  const finish = (event: TouchEvent) => {
    if (!gesture) return;
    const current = gesture;
    gesture = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    lastDragFrame = 0;
    if (
      !current.dragging &&
      Math.abs(options.position() - current.stops[current.origin]) < 1
    ) {
      delete document.documentElement.dataset.bookInputMoving;
      return;
    }
    if (current.dragging) suppressClickUntil = performance.now() + 400;
    const direction =
      event.type !== "touchcancel" &&
      Math.abs(current.delta) >= Math.min(90, innerHeight * 0.12)
        ? Math.sign(current.delta)
        : 0;
    const target =
      current.stops[
        Math.max(
          0,
          Math.min(current.stops.length - 1, current.origin + direction),
        )
      ];
    const from = options.position();
    let releaseElapsed = 0;
    let releaseFrame = performance.now();
    const duration = Math.max(
      300,
      Math.min(
        INPUT_TURN_MS,
        (Math.abs(target - from) / options.travel()) * INPUT_TURN_MS,
      ),
    );
    const tick = (now: number) => {
      if (!options.enabled()) {
        cancel();
        return;
      }
      // A late frame must not skip the middle of the leaf on a slower phone.
      releaseElapsed += Math.min(32, now - releaseFrame);
      releaseFrame = now;
      const progress = Math.min(1, releaseElapsed / duration);
      document.documentElement.dataset.bookInputMoving = "true";
      options.seek(
        from + (target - from) * progress * progress * (3 - 2 * progress),
      );
      frame = progress < 1 ? requestAnimationFrame(tick) : 0;
      if (!frame) delete document.documentElement.dataset.bookInputMoving;
    };
    frame = requestAnimationFrame(tick);
  };
  const click = (event: MouseEvent) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("touchstart", start, { passive: true });
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", finish);
  window.addEventListener("touchcancel", finish);
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("keydown", cancel);
  document.addEventListener("click", click, true);
  return {
    cancel,
    destroy() {
      cancel();
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", finish);
      window.removeEventListener("touchcancel", finish);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("keydown", cancel);
      document.removeEventListener("click", click, true);
    },
  };
}
