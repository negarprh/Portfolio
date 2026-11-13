import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const [width, height] of [
  [320, 568],
  [390, 844],
  [768, 1024],
  [844, 390],
  [1440, 900],
]) {
  test(`Stay22 heading and complete rocket fit at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".book-fixed-page")).toHaveCount(17);
    await page.evaluate(() => document.fonts.ready);
    const spread = page.locator(".current-company");
    await spread.evaluate((el) =>
      scrollTo({
        top: Number((el as HTMLElement).dataset.bookTop),
        behavior: "instant",
      }),
    );
    await settleBook(page);

    const layout = await spread.evaluate((el) => {
      const paper = el.getBoundingClientRect();
      const heading = el.querySelector(".job-heading")!.getBoundingClientRect();
      const svg = el.querySelector<SVGSVGElement>(".rocket-illustration")!;
      const art = svg.getBoundingClientRect();
      // Test each pen path in viewBox coordinates. A rotated group's aggregate
      // bounding rectangle includes empty corners outside the actual drawing.
      const viewMatrix = svg.getCTM()!.inverse();
      const fitsViewBox = Array.from(
        svg.querySelectorAll<SVGGraphicsElement>("path, circle"),
      ).every((mark) => {
        const box = mark.getBBox();
        const matrix = viewMatrix.multiply(mark.getCTM()!);
        return [
          [box.x, box.y],
          [box.x + box.width, box.y],
          [box.x, box.y + box.height],
          [box.x + box.width, box.y + box.height],
        ].every(([x, y]) => {
          const point = new DOMPoint(x, y).matrixTransform(matrix);
          return point.x > 1 && point.y > 1 && point.x < 399 && point.y < 399;
        });
      });
      const reference = document.querySelector(
        ".experience-row .job-heading h3",
      )!;
      const title = el.querySelector("h3")!;
      // Transform actual nose and engine points, so the direction cannot silently reverse.
      const axis = svg.querySelector("g")!.getCTM()!;
      const nose = new DOMPoint(0, -132).matrixTransform(axis);
      const engine = new DOMPoint(0, 90).matrixTransform(axis);
      return {
        bounded:
          art.left >= paper.left &&
          art.right <= paper.right &&
          art.top >= paper.top &&
          art.bottom <= paper.bottom,
        clearsText: art.left >= heading.right || art.top >= heading.bottom,
        fitsViewBox,
        rightPage: art.left > paper.left + paper.width / 2,
        upperRight: nose.x > engine.x && nose.y < engine.y,
        sharedType: ["font-family", "font-size", "line-height", "color"].every(
          (key) =>
            getComputedStyle(title).getPropertyValue(key) ===
            getComputedStyle(reference).getPropertyValue(key),
        ),
      };
    });
    expect(layout.bounded).toBe(true);
    expect(layout.clearsText).toBe(true);
    expect(layout.fitsViewBox).toBe(true);
    expect(layout.upperRight).toBe(true);
    expect(layout.sharedType).toBe(true);
    if (width > 700) expect(layout.rightPage).toBe(true);
    await expect(spread.locator(".current-company-art")).toHaveText("");
    await expect(spread.locator(".role-anchor, .stack-chips, img")).toHaveCount(
      0,
    );
  });
}

for (const mode of ["no-js", "reduced"] as const) {
  for (const width of [320, 1440]) {
    test(`Stay22 remains readable in ${mode} at ${width}px`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width, height: width === 320 ? 568 : 900 },
        javaScriptEnabled: mode !== "no-js",
        reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      await page.goto("/");
      const spread = page.locator(".current-company");
      await expect(spread.locator("h3")).toHaveText("Stay22");
      await expect(spread.locator(".current-company-team")).toHaveText(
        "Integrations",
      );
      await expect(spread.locator(".rocket-illustration")).toBeVisible();
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-book-enhanced",
      );
      expect(
        await spread.evaluate((el) => {
          const heading = el
            .querySelector(".job-heading")!
            .getBoundingClientRect();
          const art = el.querySelector("svg")!.getBoundingClientRect();
          return (
            (art.left >= heading.right || art.top >= heading.bottom) &&
            document.documentElement.scrollWidth <= innerWidth
          );
        }),
      ).toBe(true);
      await context.close();
    });
  }
}
