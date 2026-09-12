"use client";
import { useEffect, useRef } from "react";

export function CoverSeal() {
  const seal = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  useEffect(() => {
    let disposed = false;
    let animation: Animation | undefined;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!preference.matches && !entered.current)
      seal.current?.classList.add("seal-pending");
    let removeLoad = () => {};
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const done = () => resolve();
            window.addEventListener("load", done, { once: true });
            removeLoad = () => window.removeEventListener("load", done);
          });
    const stop = () => {
      if (preference.matches) animation?.cancel();
    };
    Promise.all([document.fonts.ready, loaded]).then(() => {
      if (disposed) return;
      seal.current?.classList.remove("seal-pending");
      document.documentElement.dataset.coverReady = "true";
      if (entered.current) return;
      entered.current = true;
      if (preference.matches || !seal.current) return;
      animation = seal.current.animate(
        [
          { transform: "scale(1.14)", opacity: 0 },
          { transform: "scale(.985)", opacity: 1, offset: 0.75 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 850, easing: "cubic-bezier(.2,.7,.25,1)" },
      );
      preference.addEventListener("change", stop);
      animation.finished
        .catch(() => {})
        .finally(() => preference.removeEventListener("change", stop));
    });
    return () => {
      disposed = true;
      seal.current?.classList.remove("seal-pending");
      removeLoad();
      animation?.cancel();
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <span ref={seal} className="cover-seal" aria-hidden="true">
      <span>NP</span>
    </span>
  );
}
