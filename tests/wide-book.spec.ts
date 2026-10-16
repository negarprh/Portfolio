import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const [width, height] of [
  [1920, 1080],
  [2560, 1440],
  [3440, 1440],
  [3840, 2160],
  [5120, 1440],
]) {
  test(`wide book proportions and fore-edges at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator("#introduction")
      .evaluate((el) =>
        scrollTo({
          top: Number((el as HTMLElement).dataset.bookTop),
          behavior: "instant",
        }),
      );
    await settleBook(page);
    const bounds = await page.locator("#introduction").boundingBox();
    expect(bounds!.width).toBeGreaterThan(1240);
    expect(bounds!.width / height).toBeGreaterThan(1.3);
    expect(bounds!.width / height).toBeLessThanOrEqual(1.801);
    expect(Math.abs(bounds!.x * 2 + bounds!.width - width)).toBeLessThan(1);
    const edges = await page
      .locator(".page-stack-left, .page-stack-right")
      .evaluateAll((nodes) =>
        nodes.map((el) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right };
        }),
      );
    expect(Math.abs(edges[0].right - bounds!.x)).toBeLessThan(1);
    expect(Math.abs(edges[1].left - bounds!.x - bounds!.width)).toBeLessThan(1);
    await page.screenshot({ path: `test-results/wide-${width}-${height}.png` });
  });
}
