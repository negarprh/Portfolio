import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 412]) {
  test(`chapter labels leave with the outgoing page at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 915 });
    await page.goto("/");
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    const heads = page.locator(
      "main > section > .chapter-running .chapter-running-label",
    );
    for (const id of ["experience", "skills", "work"]) {
      const pages = page.locator(`#${id} [data-boundary]`);
      const source = pages.last();
      const top = await source.evaluate((el) =>
        Number((el as HTMLElement).dataset.bookTop),
      );
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        top,
      );
      await settleBook(page);
      await expect(
        page.locator(`#${id} > .chapter-running .chapter-running-label`),
      ).toBeVisible();
      const nextTop = await source.evaluate((el) => {
        const all = Array.from(
          document.querySelectorAll<HTMLElement>(".book-fixed-page"),
        );
        return Number(all[all.indexOf(el as HTMLElement) + 1].dataset.bookTop);
      });
      for (const progress of [0.15, 0.55, 0.95, 1, 0.95, 0.55, 0.15]) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: "instant" }),
          nextTop - 915 * 0.85 * (1 - progress),
        );
        await settleBook(page);
        for (const head of await heads.all()) await expect(head).toBeHidden();
      }
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        top,
      );
      await settleBook(page);
      await expect(
        page.locator(`#${id} > .chapter-running .chapter-running-label`),
      ).toBeVisible();
    }
  });
}
