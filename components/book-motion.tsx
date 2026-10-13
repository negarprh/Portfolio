"use client";
import { useEffect } from "react";
import { createBookStage } from "@/lib/book-stage";
import { TURN_RESPONSE_MS } from "@/lib/book-effects";

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
      if (
        event instanceof MouseEvent &&
        (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      )
        return;
      index.open = false;
      const target = document.querySelector<HTMLElement>(link.hash);
      if (target) {
        event.preventDefault();
        // Sticky rectangles depend on the current scroll position. The opening
        // wrapper and chapter sections provide stable document destinations.
        const opening = document.querySelector<HTMLElement>(".book-opening");
        const top =
          stage?.top(target) ??
          (target.id === "introduction" &&
          opening &&
          document.documentElement.dataset.bookEnhanced
            ? opening.getBoundingClientRect().top +
              window.scrollY +
              (opening.querySelector<HTMLElement>(".cover")?.offsetHeight || 0)
            : target.getBoundingClientRect().top + window.scrollY);
        if (window.location.hash !== link.hash)
          history.pushState(null, "", link.hash);
        target.tabIndex = -1;
        window.scrollTo({ top, behavior: "instant" });
        renderedY = window.scrollY;
        stage?.update(renderedY);
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
    document.addEventListener("click", closeIndex);
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    const activeObserver = new IntersectionObserver(
      (entries) => {
        if (document.documentElement.dataset.bookEnhanced) return;
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
    let stage: ReturnType<typeof createBookStage> | undefined;
    const cover = document.querySelector<HTMLElement>(".cover");
    const coverShadow = document.querySelector<HTMLElement>(
      ".cover > .turn-shadow",
    );
    const backCover = document.querySelector<HTMLElement>(".back-cover");
    const stacks = document.querySelector<HTMLElement>(".page-stacks");
    const leftStack = document.querySelector<HTMLElement>(".page-stack-left");
    const rightStack = document.querySelector<HTMLElement>(".page-stack-right");
    let frame = 0;
    let renderedY = window.scrollY;
    let lastFrame = 0;
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
      stage?.measure();
      backTop =
        (backCover && stage?.top(backCover)) ||
        (backCover?.getBoundingClientRect().top || 0) + window.scrollY;
      renderedY = window.scrollY;
      scroll();
    };
    const update = (now: number) => {
      frame = 0;
      if (preference.matches) {
        clear();
        return;
      }
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
      stage?.update(y);
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
      stage?.destroy();
      stage = undefined;
      if (cover) cover.style.visibility = "";

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
      stage = createBookStage();
      window.addEventListener("scroll", scroll, { passive: true });
      measure();
    };
    const followHash = () => {
      if (!window.location.hash || !stage) return;
      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );
      if (!target) return;
      const top =
        stage.top(target) ??
        target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "instant" });
      renderedY = window.scrollY;
      stage.update(renderedY);
    };
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    configureMotion();
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".book-fixed-page img"));
    images.forEach((image) => image.addEventListener("load", measure));
    followHash();
    window.addEventListener("hashchange", followHash);
    preference.addEventListener("change", configureMotion);
    window.addEventListener("resize", measure);
    return () => {
      disposed = true;
      images.forEach((image) => image.removeEventListener("load", measure));
      clear();
      resize.disconnect();
      activeObserver.disconnect();
      document.removeEventListener("click", closeIndex);
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
      preference.removeEventListener("change", configureMotion);
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", followHash);
    };
  }, []);
  return (
    <div className="page-stacks" aria-hidden="true">
      <div className="page-stack page-stack-left" />
      <div className="page-stack page-stack-right" />
    </div>
  );
}
