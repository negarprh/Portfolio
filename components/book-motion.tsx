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
          target.id === "introduction" &&
          opening &&
          document.documentElement.dataset.bookEnhanced
            ? opening.getBoundingClientRect().top +
              window.scrollY +
              (opening.querySelector<HTMLElement>(".cover")?.offsetHeight || 0)
            : target.getBoundingClientRect().top + window.scrollY;
        if (window.location.hash !== link.hash)
          history.pushState(null, "", link.hash);
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        window.scrollTo({ top, behavior: "instant" });
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
    let readingSurfaces: HTMLElement[] = [];
    const inkGeometry = new Map<
      HTMLElement,
      {
        width: number;
        nodes: {
          node: HTMLElement;
          left: number;
          width: number;
          clip?: string;
        }[];
      }
    >();
    let singlePage = false;
    // Read the browser's eased rotation coordinate, not a second easing/timer.
    const exposed = (boundary: HTMLElement | undefined, fallback: number) => {
      const rotation = boundary && timelines.get(boundary)?.[0];
      const progress =
        rotation?.effect?.getComputedTiming().progress ?? fallback;
      const width =
        (boundary && inkGeometry.get(boundary)?.width) || window.innerWidth;
      const leafWidth = singlePage ? width : width / 2;
      const angle = Math.PI * progress;
      // Project the outer edge of perspective(2200px) rotateY(). Once the
      // front has passed the spine, the underlying ink is entirely exposed.
      return clamp(
        1 -
          Math.max(0, Math.cos(angle)) /
            (1 - (leafWidth * Math.sin(angle)) / 2200),
      );
    };
    const updateInk = () => {
      readingSurfaces.forEach((surface, index) => {
        const entry =
          index === 0
            ? 1
            : exposed(index === 1 ? readingSurfaces[0] : surface, 0);
        const exitBoundary = index === 0 ? surface : readingSurfaces[index + 1];
        const exit = exposed(exitBoundary, 0);
        const geometry = inkGeometry.get(surface);
        if (!geometry) return;
        const half = geometry.width / 2;
        // Intersect incoming outer strips with the outgoing central strip.
        // All blocks share spread coordinates, including small folios/labels.
        for (const item of geometry.nodes) {
          const local = (x: number) =>
            Math.max(0, Math.min(item.width, x - item.left));
          const a = local(singlePage ? 0 : half * exit);
          const b = Math.max(a, local(singlePage ? 0 : half * entry));
          const d = local(
            singlePage
              ? geometry.width * (1 - exit)
              : geometry.width - half * exit,
          );
          const c = Math.min(
            d,
            local(
              singlePage
                ? geometry.width * (1 - entry)
                : geometry.width - half * entry,
            ),
          );
          const clip =
            entry === 1 && exit === 0
              ? "none"
              : `polygon(${a}px 0, ${b}px 0, ${b}px 100%, ${a}px 100%, ${a}px 0, ${c}px 0, ${d}px 0, ${d}px 100%, ${c}px 100%, ${c}px 0)`;
          if (item.clip === clip) continue;
          item.clip = clip;
          item.node.style.setProperty("--reading-clip", clip);
        }
      });
    };
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
      singlePage = window.matchMedia("(max-width: 700px)").matches;
      readingSurfaces.forEach((surface) => {
        const rect = surface.getBoundingClientRect();
        const nodes = Array.from(
          surface.querySelectorAll<HTMLElement>(
            surface === cover
              ? ":scope > .cover-art > *"
              : ":scope > :not(.turn-sheet):not(.turn-shadow)",
          ),
        );
        inkGeometry.set(surface, {
          width: rect.width,
          nodes: nodes.map((node) => {
            const bounds = node.getBoundingClientRect();
            return { node, left: bounds.left - rect.left, width: bounds.width };
          }),
        });
      });
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
      updateInk();
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
      inkGeometry.forEach(({ nodes }) =>
        nodes.forEach(({ node }) =>
          node.style.removeProperty("--reading-clip"),
        ),
      );
      readingSurfaces = [];
      inkGeometry.clear();
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
      readingSurfaces = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".cover, .introduction, [data-boundary]",
        ),
      );
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
