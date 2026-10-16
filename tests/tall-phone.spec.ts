import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("tall phone surfaces fill the viewport after browser-height changes", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 412, height: 824 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  for (const height of [824, 915, 1000, 824]) {
    await page.setViewportSize({ width: 412, height });
    await expect
      .poll(() =>
        page.locator(".book-fixed-page").evaluateAll((nodes) =>
          nodes.every((node) => {
            const rect = node.getBoundingClientRect();
            return rect.top === 0 && Math.abs(rect.bottom - innerHeight) < 1;
          }),
        ),
      )
      .toBe(true);
    await expect(page.locator(".physical-turn")).toHaveCSS(
      "height",
      `${height}px`,
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await settleBook(page);
    expect(
      await page
        .locator(".cover > .cover-art")
        .evaluate((el) =>
          Math.abs(el.getBoundingClientRect().bottom - innerHeight),
        ),
    ).toBeLessThan(1);
    await page
      .locator("#introduction")
      .evaluate((el) =>
        scrollTo(0, Number((el as HTMLElement).dataset.bookTop)),
      );
    await settleBook(page);
    await page.screenshot({ path: `test-results/tall-phone-${height}.png` });
  }
  await expect(page.locator("main")).not.toContainText(
    /open to|development opportunities/i,
  );
  await context.close();
});

test("coalesced touch scroll retains intermediate turns and follows reversal", async ({
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
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 200, y: 750 }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  // Model a scroll event coalesced beyond one screen during a fast native fling.
  const samples = await page.evaluate(async () => {
    scrollTo({ top: 915 * 3, behavior: "instant" });
    const states: { y: number; p: number }[] = [];
    for (let i = 0; i < 12; i++) {
      await new Promise(requestAnimationFrame);
      const stage = document.querySelector<HTMLElement>(".physical-turn")!;
      states.push({
        y: Number(stage.dataset.scrollY),
        p: Number(stage.dataset.progress),
      });
    }
    return states;
  });
  expect(samples[0].y).toBeLessThan(915);
  expect(samples.filter((s) => s.p > 0 && s.p < 1).length).toBeGreaterThan(2);
  for (let i = 1; i < samples.length; i++)
    expect(samples[i].y - samples[i - 1].y).toBeLessThanOrEqual(915 * 0.193);
  // Reverse before catching up: no queued completion in the old direction.
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await settleBook(page);
  await expect(page.locator(".cover")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => scrollTo({ top: 1830, behavior: "instant" }));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  const restoredDistance = await page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    const stage = document.querySelector<HTMLElement>(".physical-turn")!;
    return Math.abs(Number(stage.dataset.scrollY) - scrollY);
  });
  expect(restoredDistance).toBeLessThan(1);
  await context.close();
});

test("contact remains reachable when the visible viewport exceeds the small viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 412, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  // Desktop emulation cannot retract a real address bar. Keep a shorter small
  // viewport probe to exercise the same runway/visible-height mismatch directly.
  await page.addStyleTag({
    content: ".book-viewport-probe { height: 824px !important; }",
  });
  await page.evaluate(() => dispatchEvent(new Event("resize")));
  const top = await page
    .locator("#contact")
    .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    ),
  ).toBeGreaterThanOrEqual(top);
  await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), top);
  await settleBook(page);
  await expect(page.locator("#contact")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await expect(page.locator(".physical-turn")).toBeHidden();
});
