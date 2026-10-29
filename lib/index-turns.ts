export function createIndexTurns(options: {
  position: () => number;
  stops: () => number[];
  transition: (from: number, to: number, progress: number) => void;
  seek: (y: number) => void;
  interrupted: () => void;
}) {
  let frame = 0;
  let destination: number | undefined;
  let complete: (() => void) | undefined;
  const cancel = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    destination = undefined;
    complete = undefined;
    delete document.documentElement.dataset.bookNavigating;
  };
  const finish = () => {
    const target = destination;
    const done = complete;
    cancel();
    if (target !== undefined) options.seek(target);
    done?.();
  };
  const interrupt = () => {
    if (destination === undefined) return;
    cancel();
    options.interrupted();
  };
  const go = (target: number, done: () => void) => {
    cancel();
    const from = options.position();
    const pageAt = (y: number) =>
      options.stops().filter((stop) => stop <= y + 1).length;
    destination = target;
    complete = done;
    if (pageAt(from) === pageAt(target)) {
      finish();
      return;
    }
    document.documentElement.dataset.bookNavigating = "true";
    window.dispatchEvent(new Event("booknavigationstart"));
    const duration = 360;
    let elapsed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed += Math.min(32, now - last);
      last = now;
      const progress = Math.min(1, elapsed / duration);
      const eased = progress * progress * (3 - 2 * progress);
      options.transition(from, target, eased);
      if (progress === 1) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  // Capture runs before phone/wheel controllers start their own gesture.
  window.addEventListener("wheel", interrupt, { passive: true, capture: true });
  window.addEventListener("touchstart", interrupt, {
    passive: true,
    capture: true,
  });
  window.addEventListener("keydown", interrupt, true);
  return {
    go,
    cancel,
    finish,
    active: () => destination !== undefined,
    destroy() {
      cancel();
      window.removeEventListener("wheel", interrupt, true);
      window.removeEventListener("touchstart", interrupt, true);
      window.removeEventListener("keydown", interrupt, true);
    },
  };
}
