import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  test(`every spread stays bounded and fully readable at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator(".book-fixed-page")).toHaveCount(16);
    const pages = page.locator(".book-fixed-page");
    for (let i = 1; i < (await pages.count()); i++) {
      const surface = pages.nth(i);
      const top = await surface.evaluate((el) =>
        Number((el as HTMLElement).dataset.bookTop),
      );
      for (const p of [0.25, 0.6, 1, 0.6, 1]) {
        await page.evaluate((y) => scrollTo(0, y), top - 850 + p * 850);
        await settleBook(page);
        expect(
          await surface.evaluate((el) => el.getBoundingClientRect().top),
        ).toBe(0);
        await expect(surface).toHaveCSS("transform", "none");
      }
      await expect(surface).toBeVisible();
      await expect(surface).not.toHaveAttribute("inert");
      // All content fits without a nested scrolling surface.
      const extent = await surface.evaluate((el) => {
        const page = el as HTMLElement;
        page.scrollTop = page.scrollHeight;
        return {
          scroll: page.scrollTop,
          overflow: page.scrollHeight - page.clientHeight,
        };
      });
      expect(extent.scroll).toBe(0);
      expect(extent.overflow).toBeLessThanOrEqual(1);
      await surface.evaluate((el) => {
        el.scrollTop = 0;
      });
      if ([1, 4, 8, 14, 15].includes(i))
        await page.screenshot({
          path: `test-results/bounded-${width}-${i}.png`,
        });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
