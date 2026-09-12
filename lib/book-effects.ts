export const TURN_DURATION = 1800;

/** Decorative copy only. The original content remains readable in DOM order. */
export function prepareOutgoingPage(boundary: Element) {
  const section = boundary.closest("main > section, main > footer");
  const surfaces = Array.from(
    document.querySelectorAll(".introduction, [data-boundary]"),
  );
  const previous =
    surfaces[surfaces.indexOf(boundary) - 1] || section?.previousElementSibling;
  const candidates = previous?.querySelectorAll<HTMLElement>(
    ".spread-content > :last-child, .intro-facts, .reading-page, .skill-group:last-of-type ul, .closing-content, .divider-title",
  );
  const originals = Array.from(candidates || []).filter(
    (element) => !element.closest(".turn-sheet"),
  );
  const source = originals[originals.length - 1];
  const destination = boundary.querySelector<HTMLElement>("[data-outgoing]");
  if (!source || !destination) return;
  const copy = source.cloneNode(true) as HTMLElement;
  copy.classList.add("outgoing-content");
  copy.inert = true;
  copy.setAttribute("aria-hidden", "true");
  for (const element of [copy, ...copy.querySelectorAll("*")]) {
    for (const attribute of [
      "id",
      "name",
      "autofocus",
      "aria-labelledby",
      "aria-describedby",
      "aria-controls",
    ]) {
      element.removeAttribute(attribute);
    }
  }
  destination.replaceChildren(copy);
}

export function turnPage(boundary: Element): Animation[] {
  const sheet = boundary.querySelector<HTMLElement>(".turn-sheet");
  if (!sheet) return [];
  prepareOutgoingPage(boundary);
  const timing: KeyframeAnimationOptions = {
    duration: TURN_DURATION,
    easing: "cubic-bezier(.32,.08,.24,1)",
    fill: "forwards",
  };
  // Opacity stays off the 3D parent to avoid flattening the front/back faces.
  const rotation = sheet.animate(
    [
      { transform: "perspective(2200px) rotateY(0deg)" },
      { transform: "perspective(2200px) rotateY(-32deg)", offset: 0.28 },
      { transform: "perspective(2200px) rotateY(-105deg)", offset: 0.65 },
      { transform: "perspective(2200px) rotateY(-180deg)" },
    ],
    timing,
  );
  // A leaf remains opaque throughout the turn and rests on the left page.
  const faces = Array.from(sheet.children).map((face) =>
    face.animate(
      boundary.classList.contains("divider")
        ? [{ opacity: 1 }, { opacity: 1 }]
        : [{ opacity: 1 }, { opacity: 1, offset: 0.88 }, { opacity: 0 }],
      timing,
    ),
  );
  const shadow = boundary.querySelector(".turn-shadow")?.animate(
    [
      { transform: "translateX(0%) scaleX(1)", opacity: 0 },
      {
        transform: "translateX(-12%) scaleX(.86)",
        opacity: 0.62,
        offset: 0.25,
      },
      {
        transform: "translateX(-60%) scaleX(.36)",
        opacity: 0.78,
        offset: 0.54,
      },
      {
        transform: "translateX(-100%) scaleX(.85)",
        opacity: 0.46,
        offset: 0.8,
      },
      { transform: "translateX(-100%) scaleX(1)", opacity: 0 },
    ],
    { ...timing, fill: "none" },
  );
  const animations = [rotation, ...faces, ...(shadow ? [shadow] : [])];
  animations.forEach((animation) => {
    animation.pause();
    animation.currentTime = 0;
  });
  return animations;
}
