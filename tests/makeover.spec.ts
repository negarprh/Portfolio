import { test, expect } from "@playwright/test";

test("seal waits for fonts, enters once, and only the dot loops", async ({
  page,
}) => {
  let release!: () => void;
  const fonts = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/fonts/*.woff2", async (route) => {
    await fonts;
    await route.continue();
  });
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    (window as unknown as { sealEntries: number }).sealEntries = 0;
    Element.prototype.animate = function (...args) {
      if (this.classList.contains("cover-seal"))
        (window as unknown as { sealEntries: number }).sealEntries++;
      return original.apply(this, args);
    };
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).not.toHaveAttribute("data-cover-ready");
  expect(
    await page.evaluate(
      () => (window as unknown as { sealEntries: number }).sealEntries,
    ),
  ).toBe(0);
  release();
  await expect(page.locator("html")).toHaveAttribute(
    "data-cover-ready",
    "true",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { sealEntries: number }).sealEntries,
      ),
    )
    .toBe(1);
  await expect
    .poll(() =>
      page
        .locator(".cover > .cover-art .cover-seal")
        .evaluate((el) => el.getAnimations().length),
    )
    .toBe(0);
  await page
    .locator("#introduction")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page
    .locator(".cover")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  expect(
    await page.evaluate(
      () => (window as unknown as { sealEntries: number }).sealEntries,
    ),
  ).toBe(1);
  const loops = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.effect?.getTiming().iterations === Infinity)
      .map((a) => (a.effect as KeyframeEffect).target?.className),
  );
  expect(loops).toEqual(["accent cover-dot"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute("data-book-enhanced");
  await expect(page.locator(".cover .sheet-front .cover-art")).toHaveCount(0);
  await expect(page.locator(".cover-dot")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".cover .cover-seal")).toHaveCSS("opacity", "1");
});

test("no-JS and reduced-motion keep seal and all three role anchors readable", async ({
  browser,
}) => {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({
      javaScriptEnabled,
      reducedMotion: "reduce",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".cover .cover-seal")).toBeVisible();
    await expect(page.locator(".cover-dot")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".role-anchor")).toHaveCount(3);
    for (const role of [".role-0", ".role-1", ".role-2"]) {
      await page.locator(role).scrollIntoViewIfNeeded();
      await expect(page.locator(`${role} .role-anchor`)).toBeVisible();
      await expect(
        page.locator(`${role} .stack-chips img`).first(),
      ).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await context.close();
  }
});
