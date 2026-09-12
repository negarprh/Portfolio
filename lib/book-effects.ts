/** Decorative copy only. The original content remains readable in DOM order. */
export function prepareOutgoingPage(boundary: Element) {
  const section = boundary.closest("main > section, main > footer");
  const previous = section?.previousElementSibling;
  const candidates = previous?.querySelectorAll<HTMLElement>(
    ".spread-content > :last-child, .intro-facts, .reading-page, .skill-group:last-of-type ul, .closing-content",
  );
  const source = candidates?.[candidates.length - 1];
  const destination = boundary.querySelector<HTMLElement>("[data-outgoing]");
  if (!source || !destination) return;
  const copy = source.cloneNode(true) as HTMLElement;
  copy.className = "outgoing-content";
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
    duration: 1800,
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
    face.animate([{ opacity: 1 }, { opacity: 1 }], timing),
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
  // The back cover closes the book; it must not retain a paper overlay.
  if (boundary.classList.contains("back-cover")) {
    rotation.onfinish = () => {
      rotation.cancel();
      faces.forEach((face) => face.cancel());
    };
  }
  return [rotation, ...faces, ...(shadow ? [shadow] : [])];
}
