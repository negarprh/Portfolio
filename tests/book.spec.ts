import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const chapterIds = [
  "introduction",
  "experience",
  "work",
  "building",
  "education",
  "skills",
  "about",
  "contact",
];
test("all chapters, real assets, and accessible desktop document", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const id of chapterIds)
    await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.locator(".experience-row h3")).toHaveText([
    "Tail’ed",
    "Lienzo",
    "Ozex",
  ]);
  await expect(page.locator("#experience")).toContainText("1 hour 45 minutes");
  const badImages = await page.locator("img").evaluateAll(async (elements) => {
    const images = elements as HTMLImageElement[];
    await Promise.all(
      images.map((image) => {
        image.loading = "eager";
        return image.decode().catch(() => {});
      }),
    );
    return images
      .filter((image) => !image.naturalWidth)
      .map((image) => image.src);
  });
  expect(badImages).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "test-results/desktop-full.png",
    fullPage: true,
  });
});
test("bookmark jumps to each chapter, closes, and supports Escape", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const id of chapterIds) {
    await page.locator(".book-index summary").click();
    await page.locator(`.book-index a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(".book-index")).not.toHaveAttribute("open", "");
    await expect(page.locator(`#${id}`)).toBeFocused();
    expect(
      Math.abs(
        await page
          .locator(`#${id}`)
          .evaluate((el) => el.getBoundingClientRect().top),
      ),
    ).toBeLessThan(50);
  }
  await page.locator(".book-index summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".book-index summary")).toBeFocused();
  await expect(page.locator(".book-index")).not.toHaveAttribute("open", "");
});
test("mobile is readable, fits the viewport, and index is accessible", async ({
  browser,
}) => {
  for (const width of [320, 390, 768]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.locator(".book-index summary").click();
    await expect(page.locator(".book-index nav")).toBeInViewport();
    await page.locator('.book-index a[href="#contact"]').click();
    await expect(page.locator("#contact")).toBeFocused();
    await page.goto("/");
    if (width === 390) {
      await page.screenshot({ path: "test-results/mobile-cover.png" });
      await page.screenshot({
        path: "test-results/mobile-full.png",
        fullPage: true,
      });
    }
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
    await context.close();
  }
});
test("JavaScript disabled: complete content and native chapter links", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  for (const id of chapterIds)
    await expect(page.locator(`#${id}`)).toBeVisible();
  await page.locator(".book-index summary").click();
  await page.locator('.book-index a[href="#skills"]').click();
  await expect(page).toHaveURL(/#skills$/);
  await page.locator(".book-index summary").click();
  await expect(page.locator("#skills h2")).toBeInViewport();
  await page.screenshot({ path: "test-results/no-js-skills.png" });
  await context.close();
});
test("page turns run once per boundary and respect live reduced-motion changes", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const original = Element.prototype.animate;
    (window as unknown as { turns: number }).turns = 0;
    Element.prototype.animate = function (...args) {
      if (this.classList.contains("turn-sheet"))
        (window as unknown as { turns: number }).turns++;
      return original.apply(this, args);
    };
  });
  await page.locator('[data-boundary="experience"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(950);
  const first = await page.evaluate(
    () => (window as unknown as { turns: number }).turns,
  );
  expect(first).toBe(1);
  await page
    .locator("#top")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.locator('[data-boundary="experience"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(950);
  expect(
    await page.evaluate(() => (window as unknown as { turns: number }).turns),
  ).toBe(first);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator('[data-boundary="work"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  expect(
    await page.evaluate(() => (window as unknown as { turns: number }).turns),
  ).toBe(first);
  await expect(page.locator(".cover-content")).toHaveCSS("transform", "none");
});
