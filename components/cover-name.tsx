"use client";

import { useEffect, useRef } from "react";
const SIGNATURE_DURATION = 2480;

export function CoverName() {
  const root = useRef<HTMLDivElement>(null);
  const entered = useRef(false);

  useEffect(() => {
    const element = root.current!;
    const cover = element.closest<HTMLElement>(".cover")!;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let frame = 0;
    let removeLoad = () => {};
    const settle = () => {
      cancelAnimationFrame(frame);
      delete cover.dataset.signing;
      element.dataset.signature = "complete";
      element.style.removeProperty("--signature-opacity");
      element.style.removeProperty("--name-opacity");
      element
        .querySelectorAll<HTMLElement>("[data-name-line]")
        .forEach((line) => line.style.removeProperty("clip-path"));
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("scroll", interrupt);
      window.removeEventListener("booknavigationstart", interrupt);
      document.removeEventListener("visibilitychange", interrupt);
      window.removeEventListener("resize", settle);
    };
    const interrupt = () => {
      if (
        preference.matches ||
        window.scrollY > 8 ||
        document.hidden ||
        document.documentElement.dataset.bookNavigating
      ) {
        entered.current = true;
        settle();
      }
    };
    preference.addEventListener("change", interrupt);
    window.addEventListener("scroll", interrupt, { passive: true });
    window.addEventListener("booknavigationstart", interrupt);
    document.addEventListener("visibilitychange", interrupt);
    window.addEventListener("resize", settle, { once: true });
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const done = () => resolve();
            window.addEventListener("load", done, { once: true });
            removeLoad = () => window.removeEventListener("load", done);
          });

    Promise.all([document.fonts.ready, loaded])
      .then(() => {
        if (disposed || entered.current) return;
        entered.current = true;
        if (preference.matches || window.scrollY > 8 || document.hidden) {
          settle();
          return;
        }
        const lines = Array.from(
          element.querySelectorAll<HTMLElement>("[data-name-line]"),
        );
        const pen = element.querySelector<SVGGElement>(".signature-pen")!;
        const svg = element.querySelector<SVGSVGElement>(".cover-signature")!;
        const bounds = element.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        const metrics = lines.map((line) => {
          const rect = line.getBoundingClientRect();
          return {
            x: rect.left - bounds.left,
            y: rect.top - bounds.top,
            width: rect.width,
            height: rect.height,
          };
        });
        let start: number | undefined;
        const draw = (now: number) => {
          if (disposed) return;
          if (start === undefined) {
            start = now;
            element.dataset.signature = "writing";
            cover.dataset.signing = "true";
          }
          const elapsed = now - start;
          if (elapsed >= SIGNATURE_DURATION) {
            settle();
            return;
          }
          pen.style.opacity = "0";
          lines.forEach((line, index) => {
            const begin = index === 0 ? 100 : 1050;
            const duration = index === 0 ? 850 : 1200;
            const progress = Math.max(
              0,
              Math.min(1, (elapsed - begin) / duration),
            );
            line.style.clipPath = `inset(-20% ${(1 - progress) * 100}% -20% -2%)`;
            if (elapsed >= begin && progress < 1) {
              const metric = metrics[index];
              pen.style.transform = `translate(${metric.x + metric.width * progress}px, ${metric.y + metric.height * (0.55 + Math.sin(progress * Math.PI * (index === 0 ? 10 : 16)) * 0.2)}px)`;
              pen.style.opacity = "1";
            }
          });
          frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
      })
      .catch(settle);

    return () => {
      disposed = true;
      settle();
      removeLoad();
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("scroll", interrupt);
      document.removeEventListener("visibilitychange", interrupt);
    };
  }, []);

  return (
    <div className="cover-name" ref={root}>
      <h1 id="cover-title">
        <span className="cover-name-line" data-name-line="">
          Negar
        </span>
        <br />
        <em>
          <span className="cover-name-line" data-name-line="">
            Pirasteh<span className="accent cover-dot">.</span>
          </span>
        </em>
      </h1>
      <svg
        className="cover-signature"
        viewBox="80 0 480 290"
        aria-hidden="true"
        focusable="false"
      >
        <g className="signature-pen">
          <path d="M0 0 L4 -17 L11 -21 L15 -15 L12 -8 Z" fill="var(--accent)" />
          <path d="M0 0 L8 -12" stroke="var(--ink)" strokeWidth=".8" />
        </g>
      </svg>
    </div>
  );
}
