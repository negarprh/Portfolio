import { INPUT_TURN_MS, WHEEL_INPUT_GAIN } from "./book-effects";

/** Slow vertical wheel/trackpad input before it reaches the physical page. */
export function createWheelTurns(options: {
  enabled: () => boolean;
  position: () => number;
  travel: () => number;
  seek: (y: number) => void;
}) {
  let frame = 0;
  let target = 0;
  let direction = 0;
  let last = 0;
  const cancel = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    direction = 0;
    delete document.documentElement.dataset.bookInputMoving;
  };
  const tick = (now: number) => {
    if (!options.enabled()) {
      cancel();
      return;
    }
    const elapsed = last ? Math.min(32, now - last) : 16;
    last = now;
    const current = options.position();
    const distance = target - current;
    const cap = Math.max(1, (options.travel() * elapsed) / INPUT_TURN_MS);
    const step = Math.min(Math.abs(distance), cap);
    options.seek(current + Math.sign(distance) * step);
    if (Math.abs(target - options.position()) <= 1) {
      options.seek(target);
      cancel();
    } else frame = requestAnimationFrame(tick);
  };
  const wheel = (event: WheelEvent) => {
    if (
      !options.enabled() ||
      event.ctrlKey ||
      event.metaKey ||
      !event.cancelable ||
      Math.abs(event.deltaX) >= Math.abs(event.deltaY) ||
      (event.target as Element).closest(
        ".book-index, input, textarea, select, [contenteditable]",
      )
    )
      return;
    event.preventDefault();
    const current = options.position();
    const nextDirection = Math.sign(event.deltaY);
    if (!frame || direction !== nextDirection) target = current;
    direction = nextDirection;
    const unit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const max = document.documentElement.scrollHeight - innerHeight;
    // Keep at most one turn of pending travel; reversing discards old momentum.
    target = Math.round(
      Math.max(
        0,
        Math.min(
          max,
          Math.max(
            current - options.travel(),
            Math.min(
              current + options.travel(),
              target + event.deltaY * unit * WHEEL_INPUT_GAIN,
            ),
          ),
        ),
      ),
    );
    document.documentElement.dataset.bookInputMoving = "true";
    if (!frame) frame = requestAnimationFrame(tick);
  };
  window.addEventListener("wheel", wheel, { passive: false });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);
  return {
    cancel,
    destroy() {
      cancel();
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    },
  };
}
