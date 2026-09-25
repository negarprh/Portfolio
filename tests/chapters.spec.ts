import { test, expect } from "@playwright/test";

test("three adjacent chapters are identifiable with every animation stopped", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  if (
    !(await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ))
  )
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
  await page.evaluate(() => document.fonts.ready);
  const papers: string[] = [];
  for (const [id, selector, label] of [
    ["experience", ".experience-row:last-child", "Experience"],
    ["work", ".flagship", "Projects"],
    ["skills", "#skills .skills-spread", "Skills"],
  ]) {
    await page
      .locator(selector)
      .first()
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await page.evaluate(() =>
      document.getAnimations().forEach((a) => {
        if (a.effect?.getTiming().iterations !== Infinity) a.finish();
        a.pause();
      }),
    );
    const head = page.locator(`#${id} .chapter-running-label`);
    await expect(head).toContainText(label);
    await expect(head).toBeInViewport();
    const bounds = await head.boundingBox();
    expect(bounds!.y).toBeLessThan(20);
    papers.push(
      await page
        .locator(selector)
        .first()
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--chapter-paper"),
        ),
    );
    await page.screenshot({ path: `test-results/still-${id}.png` });
  }
  expect(new Set(papers).size).toBe(3);
});

test("a fast wheel scroll holds the full chapter title without blocking scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-book-enhanced",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("#work .chapter-opening")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 500);
  await expect(page.locator("#work .divider h2")).toBeInViewport();
  const divider = await page.locator("#work .divider").boundingBox();
  expect(Math.abs(divider!.y)).toBeLessThan(3);
  const content = await page.locator(".flagship").boundingBox();
  expect(content!.y).toBeGreaterThan(1000);
  const previous = await page
    .locator("#experience .chapter-running-label")
    .boundingBox();
  const current = await page
    .locator("#work .chapter-running-label")
    .boundingBox();
  expect(previous!.y + previous!.height).toBeLessThan(current!.y);
});

test("reduced motion retains the flat unpinned layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#work .chapter-opening")).toHaveCSS(
    "display",
    "contents",
  );
  await expect(page.locator("#work .divider")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(page.locator("#work .chapter-running")).toBeHidden();
});
