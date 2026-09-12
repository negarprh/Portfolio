"use client";
import { useEffect } from "react";
import { turnPage } from "@/lib/book-effects";

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
      .querySelectorAll("main > section[id]")
      .forEach((section) => activeObserver.observe(section));

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new Set<Element>();
    const animations = new Set<Animation>();
    const cover = document.querySelector<HTMLElement>(".cover-content");
    const stacks = document.querySelector<HTMLElement>(".page-stacks");
    const leftStack = document.querySelector<HTMLElement>(".page-stack-left");
    const rightStack = document.querySelector<HTMLElement>(".page-stack-right");
    let turns: IntersectionObserver | undefined;
    let frame = 0;
    let coverHeight = window.innerHeight;
    let bookLength = 1;
    const measure = () => {
      coverHeight = cover?.offsetHeight || window.innerHeight;
      bookLength = Math.max(
        1,
        document.documentElement.scrollHeight -
          coverHeight -
          window.innerHeight,
      );
      scroll();
    };
    const update = () => {
      frame = 0;
      if (preference.matches) return;
      const coverProgress = Math.min(window.scrollY / window.innerHeight, 1);
      if (cover) {
        cover.style.transform = `translateY(${coverProgress * 45}px) scale(${1 - coverProgress * 0.035})`;
        cover.style.opacity = String(1 - coverProgress * 0.4);
      }
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - coverHeight) / bookLength),
      );
      if (stacks)
        stacks.style.opacity = String(
          Math.max(0, Math.min(1, (window.scrollY - coverHeight + 180) / 180)),
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
      turns?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
      frame = 0;
      delete document.documentElement.dataset.bookEnhanced;
      if (cover) {
        cover.style.transform = "";
        cover.style.opacity = "";
      }
      if (stacks) stacks.style.opacity = "";
      if (leftStack) leftStack.style.transform = "";
      if (rightStack) rightStack.style.transform = "";
      document
        .querySelectorAll("[data-outgoing]")
        .forEach((container) => container.replaceChildren());
    };
    const configureMotion = () => {
      clear();
      if (preference.matches) return;
      document.documentElement.dataset.bookEnhanced = "true";
      turns = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || seen.has(entry.target)) continue;
            seen.add(entry.target);
            turns?.unobserve(entry.target);
            turnPage(entry.target).forEach((animation) =>
              animations.add(animation),
            );
          }
        },
        { threshold: 0.35 },
      );
      document
        .querySelectorAll("[data-boundary]")
        .forEach((el) => turns?.observe(el));
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
