/** A phone swipe owns one leaf; browser inertia never runs ahead of the book. */
export function createPhoneTurns(options: {
  enabled: () => boolean;
  stops: () => number[];
  travel: () => number;
  position: () => number;
  seek: (y: number) => void;
}) {
  let frame = 0;
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
    gesture = undefined;
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
    const position = base + (dy / (innerHeight * 0.65)) * travel;
    options.seek(Math.max(previous, Math.min(next, position)));
  };
  const finish = (event: TouchEvent) => {
    if (!gesture) return;
    const current = gesture;
    gesture = undefined;
    if (
      !current.dragging &&
      Math.abs(options.position() - current.stops[current.origin]) < 1
    )
      return;
    if (current.dragging) suppressClickUntil = performance.now() + 400;
    const direction =
      event.type !== "touchcancel" &&
      Math.abs(current.delta) >= Math.min(60, innerHeight * 0.08)
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
    const began = performance.now();
    const duration = Math.max(
      160,
      Math.min(420, (Math.abs(target - from) / innerHeight) * 420),
    );
    const tick = (now: number) => {
      if (!options.enabled()) {
        cancel();
        return;
      }
      const progress = Math.min(1, (now - began) / duration);
      options.seek(from + (target - from) * (1 - Math.pow(1 - progress, 3)));
      frame = progress < 1 ? requestAnimationFrame(tick) : 0;
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
