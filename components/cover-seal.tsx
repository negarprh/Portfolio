"use client";
import { useEffect, useRef } from "react";

export function CoverSeal() {
  const seal = useRef<HTMLSpanElement>(null);
  const shadow = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  useEffect(() => {
    let disposed = false;
    let animation: Animation | undefined;
    let shadowAnimation: Animation | undefined;
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
      if (preference.matches) {
        animation?.cancel();
        shadowAnimation?.cancel();
      }
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
          { transform: "translateY(-12px) scale(1.38)", opacity: 0 },
          {
            transform: "translateY(-8px) scale(1.28)",
            opacity: 1,
            offset: 0.2,
          },
          { transform: "translateY(1px) scale(.94)", opacity: 1, offset: 0.7 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 1250, easing: "cubic-bezier(.2,.7,.25,1)" },
      );
      shadowAnimation = shadow.current?.animate(
        [
          { transform: "translateY(8px) scale(1.1)", opacity: 0 },
          {
            transform: "translateY(6px) scale(1.05)",
            opacity: 0.9,
            offset: 0.2,
          },
          { transform: "translateY(0) scale(.92)", opacity: 0.15, offset: 0.7 },
          { transform: "translateY(0) scale(1)", opacity: 0 },
        ],
        { duration: 1250, easing: "cubic-bezier(.2,.7,.25,1)" },
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
      shadowAnimation?.cancel();
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <span ref={seal} className="cover-seal" aria-hidden="true">
      <span ref={shadow} className="seal-press-shadow" />
      <span className="seal-monogram">NP</span>
    </span>
  );
}
