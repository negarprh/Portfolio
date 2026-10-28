import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 412]) {
  test(`education has one heading and stays reachable after measurement at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 915 });
    await page.goto("/");
    await expect(page.locator(".book-fixed-page")).toHaveCount(16);
    await page.evaluate(() => document.fonts.ready);
    const education = page.locator(".education-spread");
    await education.evaluate((el) =>
      scrollTo({
        top: Number((el as HTMLElement).dataset.bookTop),
        behavior: "instant",
      }),
    );
    await settleBook(page);
    await expect(education).toHaveAttribute("data-page-active", "true");
    const before = await page.evaluate(() => scrollY);
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => dispatchEvent(new Event("resize")));
      await settleBook(page);
      expect(await page.evaluate(() => scrollY)).toBe(before);
      await expect(education).toHaveAttribute("data-page-active", "true");
    }
    await expect(education.locator("h3")).toHaveText(
      "Computer Science: Programming",
    );
    await expect(education.locator("h4")).toHaveCount(0);
    await education.screenshot({
      path: `test-results/education-clean-${width}.png`,
    });
  });
}
