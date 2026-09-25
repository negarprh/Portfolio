import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const chapterIds = [
  "introduction",
  "experience",
  "work",
  "building",
  "education",
  "skills",
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
  await expect(page.locator("#experience")).toContainText(
    "4.7 hours to 1.8 hours",
  );
  await expect(page.locator("#education .education-spread")).toHaveCount(1);
  await expect(page.locator(".education-degree")).toHaveText(
    "DEC / Diploma of College Studies",
  );
  await expect(page.locator(".education-program")).toHaveText(
    "Computer Science: Programming",
  );
  await expect(page.locator(".education-dates")).toHaveText("2023 - 2026");
  await expect(page.locator(".education-context")).toHaveText(
    "A three-year technical program centered on software development, combining computer science fundamentals with hands-on application.",
  );
  await expect(page.locator(".education-field")).not.toContainText(
    /2023|2026|internship/i,
  );
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
test("page-turn timelines are reused on reversal and cleared for reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator('[data-boundary="experience"]')
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator('[data-boundary="experience"] .turn-sheet')
        .first()
        .evaluate((el) => el.getAnimations().length),
    )
    .toBe(1);
  await page.evaluate(() => {
    (window as unknown as { leaf: Animation }).leaf = document
      .querySelector('[data-boundary="experience"] .turn-sheet')!
      .getAnimations()[0];
  });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page
    .locator('[data-boundary="experience"]')
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  expect(
    await page.evaluate(
      () =>
        document
          .querySelector('[data-boundary="experience"] .turn-sheet')!
          .getAnimations()[0] ===
        (window as unknown as { leaf: Animation }).leaf,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute("data-book-enhanced");
  expect(
    await page
      .locator(".turn-sheet")
      .evaluateAll((nodes) => nodes.flatMap((el) => el.getAnimations()).length),
  ).toBe(0);
  await expect(page.locator(".cover")).toHaveCSS("transform", "none");
});
