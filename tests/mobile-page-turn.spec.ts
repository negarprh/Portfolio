import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("native phone swipes turn and reverse the opening, interior and closing sheets", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  const client = await context.newCDPSession(page);
  for (const selector of ["#introduction", ".skills-spread", "#contact"]) {
    const top = await page
      .locator(selector)
      .first()
      .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
    await page.evaluate((y) => scrollTo(0, y), top - 844 * 0.85 * 0.7);
    await settleBook(page);
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
      const after = await page.evaluate(() => scrollY);
      if (points[0] === 650) expect(after).toBeGreaterThan(before);
      else expect(after).toBeLessThan(before);
      expect(
        await page
          .locator(".book-fixed-page")
          .evaluateAll((es) =>
            es.every((el) => el.getBoundingClientRect().top === 0),
          ),
      ).toBe(true);
      await expect(page.locator(".physical-turn")).toBeVisible();
    }
  }
  // Input over reading text must scroll the document, never a nested page.
  const top = await page
    .locator("#introduction")
    .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
  await page.evaluate((y) => scrollTo(0, y), top);
  await settleBook(page);
  await page.mouse.move(190, 400);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(top);
  expect(
    await page.locator("#introduction").evaluate((el) => el.scrollTop),
  ).toBe(0);
  expect(
    await page
      .locator("#introduction")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBe(0);
  // After crossing the phone's left hinge, the sheet must not paint reverse
  // text over the incoming page. Compare actual pixels with that sheet hidden.
  await page.locator("#introduction").evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.evaluate((y) => scrollTo(0, y), top - 844 * 0.85 * 0.4);
  await settleBook(page);
  const paragraph = page.locator("#introduction .body-copy").first();
  const withSheet = await paragraph.screenshot();
  await page.locator(".physical-turn").evaluate((el) => {
    el.style.visibility = "hidden";
  });
  expect(await paragraph.screenshot()).toEqual(withSheet);
  await context.close();
});
