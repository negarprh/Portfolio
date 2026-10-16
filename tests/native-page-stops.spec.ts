import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("fast native touch flings stop at the next spread and reverse", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  const client = await context.newCDPSession(page);
  const topAt = (index: number) =>
    page
      .locator(".book-fixed-page")
      .nth(index)
      .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
  const fling = async (forward: boolean) => {
    const points = forward
      ? [810, 740, 540, 300, 100]
      : [100, 180, 380, 620, 810];
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 200, y: points[0] }],
    });
    for (const y of points.slice(1)) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 200, y }],
      });
      await page.waitForTimeout(12);
    }
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  };
  // Measure fling physics after the inert sheet has finished warming. Otherwise
  // synchronous snapshot preparation changes protocol delivery intervals.
  await expect(
    page.locator(".physical-turn .paper-verso h2").first(),
  ).toContainText("Hi, I’m Negar!");
  for (const index of [1]) {
    const top = await topAt(index);
    const before = await page.evaluate(() => scrollY);
    await fling(top > before);
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-touch-pages",
      "true",
    );
    await expect
      .poll(() => page.evaluate(() => scrollY), { timeout: 5000 })
      .toBe(top);
    await settleBook(page);
    await expect(page.locator(".book-fixed-page").nth(index)).toHaveAttribute(
      "data-page-active",
      "true",
    );
  }
  // Return to free input before positioning a reading spread. Reloading here
  // races browser scroll restoration against the test's programmatic landing.
  await page.mouse.wheel(0, 1);
  await settleBook(page);
  await page
    .locator(".role-0")
    .evaluate((el) =>
      scrollTo({
        top: Number((el as HTMLElement).dataset.bookTop),
        behavior: "instant",
      }),
    );
  await settleBook(page);
  await expect(
    page.locator(".physical-turn .paper-recto h3").first(),
  ).toHaveText("Tail’ed");
  for (const index of [4, 5, 4, 3]) {
    const top = await topAt(index);
    const before = await page.evaluate(() => scrollY);
    await fling(top > before);
    await expect
      .poll(() => page.evaluate(() => scrollY), { timeout: 5000 })
      .toBe(top);
    await settleBook(page);
    await expect(
      page.locator(".physical-turn .paper-recto h3").first(),
    ).toHaveText(["", "", "", "Tail’ed", "Lienzo", "Ozex"][index]);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-book-touch-pages",
  );
  await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
  await context.close();
});

test("touching again brakes a visual backlog at the visible page", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  const client = await context.newCDPSession(page);
  const touch = () =>
    client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 200, y: 700 }],
    });
  const release = () =>
    client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  await touch();
  await release();
  await page.evaluate(() => scrollTo({ top: 6000, behavior: "instant" }));
  await page.waitForTimeout(80);
  const before = await page.evaluate(() => scrollY);
  await touch();
  const state = await page.evaluate(() => ({
    native: scrollY,
    visual: Number(
      document.querySelector<HTMLElement>(".physical-turn")!.dataset.scrollY,
    ),
  }));
  expect(state.native).toBeLessThan(before);
  expect(Math.abs(state.native - state.visual)).toBeLessThan(1);
  await release();
  await settleBook(page);
  await context.close();
});
