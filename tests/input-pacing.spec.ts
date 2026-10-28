import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("a fast phone flick exposes intermediate turning frames instead of jumping", async ({
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
  // Measure gesture pacing after the one-time entrance and snapshot warm-up,
  // rather than including cold asset/style preparation in the turn duration.
  await expect(
    page.locator(".physical-turn .paper-verso h2").first(),
  ).toContainText("Hi, I’m Negar!");
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 200, y: 810 }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 200, y: 100 }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  const samples = await page.evaluate(async () => {
    const values: { y: number; p: number; at: number }[] = [];
    const start = performance.now();
    do {
      await new Promise(requestAnimationFrame);
      const stage = document.querySelector<HTMLElement>(".physical-turn")!;
      values.push({
        y: scrollY,
        p: Number(stage.dataset.progress),
        at: performance.now() - start,
      });
    } while (
      document.documentElement.dataset.bookInputMoving &&
      performance.now() - start < 3000
    );
    return values;
  });
  expect(samples.at(-1)!.at).toBeGreaterThan(400);
  expect(samples.at(-1)!.at).toBeLessThan(1400);
  expect(
    samples.filter((s) => s.p > 0.05 && s.p < 0.95).length,
  ).toBeGreaterThan(10);
  // CDP may deliver several frames before sampling starts under parallel load.
  // Duration, intermediate progress, and consecutive-frame limits check pacing
  // without assuming the first captured frame is the first animation frame.
  for (let i = 1; i < samples.length; i++)
    expect(samples[i].y - samples[i - 1].y).toBeLessThan(915 * 0.1);
  await expect(page.locator("#introduction")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await context.close();
});

test("large trackpad deltas are slowed and reversing discards pending forward travel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(250);
  const first = await page.evaluate(() => scrollY);
  expect(first).toBeGreaterThan(100);
  expect(first).toBeLessThan(500);
  await page.mouse.wheel(0, -3000);
  const reversed = await page.evaluate(() => scrollY);
  await page.waitForTimeout(120);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(reversed);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
});
