import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  test(`wheel notches settle continuously and reverse without queues at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    await settleBook(page);
    const original = await page.locator("#introduction").elementHandle();
    const introTop = await page
      .locator("#introduction")
      .evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate(() => {
      (window as any).turnSamples = [];
      (window as any).sampling = true;
      const sample = () => {
        (window as any).turnSamples.push({
          y: scrollY,
          time: Number(
            document.querySelector(".cover > .turn-sheet")!.getAnimations()[0]
              .currentTime,
          ),
        });
        if ((window as any).sampling) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await page.mouse.wheel(0, 120);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(120);
    await settleBook(page);
    const samples = await page.evaluate(() => {
      (window as any).sampling = false;
      return (window as any).turnSamples as { y: number; time: number }[];
    });
    const target = (120 / 850) * 1800;
    const intermediate = new Set(
      samples
        .filter((s) => s.y === 120 && s.time > 0 && s.time < target - 0.1)
        .map((s) => s.time),
    );
    expect(intermediate.size).toBeGreaterThanOrEqual(3);
    expect(samples.every((s) => s.time >= 0 && s.time <= target + 0.01)).toBe(
      true,
    );
    // Reverse before settling, then demand the exact latest native position.
    for (const delta of [240, -120, 360, -480, 120]) {
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(20);
    }
    await settleBook(page);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await settleBook(page);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(50);
    }
    await settleBook(page);
    expect(
      await original!.evaluate(
        (el) => el === document.querySelector("#introduction"),
      ),
    ).toBe(true);
    expect(
      await page
        .locator("#introduction")
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBe(introTop);
    await expect(page.locator(".cover > .cover-art")).toHaveCSS("opacity", "0");
    await expect(page.locator("#intro-title")).toBeInViewport();
    const link = page.locator("#introduction a").first();
    await expect(link).toBeVisible();
    await link.click({ trial: true });
    await page.mouse.wheel(0, -240);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-book-enhanced",
    );
    expect(
      await page
        .locator(".turn-sheet")
        .evaluateAll(
          (nodes) => nodes.flatMap((el) => el.getAnimations()).length,
        ),
    ).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await settleBook(page);
  });
}
