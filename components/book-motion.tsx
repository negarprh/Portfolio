"use client";
import { useEffect } from "react";
import {
  turnPage,
  TURN_DURATION,
  TURN_TRAVEL,
  TURN_RESPONSE_MS,
} from "@/lib/book-effects";

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
      ".cover > .turn-shadow",
    );
    const backCover = document.querySelector<HTMLElement>(".back-cover");
    const stacks = document.querySelector<HTMLElement>(".page-stacks");
    const leftStack = document.querySelector<HTMLElement>(".page-stack-left");
    const rightStack = document.querySelector<HTMLElement>(".page-stack-right");
    let boundaries: { element: HTMLElement; top: number }[] = [];
    let frame = 0;
    let renderedY = window.scrollY;
    let lastFrame = 0;
    const positions = new Map<Element, number>();
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
      renderedY = window.scrollY;
      scroll();
    };
    const seek = (element: Element, progress: number) => {
      if (positions.get(element) === progress) return;
      positions.set(element, progress);
      timelines.get(element)?.forEach((animation) => {
        animation.currentTime = progress * TURN_DURATION;
      });
    };
    const update = (now: number) => {
      frame = 0;
      if (preference.matches) return;
      const targetY = window.scrollY;
      const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : 1000 / 60;
      lastFrame = now;
      const distance = targetY - renderedY;
      // Follow the latest native position, never intercept wheel input. Large
      // navigation jumps snap; small notches settle without queued animations.
      renderedY =
        Math.abs(distance) > window.innerHeight
          ? targetY
          : renderedY + distance * (1 - Math.exp(-elapsed / TURN_RESPONSE_MS));
      if (Math.abs(targetY - renderedY) < 0.1) renderedY = targetY;
      const y = renderedY;
      const travel = window.innerHeight * TURN_TRAVEL;
      const coverProgress = clamp(y / travel);
      if (cover) {
        const turning = String(coverProgress > 0);
        if (cover.dataset.turning !== turning) cover.dataset.turning = turning;
        seek(cover, coverProgress);
      }
      // Every leaf uses the same position filter and reversible paused timeline.
      for (const { element, top } of boundaries) {
        const progress = clamp((y - top + travel) / travel);
        seek(element, progress);
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
      if (renderedY !== targetY) frame = requestAnimationFrame(update);
      else lastFrame = 0;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const clear = () => {
      timelines.forEach((animations) =>
        animations.forEach((animation) => animation.cancel()),
      );
      timelines.clear();
      positions.clear();
      document
        .querySelectorAll(".turn-sheet-left, .turn-shadow-left")
        .forEach((layer) => layer.remove());
      document
        .querySelectorAll(".readable-turn")
        .forEach((boundary) => boundary.classList.remove("readable-turn"));
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      delete document.documentElement.dataset.bookEnhanced;
      if (cover) delete cover.dataset.turning;
      cover?.querySelector(".sheet-front")?.replaceChildren();
      backCover?.querySelector(".sheet-back .closing-art")?.remove();
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
      if (cover) timelines.set(cover, turnPage(cover));
      // Build inert copies and animation objects before any scrolling occurs.
      document
        .querySelectorAll<HTMLElement>("[data-boundary]")
        .forEach((element) => {
          timelines.set(element, turnPage(element));
        });
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
