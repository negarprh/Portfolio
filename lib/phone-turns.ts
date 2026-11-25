import { INPUT_TURN_MS, PHONE_DRAG_VIEWPORTS } from "./book-effects";
import { canReadFurther, readingSurface } from "./reading-scroll";

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
        previousIndex: number;
        nextIndex: number;
        partial: boolean;
        stops: number[];
        delta: number;
        dragging: boolean;
        page: HTMLElement | null;
        reading: boolean;
        readingTop: number;
      }
    | undefined;
  let suppressClickUntil = 0;
  const cancel = () => {
    const wasMoving = !!frame || !!gesture?.dragging;
    cancelAnimationFrame(frame);
    frame = 0;
    lastDragFrame = 0;
    gesture = undefined;
    if (wasMoving) delete document.documentElement.dataset.bookInputMoving;
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
    const lower = Math.max(
      0,
      stops.findLastIndex((top) => top <= position + 1),
    );
    const upper = Math.min(stops.length - 1, lower + 1);
    const partial = position > stops[lower] + 1 && lower !== upper;
    const origin =
      partial && position >= stops[upper] - options.travel() / 2
        ? upper
        : lower;
    options.seek(position);
    gesture = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      start: position,
      origin,
      previousIndex: partial ? lower : Math.max(0, origin - 1),
      nextIndex: partial ? upper : Math.min(stops.length - 1, origin + 1),
      partial,
      stops,
      delta: 0,
      dragging: false,
      page: readingSurface(event.target),
      reading: false,
      readingTop: readingSurface(event.target)?.scrollTop ?? 0,
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
      if (Math.abs(dx) > Math.abs(dy) * 1.25) {
        cancel();
        return;
      }
      if (Math.abs(dy) < Math.abs(dx) * 1.25) return;
      gesture.dragging = true;
    }
    if (event.cancelable) event.preventDefault();
    if (
      gesture.reading ||
      (gesture.delta === 0 && canReadFurther(gesture.page, dy))
    ) {
      gesture.reading = true;
      gesture.page!.scrollTop = gesture.readingTop + dy;
      return;
    }
    gesture.delta = dy;
    const { stops, origin } = gesture;
    const next = stops[gesture.nextIndex];
    const previous = stops[gesture.previousIndex];
    const span = gesture.partial
      ? next - previous
      : dy >= 0
        ? next - stops[origin]
        : stops[origin] - previous;
    const travel = Math.min(span, options.travel());
    // Skip the resting runway without moving any ink. Even a long chapter
    // divider responds immediately once a vertical drag is recognized.
    const base =
      dy >= 0 ? Math.max(gesture.start, next - travel) : gesture.start;
    // Advance flat resting space immediately, then pace only the visible turn.
    if (options.position() === gesture.start && base !== gesture.start)
      options.seek(base);
    const position =
      base + (dy / (innerHeight * PHONE_DRAG_VIEWPORTS)) * travel;
    const minimum =
      dy >= 0
        ? previous
        : Math.min(
            gesture.start,
            Math.max(
              previous,
              (gesture.partial ? next : stops[origin]) - travel,
            ),
          );
    dragTarget = Math.max(minimum, Math.min(next, position));
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
    if (current.reading) {
      suppressClickUntil = performance.now() + 400;
      return;
    }
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
      Math.abs(current.delta) >= Math.min(48, innerHeight * 0.07)
        ? Math.sign(current.delta)
        : 0;
    const target =
      current.stops[
        direction > 0
          ? current.nextIndex
          : direction < 0
            ? current.previousIndex
            : current.origin
      ];
    const from = options.position();
    const targetIndex = current.stops.indexOf(target);
    const visualTarget =
      target < from
        ? Math.min(
            from,
            Math.max(
              target,
              (current.stops[targetIndex + 1] ?? target) - options.travel(),
            ),
          )
        : target;
    if (direction && Math.abs(target - from) > 1)
      window.dispatchEvent(new Event("bookturnstart"));
    let releaseElapsed = 0;
    let releaseFrame = performance.now();
    const duration = Math.max(
      180,
      Math.min(
        INPUT_TURN_MS,
        (Math.abs(visualTarget - from) / options.travel()) * INPUT_TURN_MS,
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
        from + (visualTarget - from) * progress * progress * (3 - 2 * progress),
      );
      frame = progress < 1 ? requestAnimationFrame(tick) : 0;
      if (!frame) {
        options.seek(target);
        delete document.documentElement.dataset.bookInputMoving;
      }
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
