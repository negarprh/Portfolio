import { expect, type Page } from "@playwright/test";

/** Assert the short response has settled at native scroll position. */
export async function settleBook(page: Page) {
  // Input dispatch returns before the browser applies a wheel delta.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const y = scrollY;
          const stage = document.querySelector<HTMLElement>(".physical-turn");
          return (
            !!stage &&
            !document.documentElement.dataset.bookInputMoving &&
            !document.documentElement.dataset.bookNavigating &&
            Math.abs(Number(stage.dataset.scrollY) - y) < 0.01
          );
        }),
      { timeout: 5000, intervals: [16, 32, 64] },
    )
    .toBe(true);
}
