"use client";

import { useEffect, useRef, useState } from "react";

const VISIT_KEY = "book-gesture-guidance";

/** Desktop margin annotation. The phone instruction is rendered with the link. */
export function NavigationHint() {
  const ref = useRef<HTMLSpanElement>(null);
  const [phone, setPhone] = useState<boolean | null>(null);
  useEffect(() => {
    const input = matchMedia("(max-width: 700px), (pointer: coarse)");
    const update = () => setPhone(input.matches);
    update();
    input.addEventListener("change", update);
    return () => input.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (phone !== false) return;
    const element = ref.current!;
    let delay = 0;
    let expiry = 0;
    let dismissed = false;
    let shown = false;
    const remember = () => {
      try {
        sessionStorage.setItem(VISIT_KEY, "seen");
      } catch {
        /* Storage may be disabled. */
      }
    };
    const dismiss = () => {
      dismissed = true;
      clearTimeout(delay);
      clearTimeout(expiry);
      delete element.dataset.visible;
      remember();
      observer.disconnect();
    };
    const scroll = () => {
      if (scrollY > 8) dismiss();
    };
    const showWhenReady = () => {
      if (dismissed || shown || delay) return;
      if (scrollY > 8 || (location.hash && location.hash !== "#top")) {
        dismiss();
        return;
      }
      if (
        !document.querySelector('.cover .cover-name[data-signature="complete"]')
      )
        return;
      delay = window.setTimeout(() => {
        delay = 0;
        // Setup can briefly settle before writing starts. Recheck the original
        // cover rather than a decorative sheet snapshot.
        if (
          !document.querySelector(
            '.cover .cover-name[data-signature="complete"]',
          )
        )
          return;
        if (dismissed || document.hidden) {
          dismiss();
          return;
        }
        shown = true;
        remember();
        element.dataset.visible = "true";
        // A brief annotation, then permanent retirement for this input mode.
        expiry = window.setTimeout(dismiss, 4600);
      }, 220);
    };
    const observer = new MutationObserver(showWhenReady);
    try {
      dismissed = sessionStorage.getItem(VISIT_KEY) === "seen";
    } catch {
      /* Use mount lifetime. */
    }
    if (dismissed) return;
    observer.observe(document.querySelector(".cover-name")!, {
      attributes: true,
    });
    showWhenReady();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("bookturnstart", dismiss);
    window.addEventListener("booknavigationstart", dismiss);
    return () => {
      observer.disconnect();
      clearTimeout(delay);
      clearTimeout(expiry);
      delete element.dataset.visible;
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("bookturnstart", dismiss);
      window.removeEventListener("booknavigationstart", dismiss);
    };
  }, [phone]);
  return (
    <span className="navigation-hint" ref={ref} aria-hidden="true">
      <svg
        className="gesture-mouse"
        viewBox="0 0 28 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        focusable="false"
      >
        <rect x="5" y="2" width="18" height="30" rx="9" />
        <path className="gesture-scroll" d="M14 8v6" />
        <path d="m10 37 4 4 4-4" />
      </svg>
      <span className="gesture-desktop-copy">Scroll to turn the page</span>
    </span>
  );
}
