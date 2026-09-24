import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("native touch scrolling reverses the mobile reveal", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(process.env.BOOK_TEST_BASE_URL || "http://localhost:3000");
  await expect(page.locator("html")).toHaveAttribute(
    "data-book-enhanced",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
  const chapter = page.locator(".divider[data-boundary]").first();
  const top = await chapter.evaluate(
    (el) =>
      el.closest(".chapter-opening")!.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate((y) => scrollTo(0, y), top - 650);
  await settleBook(page);
  const initial = await page.evaluate(() => scrollY);
  const client = await context.newCDPSession(page);
  for (const points of [
    [650, 600, 550, 500],
    [400, 450, 500, 550],
  ]) {
    const before = await page.evaluate(() => scrollY);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 190, y: points[0] }],
    });
    for (const y of points.slice(1)) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 190, y }],
      });
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(100);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await settleBook(page);
    await expect(chapter.locator(".divider-title")).toHaveCSS("opacity", "1");
    if (points[0] === 650)
      expect(await page.evaluate(() => scrollY)).toBeGreaterThan(initial);
    else expect(await page.evaluate(() => scrollY)).toBeLessThan(before);
  }
  await page.screenshot({ path: "test-results/reveal-touch.png" });
  await context.close();
});

for (const width of [1440, 390]) {
  test(`geometric ink reveal reverses and settles at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    const chapter = page.locator(".divider[data-boundary]").first();
    const top = await chapter.evaluate(
      (el) =>
        el.closest(".chapter-opening")!.getBoundingClientRect().top + scrollY,
    );
    const clips = new Map<number, string>();
    for (const progress of [
      0, 0.05, 0.1, 0.2, 0.4, 0.7, 1, 0.7, 0.4, 0.2, 0.1, 0.05, 0, 0.8, 0.15, 1,
    ]) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        top - 850 + 850 * progress,
      );
      await settleBook(page);
      const state = await chapter.evaluate((el) => {
        const title = el.querySelector<HTMLElement>(".divider-title")!;
        const bounds = title.getBoundingClientRect();
        const leaf = el.querySelector(".turn-sheet")!;
        const edge = Math.max(
          0,
          Math.min(
            bounds.width,
            leaf.getBoundingClientRect().right - bounds.left,
          ),
        );
        return {
          edge,
          clip: getComputedStyle(title).clipPath,
          opacity: getComputedStyle(title).opacity,
          progress: el
            .querySelector(".turn-sheet")!
            .getAnimations()[0]
            .effect!.getComputedTiming().progress,
        };
      });
      expect(state.opacity).toBe("1");
      if (Number(state.progress) < 0.5 && state.clip !== "none") {
        // The right strip starts at the physical projected outer edge.
        const edge = Number.parseFloat(state.clip.split(",")[5]);
        expect(edge).toBeCloseTo(state.edge, 1);
      }
      if (clips.has(progress)) expect(state.clip).toBe(clips.get(progress));
      clips.set(progress, state.clip);
      if (Number(state.progress) >= 0.5) expect(state.clip).toBe("none");
      if (progress === 0.1) {
        expect(state.clip).toContain("polygon");
        await page.waitForTimeout(150);
        await expect(chapter.locator(".divider-title")).toHaveCSS(
          "clip-path",
          state.clip,
        );
      }
      if ([0.1, 0.2, 1].includes(progress))
        await page.screenshot({
          path: `test-results/reveal-${width}-${progress}.png`,
        });
    }
    await page.evaluate((y) => scrollTo(0, y), top - 700);
    for (const delta of [120, -60, 9, 12, -8, -120, 240, -180]) {
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(16);
    }
    await settleBook(page);
    await expect(chapter.locator(".divider-title")).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator('[style*="--reading-clip"]')).toHaveCount(0);
    await expect(chapter.locator(".divider-title")).toHaveCSS(
      "clip-path",
      "none",
    );
  });
}
