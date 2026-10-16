import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

test("scrolling updates the reload destination and Home returns to the cover", async ({
  page,
}) => {
  await page.goto("/#experience");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await settleBook(page);
  await expect(
    page.locator('#book-index a[href="#experience"]'),
  ).toHaveAttribute("aria-current", "location");
  await page.locator("#introduction").evaluate((el) =>
    scrollTo({
      top: Number((el as HTMLElement).dataset.bookTop),
      behavior: "instant",
    }),
  );
  await settleBook(page);
  await expect(page).toHaveURL(/#introduction$/);
  await page.reload();
  await expect(page.locator("#introduction")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await page.locator("#book-index summary").click();
  await page.locator('#book-index a[href="#top"]').click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page.locator(".cover")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await page.reload();
  await expect(page.locator(".cover")).toHaveAttribute(
    "data-page-active",
    "true",
  );
});

test("explicit index selections retain browser Back and Forward navigation", async ({
  page,
}) => {
  await page.goto("/#introduction");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await settleBook(page);
  for (const id of ["experience", "contact"]) {
    await page.locator("#book-index summary").click();
    await page.locator(`#book-index a[href="#${id}"]`).click();
    await settleBook(page);
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
  await page.goBack();
  await settleBook(page);
  await expect(page.locator("#experience .divider")).toHaveAttribute(
    "data-page-active",
    "true",
  );
  await page.goForward();
  await settleBook(page);
  await expect(page.locator("#contact")).toHaveAttribute(
    "data-page-active",
    "true",
  );
});

test("cover cloth fills the visible viewport with shorter small-viewport content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 412, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  // Model retained small-viewport minimums after browser chrome retracts.
  await page.addStyleTag({
    content: ".cover-art, .cover-content { min-height: 824px; }",
  });
  for (const selector of [
    ".cover > .cover-art",
    ".cover > .cover-art > .cover-content",
  ]) {
    const bottom = await page
      .locator(selector)
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(bottom).toBeCloseTo(1000, 0);
  }
});
