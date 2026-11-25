import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("gentle desktop input commits promptly and sparse momentum cannot turn another leaf", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  const stops = await page
    .locator(".book-fixed-page")
    .evaluateAll((nodes) =>
      nodes.map((el) => Number((el as HTMLElement).dataset.bookTop)),
    );
  const result = await page.evaluate(async () => {
    const begun = performance.now();
    let started = 0;
    let intentDelivered = 0;
    let turns = 0;
    const onTurn = () => {
      started ||= performance.now() - begun;
      turns++;
    };
    addEventListener("bookturnstart", onTurn);
    const wheel = (deltaY: number) =>
      document.body.dispatchEvent(
        new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }),
      );
    for (let i = 0; i < 4; i++) {
      if (i === 3) intentDelivered = performance.now() - begun;
      wheel(1);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
    // A coalesced bump during motion and widely spaced decaying tail samples
    // are still the same physical input, including after animation completion.
    for (const [delta, pause] of [
      [100, 30],
      [60, 30],
      [20, 30],
      [70, 30],
      [30, 30],
      [10, 30],
      [3, 250],
      [2, 260],
      [1, 260],
    ]) {
      wheel(delta);
      await new Promise((resolve) => setTimeout(resolve, pause));
    }
    removeEventListener("bookturnstart", onTurn);
    return { started, intentDelivered, turns };
  });
  await info.attach("gentle-input-delivery", {
    body: JSON.stringify(result),
    contentType: "application/json",
  });
  // Browser timer throttling can stretch the synthetic 1px input sequence.
  // Measure recognition after the intent reaches the app, not time spent
  // waiting for the test's setTimeout callbacks to deliver that intent.
  expect(result.started).toBeGreaterThanOrEqual(result.intentDelivered);
  expect(result.started - result.intentDelivered).toBeLessThan(50);
  expect(result.turns).toBe(1);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(stops[1]);
  const resumed = await page.evaluate(async () => {
    let turns = 0;
    const count = () => {
      turns++;
    };
    addEventListener("bookturnstart", count);
    const emit = (deltaY: number) =>
      document.body.dispatchEvent(
        new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }),
      );
    for (let i = 0; i < 20; i++) {
      emit(100);
      await new Promise((resolve) => setTimeout(resolve, 32));
    }
    for (const delta of [60, 20, 5, 1, 2, 4, 8, 16, 32]) {
      emit(delta);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    removeEventListener("bookturnstart", count);
    return turns;
  });
  await settleBook(page);
  expect(resumed).toBe(2);
  expect(await page.evaluate(() => scrollY)).toBe(stops[3]);
});

test("diagonal and noncancelable wheel streams cannot bypass the book into native scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  const stops = await page
    .locator(".book-fixed-page")
    .evaluateAll((nodes) =>
      nodes.map((el) => Number((el as HTMLElement).dataset.bookTop)),
    );
  await page.mouse.wheel(500, 300);
  await page.waitForTimeout(120);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  const samples = await page.evaluate(async () => {
    document.body.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: 120,
        bubbles: true,
        cancelable: false,
      }),
    );
    // Model the browser's noncancelable default scroll before its scroll event.
    scrollTo({ top: innerHeight * 6, behavior: "instant" });
    const values: number[] = [];
    for (let i = 0; i < 45; i++) {
      await new Promise(requestAnimationFrame);
      values.push(
        Number(
          document.querySelector<HTMLElement>(".physical-turn")!.dataset
            .scrollY,
        ),
      );
    }
    return values;
  });
  expect(Math.max(...samples)).toBeLessThanOrEqual(stops[1]);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(stops[1]);
  await page.keyboard.press("PageDown");
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(stops[1]);
});

test("cold rapid desktop turns keep intermediate frames and a bounded decorative sheet", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(async () => {
    const samples: { dt: number; p: number; bytes: number; nodes: number }[] =
      [];
    for (let turn = 0; turn < 5; turn++) {
      let last = performance.now();
      document.body.dispatchEvent(
        new WheelEvent("wheel", {
          deltaY: turn ? 3000 : 4,
          bubbles: true,
          cancelable: true,
        }),
      );
      do {
        await new Promise(requestAnimationFrame);
        const now = performance.now();
        const stage = document.querySelector<HTMLElement>(".physical-turn")!;
        samples.push({
          dt: now - last,
          p: Number(stage.dataset.progress),
          bytes: stage.outerHTML.length,
          nodes: stage.querySelectorAll("*").length,
        });
        last = now;
      } while (document.documentElement.dataset.bookInputMoving);
    }
    return samples;
  });
  await info.attach("desktop-frame-samples", {
    body: JSON.stringify(result),
    contentType: "application/json",
  });
  expect(Math.max(...result.map((s) => s.bytes))).toBeLessThan(1_000_000);
  expect(Math.max(...result.map((s) => s.nodes))).toBeLessThan(1800);
  expect(Math.max(...result.map((s) => s.dt))).toBeLessThan(160);
  expect(result.filter((s) => s.p > 0.05 && s.p < 0.95).length).toBeGreaterThan(
    60,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("style[data-book-snapshot-styles]")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("style[data-book-snapshot-styles]")).toHaveCount(1);
  await expect(page.locator(".physical-turn")).toHaveCount(1);
});
