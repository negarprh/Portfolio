import { settleBook } from "./motion-helpers";
import { test, expect } from "@playwright/test";

test("cover and chapter share reversible curvature and shadow geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  for (const progress of [0.2, 0.5, 0.8, 0.8, 0.5, 0.2]) {
    const states = [];
    for (const selector of ["#introduction", "#work .divider"]) {
      const top = await page
        .locator(selector)
        .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
      await page.evaluate((y) => scrollTo(0, y), top - 850 + progress * 850);
      await settleBook(page);
      states.push(
        await page.locator(".physical-turn").evaluate((stage) => ({
          angles: Array.from(
            stage.querySelectorAll<HTMLElement>(".paper-joint"),
          ).map((el) => el.style.transform),
          shadow: (stage.querySelector(".physical-shadow") as HTMLElement).style
            .cssText,
          origin: getComputedStyle(stage.querySelector(".paper-joint")!)
            .transformOrigin,
          faces: Array.from(stage.querySelectorAll(".paper-strip")).map(
            (el) => getComputedStyle(el).backfaceVisibility,
          ),
        })),
      );
    }
    expect(states[0].angles).toEqual(states[1].angles);
    expect(states[0].shadow).toBe(states[1].shadow);
    expect(states[0].origin.startsWith("0px ")).toBe(true);
    expect(states[1].origin.startsWith("0px ")).toBe(true);
    expect(states[0].faces.every((face) => face === "hidden")).toBe(true);
  }
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
    await expect(page.locator("#education")).toContainText("LaSalle College");
    await expect(page.locator("#introduction")).toContainText(
      "Backend / Full-Stack Developer",
    );
    await expect(page.locator("#introduction")).toContainText(
      "open-source project",
    );
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
