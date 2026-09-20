"use client";

import { useEffect, useRef } from "react";
import { SIGNATURE_DURATION, signatureStrokes } from "@/lib/cover-signature";
import geometry from "@/lib/cover-signature-geometry.json";

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
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("scroll", interrupt);
      document.removeEventListener("visibilitychange", interrupt);
    };
    const interrupt = () => {
      if (preference.matches || window.scrollY > 8 || document.hidden) {
        entered.current = true;
        settle();
      }
    };
    preference.addEventListener("change", interrupt);
    window.addEventListener("scroll", interrupt, { passive: true });
    document.addEventListener("visibilitychange", interrupt);
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
        const paths = Array.from(
          element.querySelectorAll<SVGPathElement>("[data-signature-stroke]"),
        );
        const pen = element.querySelector<SVGGElement>(".signature-pen")!;
        // Geometry is sampled offline; neither setup nor frames measure curves.
        paths.forEach((path, index) => {
          const { length } = geometry[index];
          path.style.strokeDasharray = `${length} ${length}`;
          path.style.strokeDashoffset = `${length}`;
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
          const fade = Math.max(0, Math.min(1, (elapsed - 2250) / 230));
          element.style.setProperty("--signature-opacity", `${1 - fade}`);
          element.style.setProperty(
            "--name-opacity",
            `${elapsed < 100 ? 1 - elapsed / 100 : fade}`,
          );
          pen.style.opacity = "0";
          paths.forEach((path, index) => {
            const stroke = signatureStrokes[index];
            const progress = Math.max(
              0,
              Math.min(1, (elapsed - stroke.start) / stroke.duration),
            );
            const segment = Math.min(
              stroke.pace.length - 2,
              Math.floor(progress * (stroke.pace.length - 1)),
            );
            const local = progress * (stroke.pace.length - 1) - segment;
            // Modest speed variation, never a stop/start at each letter.
            const eased = local - Math.sin(local * Math.PI * 2) * 0.045;
            const distance =
              stroke.pace[segment] +
              (stroke.pace[segment + 1] - stroke.pace[segment]) * eased;
            path.style.strokeDashoffset = `${geometry[index].length * (1 - distance)}`;
            if (elapsed >= stroke.start && progress < 1) {
              const last = geometry[index].points.length - 1;
              const sample = distance * last;
              const lower = Math.min(last - 1, Math.floor(sample));
              const a = geometry[index].points[lower];
              const b = geometry[index].points[lower + 1];
              const fraction = sample - lower;
              pen.style.transform = `translate(${a.x + (b.x - a.x) * fraction}px, ${a.y + (b.y - a.y) * fraction}px)`;
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
        Negar
        <br />
        <em>
          Pirasteh<span className="accent cover-dot">.</span>
        </em>
      </h1>
      <svg
        className="cover-signature"
        viewBox="80 0 480 290"
        aria-hidden="true"
        focusable="false"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {signatureStrokes.map((stroke, index) => (
            <path key={index} data-signature-stroke="" d={stroke.d} />
          ))}
        </g>
        <g className="signature-pen">
          <path d="M0 0 L4 -17 L11 -21 L15 -15 L12 -8 Z" fill="var(--accent)" />
          <path d="M0 0 L8 -12" stroke="var(--ink)" strokeWidth=".8" />
        </g>
      </svg>
    </div>
  );
}
