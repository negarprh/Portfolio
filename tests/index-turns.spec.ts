import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 412]) {
  test(`index uses one direct paper turn in both directions at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 915 });
    await page.goto("/");
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    for (const id of ["work", "introduction"]) {
      const source = await page
        .locator('.book-fixed-page[data-page-active="true"]')
        .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
      const destination = await page
        .locator(id === "introduction" ? "#introduction" : "#work .divider")
        .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
      await page.locator("#book-index summary").click();
      await page.locator(`#book-index a[href="#${id}"]`).click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-book-navigating",
        "true",
      );
      const frames = await page.evaluate(async () => {
        const states: {
          p: number;
          hash: string;
          y: number;
          native: number;
          moving: boolean;
          visible: number[];
          elapsed: number;
        }[] = [];
        const start = performance.now();
        do {
          await new Promise(requestAnimationFrame);
          const stage = document.querySelector<HTMLElement>(".physical-turn")!;
          states.push({
            p: Number(stage.dataset.progress),
            hash: location.hash,
            y: Number(stage.dataset.scrollY),
            native: scrollY,
            moving: !!document.documentElement.dataset.bookNavigating,
            visible: Array.from(
              document.querySelectorAll<HTMLElement>(".book-fixed-page"),
            )
              .filter((el) => el.style.visibility === "visible")
              .map((el) => Number(el.dataset.bookTop)),
            elapsed: performance.now() - start,
          });
        } while (
          document.documentElement.dataset.bookNavigating &&
          performance.now() - start < 4000
        );
        return states;
      });
      expect(
        frames.filter((frame) => frame.p > 0.05 && frame.p < 0.95).length,
      ).toBeGreaterThan(3);
      expect(
        frames.every((frame) =>
          frame.visible.every((top) => top === source || top === destination),
        ),
      ).toBe(true);
      expect(frames.at(-1)!.elapsed).toBeLessThan(1000);
      expect(frames.every((frame) => frame.hash === `#${id}`)).toBe(true);
      expect(
        new Set(
          frames.filter((frame) => frame.moving).map((frame) => frame.native),
        ).size,
      ).toBe(1);
      const direction = id === "work" ? 1 : -1;
      for (let i = 1; i < frames.length; i++)
        expect(
          (frames[i].y - frames[i - 1].y) * direction,
        ).toBeGreaterThanOrEqual(0);
      await settleBook(page);
      await expect(page.locator(`#${id}`)).toBeFocused();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
    }
  });
}

test("new selections and wheel input interrupt index travel", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.locator("#book-index summary").click();
  await page.locator('#book-index a[href="#contact"]').click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-book-navigating",
    "true",
  );
  await page.locator("#book-index summary").click();
  await page.locator('#book-index a[href="#introduction"]').click();
  await settleBook(page);
  await expect(page.locator("#introduction")).toBeFocused();
  await page.locator("#book-index summary").click();
  await page.locator('#book-index a[href="#contact"]').click();
  await page.mouse.wheel(0, -200);
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-book-navigating",
  );
  await settleBook(page);
  await expect(page.locator("#contact")).not.toHaveAttribute(
    "data-page-active",
    "true",
  );
});

test("enabling reduced motion during navigation lands immediately at the chosen chapter", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.locator("#book-index summary").click();
  await page.locator('#book-index a[href="#education"]').click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-book-navigating",
    "true",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-book-navigating",
  );
  await expect(page.locator(".physical-turn")).toHaveCount(0);
  await expect(page.locator("#education")).toBeFocused();
  await expect(page.locator("#education .divider h2")).toBeInViewport();
  await expect(page).toHaveURL(/#education$/);
});
