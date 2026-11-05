import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const [width, height] of [
  [320, 568],
  [390, 844],
  [768, 1024],
  [844, 390],
  [1440, 900],
]) {
  test(`chapter artwork clears content and page bounds at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".book-fixed-page")).toHaveCount(16);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("#introduction img")).toHaveCount(0);
    const seen = new Set<string>();
    for (const surface of await page
      .locator(".book-fixed-page:has(.chapter-illustration)")
      .all()) {
      await surface.evaluate((el) =>
        scrollTo({
          top: Number((el as HTMLElement).dataset.bookTop),
          behavior: "instant",
        }),
      );
      await settleBook(page);
      const issues = await surface.evaluate((el) => {
        const paper = el.getBoundingClientRect();
        const art = Array.from(
          el.querySelectorAll<SVGSVGElement>(".chapter-illustration"),
        ).filter((svg) => getComputedStyle(svg).display !== "none");
        const text = Array.from(el.querySelectorAll("h2,h3,p,dt,dd,a"));
        return art.map((svg) => {
          const box = svg.getBoundingClientRect();
          const overlaps = text
            .filter((node) => {
              if (getComputedStyle(node).display === "none") return false;
              const range = document.createRange();
              range.selectNodeContents(node);
              return Array.from(range.getClientRects()).some(
                (r) =>
                  r.width > 0 &&
                  r.height > 0 &&
                  box.left < r.right - 1 &&
                  box.right > r.left + 1 &&
                  box.top < r.bottom - 1 &&
                  box.bottom > r.top + 1,
              );
            })
            .map((node) => node.textContent?.trim().slice(0, 50));
          return {
            chapter: svg.dataset.illustration!,
            overlaps,
            bounded:
              box.left >= paper.left - 1 &&
              box.right <= paper.right + 1 &&
              box.top >= paper.top - 1 &&
              box.bottom <= paper.bottom + 1,
          };
        });
      });
      for (const issue of issues) {
        seen.add(issue.chapter);
        expect(issue.overlaps, issue.chapter).toEqual([]);
        expect(issue.bounded, issue.chapter).toBe(true);
      }
    }
    expect([...seen].sort()).toEqual([
      "contact",
      "education",
      "experience",
      "introduction",
      "skills",
      "work",
    ]);
  });
}

for (const mode of ["no-js", "reduced"] as const) {
  for (const width of [320, 1440]) {
    test(`illustrations preserve native reading in ${mode} at ${width}px`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width, height: width === 320 ? 568 : 900 },
        javaScriptEnabled: mode !== "no-js",
        reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-book-enhanced",
      );
      const overlaps = await page
        .locator("main .chapter-illustration")
        .evaluateAll((nodes) =>
          nodes.flatMap((svg) => {
            if (getComputedStyle(svg).display === "none") return [];
            const box = svg.getBoundingClientRect();
            const surface = svg.closest(".section, .divider, .back-cover")!;
            return Array.from(
              surface.querySelectorAll("h2,h3,p,dt,dd,a"),
            ).flatMap((node) => {
              const range = document.createRange();
              range.selectNodeContents(node);
              return Array.from(range.getClientRects()).some(
                (r) =>
                  r.width > 0 &&
                  r.height > 0 &&
                  box.left < r.right - 1 &&
                  box.right > r.left + 1 &&
                  box.top < r.bottom - 1 &&
                  box.bottom > r.top + 1,
              )
                ? [
                    `${svg.getAttribute("data-illustration")}: ${node.textContent?.trim().slice(0, 50)}`,
                  ]
                : [];
            });
          }),
        );
      expect(overlaps).toEqual([]);
      await expect(page.locator("#introduction img")).toHaveCount(0);
      await context.close();
    });
  }
}
