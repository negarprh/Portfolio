import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("phone reading input scrolls the document and reverse sheet text stays hidden", async ({
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
