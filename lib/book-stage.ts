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
  let tops: number[] = [];
  let active = -1;
  let strips: HTMLElement[] = [];
  let width = 0;
  let height = 0;
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
    clearTimeout(warmTimer);
    warmTimer = 0;
    // Match the CSS small-viewport book height on phones with collapsing chrome.
    height = stage.getBoundingClientRect().height;
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
      slot.style.height = `${height}px`;
    });
    pages.forEach((page) => page.classList.add("book-fixed-page"));
    tops = slots.map((slot, i) => {
      const anchor = pages[i].closest(".chapter-opening") || slot;
      return Math.round(anchor.getBoundingClientRect().top + scrollY);
    });
    pages.forEach((page, i) => {
      page.dataset.bookTop = String(tops[i]);
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
      let scale = 1;
      if (size(1) > availableHeight) {
        let low = 0.1;
        let high = 1;
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
  };
  const buildSheet = (index: number) => {
    stage.querySelector(".paper-joint")?.remove();
    strips = [];
    width = sizes[index - 1].width;
    stageLeft = sizes[index - 1].left;
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
        const sourceIndex = back ? index : index - 1;
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
    preparedOffsets = [pages[index - 1].scrollTop, pages[index].scrollTop];
  };
  const update = (y: number) => {
    stage.dataset.scrollY = String(y);
    const travel = height * TURN_TRAVEL;
    let current = 0;
    while (current + 1 < pages.length && y >= tops[current + 1]) current++;
    const incoming = current + 1;
    const p =
      incoming < pages.length
        ? clamp((y - tops[incoming] + travel) / travel)
        : 0;
    const turning = p > 0 && p < 1;
    const chapter = pages[current].closest<HTMLElement>("[id]")?.id;
    heads.forEach((head) => {
      head.style.visibility =
        head.parentElement?.id === chapter &&
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
        active !== incoming &&
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
      preparedOffsets[0] !== pages[current].scrollTop ||
      preparedOffsets[1] !== pages[incoming].scrollTop
    )
      buildSheet(incoming);
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
  measure();
  update(scrollY);
  return {
    measure,
    update,
    top: (page: HTMLElement) => tops[pages.indexOf(page)],
    destroy() {
      restoreReading();
      clearTimeout(warmTimer);
      stage.remove();
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
