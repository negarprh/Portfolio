import { settleBook } from "./motion-helpers";
import { test, expect } from "@playwright/test";

test("cover and chapter share reversible rotation and shadow timelines", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-book-enhanced",
    "true",
  );
  const top = await page
    .locator("#work .chapter-opening")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  const frame = () => settleBook(page);
  for (const progress of [0.2, 0.5, 0.8, 1, 0.8, 0.5, 0.2, 0]) {
    const states = [];
    for (const chapter of [false, true]) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        chapter ? top - 850 + progress * 850 : progress * 850,
      );
      await frame();
      states.push(
        await page.evaluate((chapter) => {
          const leaf = document.querySelector(
            chapter ? "#work .turn-sheet" : ".cover > .turn-sheet",
          )!;
          const shadow = document.querySelector(
            chapter ? "#work .turn-shadow" : ".cover > .turn-shadow",
          )!;
          return [leaf, shadow].map((el) => {
            const a = el.getAnimations()[0];
            if (!a) return { opacity: getComputedStyle(el).opacity };
            return {
              time: a.currentTime,
              keys: (a.effect as KeyframeEffect).getKeyframes(),
              timing: a.effect!.getTiming(),
              // Pixel shadow travel scales with the cover/half-leaf width.
              transform:
                el === leaf ? getComputedStyle(el).transform : undefined,
            };
          });
        }, chapter),
      );
      await page.screenshot({
        path: `test-results/fix-${chapter ? "chapter" : "cover"}-${progress}.png`,
      });
    }
    expect(states[0]).toEqual(states[1]);
  }
  await expect(
    page.locator(".turn-sheet .divider-title, .chapter-back-numeral"),
  ).toHaveCount(0);
  const geometry = await page
    .locator(".cover > .turn-sheet")
    .evaluate((el) => ({
      ratio:
        (el as HTMLElement).offsetWidth /
        (el.parentElement as HTMLElement).offsetWidth,
      origin: getComputedStyle(el).transformOrigin,
      style: getComputedStyle(el).transformStyle,
      back: getComputedStyle(el.querySelector(".sheet-back")!)
        .backfaceVisibility,
    }));
  expect(geometry.ratio).toBe(0.5);
  expect(geometry.origin.startsWith("0px ")).toBe(true);
  expect(geometry.style).toBe("preserve-3d");
  expect(geometry.back).toBe("hidden");
});

for (const mode of ["no-js", "reduced"] as const) {
  test(`${mode}: name and reading pages remain readable in both directions`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== "no-js",
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator('#about, a[href="#about"]')).toHaveCount(0);
    await expect(page.locator("#introduction")).toContainText(
      "LaSalle College",
    );
    await expect(page.locator("#introduction")).toContainText(
      "Canadian Tech Internships",
    );
    await expect(page.locator("#introduction")).toContainText("cat person");
    await expect(page.locator("#intro-title")).toHaveCSS(
      "font-family",
      "Editorial, Georgia, serif",
    );
    await expect(page.locator("#cover-title")).toHaveCSS(
      "font-family",
      "Orbitron, Arial, sans-serif",
    );
    await expect(page.locator("#cover-title em")).toHaveCSS(
      "font-style",
      "normal",
    );
    for (const selector of [
      "#cover-title",
      "#intro-title",
      "#work .divider h2",
      ".flagship h3",
      "#work .divider h2",
      "#intro-title",
      "#cover-title",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await expect(page.locator(selector)).toBeInViewport();
    }
    await expect(page.locator(".cover")).toHaveCSS("transform", "none");
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await page.screenshot({ path: `test-results/fix-${mode}.png` });
    await context.close();
  });
}
