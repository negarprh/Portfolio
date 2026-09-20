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
          const travel = innerHeight * 0.85;
          return Array.from(
            document.querySelectorAll(".cover, [data-boundary]"),
          ).every((el) => {
            const top = el.classList.contains("cover")
              ? travel
              : (el.closest(".chapter-opening") || el).getBoundingClientRect()
                  .top + y;
            const progress = Math.max(
              0,
              Math.min(1, (y - top + travel) / travel),
            );
            const animation = el
              .querySelector(".turn-sheet")
              ?.getAnimations()[0];
            return (
              animation &&
              Math.abs(Number(animation.currentTime) - progress * 1800) < 0.01
            );
          });
        }),
      { timeout: 1500, intervals: [16, 32, 64] },
    )
    .toBe(true);
}
