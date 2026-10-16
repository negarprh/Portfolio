import { test, expect, type CDPSession } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("phone taps still open the book and navigate the index", async ({
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
  await page.locator(".open-book").tap();
  await expect(page.locator("#introduction")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await page.locator("#book-index summary").tap();
  await page.locator('#book-index a[href="#top"]').tap();
  await expect(page.locator(".cover")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await context.close();
});

async function touch(
  client: CDPSession,
  type: "touchStart" | "touchMove" | "touchEnd" | "touchCancel",
  y?: number,
) {
  await client.send("Input.dispatchTouchEvent", {
    type,
    touchPoints: y === undefined ? [] : [{ x: 200, y }],
  });
}

for (const width of [390, 412]) {
  test(`phone swipes turn exactly one leaf and keep the first cover anchored at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 915 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    const client = await context.newCDPSession(page);
    const pages = page.locator(".book-fixed-page");
    const stops = await pages.evaluateAll((nodes) =>
      nodes.map((el) => Number((el as HTMLElement).dataset.bookTop)),
    );
    await touch(client, "touchStart", 810);
    for (const y of [740, 650, 540]) {
      await touch(client, "touchMove", y);
      const bounds = await page
        .locator(".cover, .cover > .cover-art, .physical-turn")
        .evaluateAll((nodes) =>
          nodes.map((el) => el.getBoundingClientRect().top),
        );
      expect(bounds.every((top) => Math.abs(top) < 1)).toBe(true);
    }
    const held = await page.evaluate(() => scrollY);
    await page.waitForTimeout(120);
    expect(await page.evaluate(() => scrollY)).toBe(held);
    await page.screenshot({
      path: `test-results/controlled-first-turn-${width}.png`,
    });
    await touch(client, "touchEnd");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(stops[1]);
    await settleBook(page);
    for (const index of [2, 3, 4, 5, 4, 3, 2, 1, 0]) {
      const before = await page.evaluate(() => scrollY);
      const forward = stops[index] > before;
      const points = forward
        ? [810, 700, 450, 100, 20]
        : [100, 200, 450, 810, 890];
      await touch(client, "touchStart", points[0]);
      for (const y of points.slice(1)) await touch(client, "touchMove", y);
      await touch(client, "touchEnd");
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(stops[index]);
      await settleBook(page);
      await expect(pages.nth(index)).toHaveAttribute(
        "data-page-active",
        "true",
      );
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".physical-turn")).toHaveCount(0);
    await expect(page.locator(".cover")).toHaveCSS("touch-action", "auto");
    await context.close();
  });
}

test("a new finger brakes a settling turn and a short swipe returns to its page", async ({
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
  await touch(client, "touchStart", 810);
  await touch(client, "touchMove", 700);
  await touch(client, "touchEnd");
  await page.waitForTimeout(30);
  await touch(client, "touchStart", 700);
  const held = await page.evaluate(() => scrollY);
  await page.waitForTimeout(160);
  expect(await page.evaluate(() => scrollY)).toBe(held);
  await touch(client, "touchMove", 720);
  await touch(client, "touchEnd");
  const nearest = held < 915 / 2 ? 0 : 915;
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(nearest);
  await context.close();
});
