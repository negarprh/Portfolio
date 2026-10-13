import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  test(`cover and chapters share scroll response at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    const transforms: string[][] = [];
    for (const selector of ["#introduction", '[data-boundary="experience"]']) {
      const top = await page
        .locator(selector)
        .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
      await page.evaluate((y) => scrollTo(0, y), top - 850 + 425);
      await settleBook(page);
      transforms.push(
        await page
          .locator(".paper-joint")
          .evaluateAll((es) =>
            es.map((e) => (e as HTMLElement).style.transform),
          ),
      );
      await expect(page.locator(".physical-turn")).toHaveAttribute(
        "data-progress",
        "0.5",
      );
      // Simulated input is sent outside nested reading content.
      await page.mouse.move(width - 2, 2);
      for (const delta of [80, -160, 60, -40]) {
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(20);
      }
      await settleBook(page);
    }
    expect(transforms[0]).toEqual(transforms[1]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(
      page.locator(".physical-turn, .book-fixed-page, .book-page-slot"),
    ).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    await settleBook(page);
  });
}
