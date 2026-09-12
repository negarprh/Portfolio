"use client";
import { useEffect } from "react";
import { turnPage, TURN_DURATION } from "@/lib/book-effects";

/** Enhancement only: native links and the full document remain usable without JS. */
export function BookMotion() {
  useEffect(() => {
    const index = document.querySelector<HTMLDetailsElement>("#book-index");
    const summary = index?.querySelector("summary");
    const closeIndex = (event: Event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link || !index) return;
      index.open = false;
      const target = document.querySelector<HTMLElement>(link.hash);
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    };
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape" && index?.open) {
        index.open = false;
        summary?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (index?.open && !index.contains(event.target as Node))
        index.open = false;
    };
    index?.addEventListener("click", closeIndex);
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            index?.querySelectorAll("a").forEach((link) => {
              if (link.hash === `#${entry.target.id}`)
                link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
    );
    document
      .querySelectorAll(
        "main > section[id], .book-opening > section[id], main > footer[id]",
      )
      .forEach((section) => activeObserver.observe(section));

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timelines = new Map<Element, Animation[]>();
    const cover = document.querySelector<HTMLElement>(".cover");
    const coverShadow = document.querySelector<HTMLElement>(
      ".cover-opening-shadow",
    );
    const backCover = document.querySelector<HTMLElement>(".back-cover");
    const stacks = document.querySelector<HTMLElement>(".page-stacks");
    const leftStack = document.querySelector<HTMLElement>(".page-stack-left");
    const rightStack = document.querySelector<HTMLElement>(".page-stack-right");
    let boundaries: { element: HTMLElement; top: number }[] = [];
    let frame = 0;
    let coverHeight = window.innerHeight;
    let bookLength = 1;
    let backTop = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const measure = () => {
      if (preference.matches) return;
      coverHeight = cover?.offsetHeight || window.innerHeight;
      bookLength = Math.max(
        1,
        document.documentElement.scrollHeight -
          coverHeight -
          window.innerHeight,
      );
      backTop = (backCover?.getBoundingClientRect().top || 0) + window.scrollY;
      boundaries = Array.from(
        document.querySelectorAll<HTMLElement>("[data-boundary]"),
      ).map((element) => ({
        element,
        // Measure the unpinned wrapper, not the sticky divider's moving rectangle.
        top:
          (
            element.closest(".chapter-opening") || element
          ).getBoundingClientRect().top + window.scrollY,
      }));
      scroll();
    };
    const update = () => {
      frame = 0;
      if (preference.matches) return;
      const y = window.scrollY;
      const coverProgress = clamp(y / coverHeight);
      if (cover)
        cover.style.transform = `perspective(2200px) rotateY(${-180 * coverProgress}deg)`;
      if (coverShadow) {
        coverShadow.style.transform = `translateX(${-100 * coverProgress}%) scaleX(${1 - 0.6 * Math.sin(Math.PI * coverProgress)})`;
        coverShadow.style.opacity = String(
          0.7 * Math.sin(Math.PI * coverProgress),
        );
      }
      // One paused timeline per leaf. Position is the only clock: no queues,
      // direction flags, accumulated deltas, or time-based completion callbacks.
      const travel = window.innerHeight * 0.85;
      for (const { element, top } of boundaries) {
        const progress = clamp((y - top + travel) / travel);
        let animations = timelines.get(element);
        if (!animations && progress > 0) {
          animations = turnPage(element);
          timelines.set(element, animations);
        }
        animations?.forEach((animation) => {
          animation.currentTime = progress * TURN_DURATION;
        });
      }
      const progress = clamp((y - coverHeight) / bookLength);
      if (stacks)
        stacks.style.opacity = String(
          clamp((y - coverHeight + 180) / 180) *
            (1 -
              clamp((y - backTop + window.innerHeight) / window.innerHeight)),
        );
      if (leftStack)
        leftStack.style.transform = `scaleX(${0.16 + progress * 0.84})`;
      if (rightStack)
        rightStack.style.transform = `scaleX(${1 - progress * 0.84})`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const clear = () => {
      timelines.forEach((animations) =>
        animations.forEach((animation) => animation.cancel()),
      );
      timelines.clear();
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
      frame = 0;
      delete document.documentElement.dataset.bookEnhanced;
      [cover, coverShadow, stacks, leftStack, rightStack].forEach((element) => {
        if (element) {
          element.style.transform = "";
          element.style.opacity = "";
        }
      });
      document
        .querySelectorAll("[data-outgoing]")
        .forEach((container) => container.replaceChildren());
    };
    const configureMotion = () => {
      clear();
      if (preference.matches) return;
      document.documentElement.dataset.bookEnhanced = "true";
      window.addEventListener("scroll", scroll, { passive: true });
      measure();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    configureMotion();
    preference.addEventListener("change", configureMotion);
    window.addEventListener("resize", measure);
    return () => {
      clear();
      resize.disconnect();
      activeObserver.disconnect();
      index?.removeEventListener("click", closeIndex);
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
      preference.removeEventListener("change", configureMotion);
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div className="page-stacks" aria-hidden="true">
      <div className="page-stack page-stack-left" />
      <div className="page-stack page-stack-right" />
    </div>
  );
}
