export const TURN_DURATION = 1800;
export const TURN_EASING = "cubic-bezier(.24,.12,.22,1)";
export const TURN_TRAVEL = 0.85;
// Frame-rate-independent response: ~95% settled in 96ms, no velocity/overshoot.
export const TURN_RESPONSE_MS = 32;

/** Decorative copy only. The original content remains readable in DOM order. */
export function prepareOutgoingPage(boundary: Element) {
  const section = boundary.closest("main > section, main > footer");
  const surfaces = Array.from(
    document.querySelectorAll(".introduction, [data-boundary]"),
  );
  const previous =
    surfaces[surfaces.indexOf(boundary) - 1] || section?.previousElementSibling;
  const candidates = previous?.querySelectorAll<HTMLElement>(
    ".spread-content > :last-child, .intro-facts, .reading-page, .skill-group:last-of-type ul, .closing-content",
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
  if (!boundary.matches(".cover, .back-cover")) {
    return turnSpread(boundary, sheet);
  }
  const coverArt = boundary.querySelector<HTMLElement>(".cover-art");
  if (coverArt) {
    const copy = coverArt.cloneNode(true) as HTMLElement;
    copy.inert = true;
    copy.setAttribute("aria-hidden", "true");
    copy
      .querySelectorAll("[id]")
      .forEach((element) => element.removeAttribute("id"));
    copy
      .querySelectorAll(".seal-pending")
      .forEach((element) => element.classList.remove("seal-pending"));
    sheet.querySelector(".sheet-front")?.replaceChildren(copy);
  } else prepareOutgoingPage(boundary);
  if (boundary.classList.contains("back-cover")) {
    const jacket = boundary.cloneNode(true) as HTMLElement;
    jacket.className = "closing-art";
    jacket.inert = true;
    jacket.setAttribute("aria-hidden", "true");
    jacket
      .querySelectorAll(".turn-sheet, .turn-shadow")
      .forEach((element) => element.remove());
    for (const element of [jacket, ...jacket.querySelectorAll("*")]) {
      for (const attribute of [
        "id",
        "data-boundary",
        "aria-labelledby",
        "aria-describedby",
      ])
        element.removeAttribute(attribute);
    }
    sheet.querySelector(".sheet-back")?.replaceChildren(jacket);
  }
  return animateLeaf(
    sheet,
    boundary.querySelector(".turn-shadow"),
    Array.from(sheet.children),
    boundary.classList.contains("divider"),
    coverArt,
  );
}

/** Paper is decorative; the one server-rendered reading layer stays sharp.
 * Both halves share the same seek, easing and duration, including on reversal.
 */
function turnSpread(boundary: Element, right: HTMLElement): Animation[] {
  boundary.classList.add("readable-turn");
  const left = right.cloneNode(true) as HTMLElement;
  left.classList.add("turn-sheet-left");
  // No cloned paragraphs, headings or labels on either rotating paper face.
  left
    .querySelectorAll(".sheet-front, .sheet-back")
    .forEach((face) => face.replaceChildren());
  const rightShadow = boundary.querySelector<HTMLElement>(".turn-shadow");
  const leftShadow = rightShadow?.cloneNode(true) as HTMLElement | undefined;
  if (leftShadow) {
    leftShadow.classList.add("turn-shadow-left");
    boundary.append(leftShadow);
  }
  boundary.append(left);
  return [
    ...animateLeaf(right, rightShadow, Array.from(right.children)),
    ...animateLeaf(
      left,
      leftShadow || null,
      Array.from(left.children),
      false,
      null,
      -1,
    ),
  ];
}

/** Shared spine rotation and cast-shadow timeline for paper leaves and the cover. */
export function animateLeaf(
  sheet: HTMLElement,
  shadowLayer: Element | null,
  faceLayers: Element[] = [],
  restsOnLeft = false,
  stationaryCover: HTMLElement | null = null,
  direction = 1,
): Animation[] {
  const timing: KeyframeAnimationOptions = {
    duration: TURN_DURATION,
    easing: TURN_EASING,
    fill: "forwards",
  };
  // Opacity stays off the 3D parent to avoid flattening the front/back faces.
  const rotation = sheet.animate(
    [
      { transform: "perspective(2200px) rotateY(0deg)" },
      { transform: `perspective(2200px) rotateY(${-180 * direction}deg)` },
    ],
    timing,
  );
  // A leaf remains opaque throughout the turn and rests on the left page.
  const faces = faceLayers.map((face) =>
    face.animate(
      restsOnLeft
        ? [{ opacity: 1 }, { opacity: 1 }]
        : [{ opacity: 1 }, { opacity: 1, offset: 0.88 }, { opacity: 0 }],
      timing,
    ),
  );
  const shadow = shadowLayer?.animate(
    [
      { transform: "translateX(0%) scaleX(1)", opacity: 0 },
      {
        transform: `translateX(${-12 * direction}%) scaleX(.86)`,
        opacity: 0.62,
        offset: 0.25,
      },
      {
        transform: `translateX(${-60 * direction}%) scaleX(.36)`,
        opacity: 0.78,
        offset: 0.54,
      },
      {
        transform: `translateX(${-100 * direction}%) scaleX(.85)`,
        opacity: 0.46,
        offset: 0.8,
      },
      { transform: `translateX(${-100 * direction}%) scaleX(1)`, opacity: 0 },
    ],
    { ...timing, fill: "none" },
  );
  // Clear the stationary jacket behind the opaque reverse. A short overlap
  // removes the exposed outer sliver without a one-frame visibility handoff.
  const jacket = stationaryCover?.animate(
    [
      { opacity: 1 },
      { opacity: 1, offset: 0.72 },
      { opacity: 0, offset: 0.88 },
      { opacity: 0 },
    ],
    timing,
  );
  const animations = [
    rotation,
    ...faces,
    ...(shadow ? [shadow] : []),
    ...(jacket ? [jacket] : []),
  ];
  animations.forEach((animation) => {
    animation.pause();
    animation.currentTime = 0;
  });
  return animations;
}
