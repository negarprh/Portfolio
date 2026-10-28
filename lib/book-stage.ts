import { TURN_TRAVEL } from "./book-effects";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const STRIPS = 12;

/** Native document runways own scroll distance; the original pages stay fixed.
 * Inert snapshots supply ink to a connected, articulated sheet, never to navigation.
 */
export function createBookStage() {
  const pages = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".cover, .introduction, [data-boundary]",
    ),
  );
  const heads = Array.from(
    document.querySelectorAll<HTMLElement>("main > section > .chapter-running"),
  );
  const reading = pages.map((page) =>
    page.querySelector<HTMLElement>(
      ":scope > .intro-grid, :scope > .spread-content",
    ),
  );
  const readingStyles = reading.map(
    (node) => node?.getAttribute("style") || null,
  );
  const restoreReading = () =>
    reading.forEach((node, i) => {
      if (!node) return;
      if (readingStyles[i] === null) node.removeAttribute("style");
      else node.setAttribute("style", readingStyles[i]!);
    });
  const slots = pages.map((page) => {
    const slot = document.createElement("div");
    slot.className = "book-page-slot";
    slot.style.height = `${page.getBoundingClientRect().height}px`;
    page.before(slot);
    return slot;
  });
  const stage = document.createElement("div");
  stage.className = "physical-turn";
  stage.inert = true;
  stage.setAttribute("aria-hidden", "true");
  const shadow = document.createElement("div");
  shadow.className = "turn-shadow physical-shadow";
  const contact = document.createElement("div");
  contact.className = "turn-shadow physical-contact";
  stage.append(shadow, contact);
  document.body.append(stage);
  // Keep native destinations stable as mobile browser chrome expands/collapses.
  // Only the visible paper uses the dynamic viewport height.
  const runway = document.createElement("div");
  runway.className = "book-viewport-probe";
  runway.style.cssText =
    "position:fixed;height:100svh;width:0;visibility:hidden;pointer-events:none";
  document.body.append(runway);
  let tops: number[] = [];
  let active = -1;
  let activeOutgoing = -1;
  let strips: HTMLElement[] = [];
  let width = 0;
  let height = 0;
  let runwayHeight = 0;
  let sizes: DOMRect[] = [];
  let stageLeft = 0;
  let warmTimer = 0;
  let preparedOffsets = [0, 0];
  let mobile = false;
  let snapshotCache = new Map<HTMLElement, HTMLElement>();
  const snapshotOffsets = new Map<HTMLElement, number>();

  const snapshot = (page: HTMLElement) => {
    const cached = snapshotCache.get(page);
    if (cached && snapshotOffsets.get(page) === page.scrollTop) return cached;
    const visibility = page.style.visibility;
    page.style.visibility = "visible";
    const copy = page.cloneNode(true) as HTMLElement;
    const originals = [page, ...page.querySelectorAll<HTMLElement>("*")];
    const copies = [copy, ...copy.querySelectorAll<HTMLElement>("*")];
    // Preserve ancestor-scoped typography/layout even outside the source chapter.
    originals.forEach((node, i) => {
      const style = getComputedStyle(node);
      const target = copies[i];
      for (const property of Array.from(style))
        target.style.setProperty(property, style.getPropertyValue(property));
      // Hidden authored labels keep their layout, while visible snapshot ink
      // inherits its face/stage visibility instead of escaping a hidden parent.
      if (style.visibility === "hidden") target.style.opacity = "0";
      target.style.animation = "none";
      for (const attribute of [
        "id",
        "name",
        "data-boundary",
        "aria-labelledby",
        "aria-describedby",
        "aria-controls",
      ])
        target.removeAttribute(attribute);
    });
    // The root loses its identifying class/ID, so retain its existing binding,
    // folio mark or cloth border as inert material rather than inventing a new one.
    for (const pseudo of ["::before", "::after"]) {
      const material = getComputedStyle(page, pseudo);
      if (
        ["none", "normal"].includes(material.content) ||
        material.display === "none"
      )
        continue;
      const layer = document.createElement("span");
      for (const property of Array.from(material))
        layer.style.setProperty(property, material.getPropertyValue(property));
      layer.textContent = material.content.replace(/^"|"$/g, "");
      layer.style.pointerEvents = "none";
      copy.append(layer);
    }
    page.style.visibility = visibility;
    copy
      .querySelectorAll(".turn-sheet, .turn-shadow")
      .forEach((node) => node.remove());
    copy.querySelectorAll<HTMLElement>(".cover-signature").forEach((node) => {
      node.style.display = "none";
    });
    copy
      .querySelectorAll<HTMLElement>(".cover-name > h1, .cover-seal")
      .forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "none";
      });
    copy.className = "physical-page-copy";
    Object.assign(copy.style, {
      position: "absolute",
      top: `${-page.scrollTop}px`,
      left: "0",
      margin: "0",
      visibility: "visible",
      width: `${sizes[pages.indexOf(page)].width}px`,
      height: `${height}px`,
      minHeight: "0",
      maxHeight: "none",
      clipPath: "none",
      overflow: "visible",
      transform: "none",
      zIndex: "auto",
    });
    copy.inert = true;
    snapshotCache.set(page, copy);
    snapshotOffsets.set(page, page.scrollTop);
    return copy;
  };
  const measure = () => {
    // Measuring natural pages must not shrink the document and let the browser
    // clamp a reader's position near the end of the book.
    const root = document.documentElement;
    const previousMinHeight = root.style.minHeight;
    root.style.minHeight = `${root.scrollHeight}px`;
    clearTimeout(warmTimer);
    warmTimer = 0;
    height = stage.getBoundingClientRect().height;
    runwayHeight = runway.getBoundingClientRect().height;
    restoreReading();
    // Temporarily restore natural sizes; all writes complete before the next paint.
    pages.forEach((page) => page.classList.remove("book-fixed-page"));
    slots.forEach((slot) => {
      slot.style.display = "none";
    });
    sizes = pages.map((page) => page.getBoundingClientRect());
    // Section borders must not make nested spreads a pixel narrower on each
    // side. Every interior surface shares the introduction's paper rectangle.
    sizes = sizes.map((rect, i) =>
      i === 0
        ? rect
        : new DOMRect(sizes[1].left, 0, sizes[1].width, rect.height),
    );
    mobile = matchMedia("(max-width: 700px)").matches;
    slots.forEach((slot, i) => {
      slot.style.display = "block";
      // The final destination must remain reachable when browser chrome hides
      // and the visible viewport grows beyond the stable small-viewport runway.
      slot.style.height = `${i === pages.length - 1 ? Math.max(height, runwayHeight) : runwayHeight}px`;
    });
    pages.forEach((page) => page.classList.add("book-fixed-page"));
    tops = slots.map((slot, i) => {
      const anchor = pages[i].closest(".chapter-opening") || slot;
      return Math.round(anchor.getBoundingClientRect().top + scrollY);
    });
    pages.forEach((page, i) => {
      page.dataset.bookTop = String(tops[i]);
      slots[i].style.scrollMarginTop =
        `${slots[i].getBoundingClientRect().top + scrollY - tops[i]}px`;
    });
    heads.forEach((head) => {
      head.classList.add("book-fixed-head");
      head.style.left = `${sizes[1].left}px`;
    });
    pages.forEach((page, i) => {
      page.style.setProperty("--fixed-book-left", `${sizes[i].left}px`);
      page.style.setProperty("--fixed-book-width", `${sizes[i].width}px`);
    });
    reading.forEach((content, i) => {
      if (!content) return;
      const page = pages[i];
      const style = getComputedStyle(page);
      const left = parseFloat(style.paddingLeft);
      const right = parseFloat(style.paddingRight);
      const availableWidth = page.clientWidth - left - right;
      const availableHeight = height - 2 * Math.min(64, height * 0.1);
      const size = (scale: number) => {
        content.style.zoom = String(scale);
        content.style.width = `${availableWidth / scale}px`;
        content.style.left = `${left / scale}px`;
        return content.getBoundingClientRect().height;
      };
      // Large monitors need a proportionate reading block as well as wider paper.
      let scale = mobile
        ? 1
        : Math.max(1, Math.min(page.clientWidth / 1240, height / 900, 1.8));
      if (size(scale) > availableHeight) {
        let low = 0.1;
        let high = scale;
        for (let n = 0; n < 12; n++) {
          const mid = (low + high) / 2;
          if (size(mid) <= availableHeight - 1) low = mid;
          else high = mid;
        }
        scale = low;
      }
      const contentHeight = size(scale);
      content.style.top = `${(height - contentHeight) / 2 / scale}px`;
    });
    snapshotCache = new Map();
    active = -1;
    root.style.minHeight = previousMinHeight;
  };
  const buildSheet = (index: number, outgoing = index - 1) => {
    stage.querySelector(".paper-joint")?.remove();
    strips = [];
    width = sizes[outgoing].width;
    stageLeft = sizes[outgoing].left;
    stage.style.left = `${stageLeft}px`;
    stage.style.width = `${width}px`;
    const leafWidth = mobile ? width : width / 2;
    const stripWidth = leafWidth / STRIPS;
    let parent = stage;
    for (let i = 0; i < STRIPS; i++) {
      const joint = document.createElement("div");
      joint.className = "paper-joint";
      joint.style.width = `${stripWidth}px`;
      joint.style.left = `${i === 0 ? (mobile ? 0 : leafWidth) : stripWidth}px`;
      for (const back of [false, true]) {
        const face = document.createElement("div");
        face.className = `paper-strip ${back ? "paper-verso" : "paper-recto"}`;
        const sourceIndex = back ? index : outgoing;
        const copy = snapshot(pages[sourceIndex]).cloneNode(
          true,
        ) as HTMLElement;
        copy.style.left = `${sizes[sourceIndex].left - stageLeft + (back ? -(leafWidth - (i + 1) * stripWidth) : -(mobile ? 0 : leafWidth) - i * stripWidth)}px`;
        face.append(copy);
        const light = document.createElement("div");
        light.className = "paper-light";
        face.append(light);
        joint.append(face);
      }
      parent.append(joint);
      parent = joint;
      strips.push(joint);
    }
    active = index;
    activeOutgoing = outgoing;
    preparedOffsets = [pages[outgoing].scrollTop, pages[index].scrollTop];
  };
  const paint = (current: number, incoming: number, p: number, y: number) => {
    stage.dataset.scrollY = String(y);
    const turning = p > 0 && p < 1;
    const chapter = pages[current].matches(".cover")
      ? "top"
      : pages[current].closest<HTMLElement>("[id]")?.id;
    heads.forEach((head) => {
      head.style.visibility =
        head.parentElement?.id === chapter &&
        !turning &&
        !pages[current].matches(".divider")
          ? "visible"
          : "hidden";
    });
    document
      .querySelectorAll<HTMLAnchorElement>("#book-index a")
      .forEach((link) => {
        if (link.hash === `#${chapter}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    pages.forEach((page, i) => {
      const visible = i === current || (turning && i === incoming);
      page.style.visibility = visible ? "visible" : "hidden";
      page.inert = i !== current;
      page.style.zIndex = i === current ? "12" : "11";
      page.style.overflow = "clip";
      // A physical leaf has outgoing recto and incoming verso. The other two
      // halves remain flat underneath; no fading or translating spread layers.
      page.style.clipPath =
        turning && i === current
          ? mobile
            ? "inset(0 100% 0 0)"
            : "inset(0 50% 0 0)"
          : "none";
      page.dataset.pageActive = String(i === current);
    });
    stage.style.visibility = turning ? "visible" : "hidden";
    if (!turning) {
      stage.dataset.progress = "0";
      if (
        !warmTimer &&
        incoming < pages.length &&
        (active !== incoming || activeOutgoing !== current) &&
        document.fonts.status === "loaded"
      ) {
        const prepare = () => {
          if (document.querySelector('[data-signature="writing"]')) {
            warmTimer = window.setTimeout(prepare, 100);
            return;
          }
          warmTimer = 0;
          buildSheet(incoming);
        };
        warmTimer = window.setTimeout(prepare, 100);
      }
      return;
    }
    clearTimeout(warmTimer);
    warmTimer = 0;
    if (
      active !== incoming ||
      activeOutgoing !== current ||
      preparedOffsets[0] !== pages[current].scrollTop ||
      preparedOffsets[1] !== pages[incoming].scrollTop
    )
      buildSheet(incoming, current);
    // Linear scroll coordinate, gently flexed near the outer edge. Adjacent
    // joints share endpoints, so curvature never opens cracks between strips.
    const bend = Math.sin(Math.PI * p) * 38;
    strips.forEach((strip, i) => {
      const angle = i === 0 ? -180 * p + bend * 0.5 : -bend / (STRIPS - 1);
      strip.style.transform = `rotateY(${angle}deg)`;
      strip
        .querySelectorAll<HTMLElement>(":scope > .paper-strip > .paper-light")
        .forEach((light) => {
          light.style.opacity = String(
            Math.sin(Math.PI * p) * (0.035 + (0.11 * i) / STRIPS),
          );
        });
    });
    shadow.style.opacity = String(Math.sin(Math.PI * p) * 0.65);
    contact.style.opacity = String(Math.sin(Math.PI * p) * 0.8);
    shadow.style.transform = `translateX(${-100 * p}%) scaleX(${0.3 + 0.7 * Math.abs(Math.cos(Math.PI * p))})`;
    stage.dataset.progress = String(p);
  };
  const pageAt = (y: number) => {
    let index = 0;
    while (index + 1 < pages.length && y >= tops[index + 1]) index++;
    return index;
  };
  const update = (y: number) => {
    const current = pageAt(y);
    const incoming = current + 1;
    const travel = runwayHeight * TURN_TRAVEL;
    const p =
      incoming < pages.length
        ? clamp((y - tops[incoming] + travel) / travel)
        : 0;
    paint(current, incoming, p, y);
  };
  measure();
  update(scrollY);
  return {
    measure,
    update,
    transition(from: number, to: number, progress: number) {
      const source = pageAt(from);
      // Native anchor landing rounds fractional chapter positions to pixels.
      const destination = pageAt(Math.round(to));
      if (source === destination) return;
      const p = Math.max(0.0001, Math.min(0.9999, progress));
      if (destination > source) paint(source, destination, p, from);
      else paint(destination, source, 1 - p, from);
    },
    stops: () => [...tops],
    travel: () => runwayHeight * TURN_TRAVEL,
    top: (page: HTMLElement) => tops[pages.indexOf(page)],
    destroy() {
      restoreReading();
      clearTimeout(warmTimer);
      stage.remove();
      runway.remove();
      heads.forEach((head) => {
        head.classList.remove("book-fixed-head");
        head.style.removeProperty("left");
        head.style.removeProperty("visibility");
      });
      slots.forEach((slot) => slot.remove());
      pages.forEach((page) => {
        page.classList.remove("book-fixed-page");
        page.inert = false;
        delete page.dataset.pageActive;
        delete page.dataset.bookTop;
        for (const property of [
          "visibility",
          "z-index",
          "clip-path",
          "overflow",
          "--fixed-book-left",
          "--fixed-book-width",
        ])
          page.style.removeProperty(property);
      });
    },
  };
}
