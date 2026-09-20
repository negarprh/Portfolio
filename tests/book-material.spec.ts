import { test, expect } from "@playwright/test";

test("the outgoing leaf hinges at the gutter, stays opaque, and casts a moving shadow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page
    .locator('[data-boundary="experience"]')
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect(
    page.locator('[data-boundary="experience"] .turn-sheet'),
  ).toHaveCount(2);
  await expect(
    page.locator('[data-boundary="experience"] .outgoing-content'),
  ).toHaveCount(0);
  const state = await page
    .locator('[data-boundary="experience"]')
    .evaluate((boundary) => {
      const animations = boundary.getAnimations({ subtree: true });
      for (const animation of animations) {
        animation.pause();
        animation.currentTime = 550;
      }
      const sheet = boundary.querySelector<HTMLElement>(".turn-sheet")!;
      const shadow = boundary.querySelector<HTMLElement>(".turn-shadow")!;
      const front = boundary.querySelector<HTMLElement>(".sheet-front")!;
      const rect = boundary.getBoundingClientRect();
      const keys = animations.flatMap((animation) =>
        (animation.effect as KeyframeEffect)
          .getKeyframes()
          .flatMap((frame) => Object.keys(frame)),
      );
      return {
        keys,
        opacity: getComputedStyle(front).opacity,
        origin: getComputedStyle(sheet).transformOrigin,
        shadowOpacity: getComputedStyle(shadow).opacity,
        shadowTransform: getComputedStyle(shadow).transform,
        boundWidth: rect.width,
        sheetWidth: sheet.offsetWidth,
        duplicates: boundary.querySelectorAll(".outgoing-content [id]").length,
        inert: sheet.inert,
      };
    });
  expect(state.opacity).toBe("1");
  expect(state.origin.startsWith("0px ")).toBeTruthy();
  expect(Math.abs(state.sheetWidth - state.boundWidth / 2)).toBeLessThan(2);
  expect(Number(state.shadowOpacity)).toBeGreaterThan(0);
  expect(state.shadowTransform).not.toBe("none");
  expect(state.duplicates).toBe(0);
  expect(state.inert).toBeTruthy();
  expect(
    state.keys.filter(
      (key) =>
        ![
          "transform",
          "opacity",
          "clipPath",
          "offset",
          "computedOffset",
          "easing",
          "composite",
        ].includes(key),
    ),
  ).toEqual([]);
  await page.screenshot({ path: "test-results/material-turn.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute("data-book-enhanced");
  await expect(page.locator(".page-stacks")).toBeHidden();
  await expect(
    page.locator('[data-boundary="experience"] .turn-sheet').first(),
  ).toBeHidden();
  await expect(
    page.locator('[data-boundary="experience"] .outgoing-content'),
  ).toHaveCount(0);
});

test("page stacks transfer thickness from right to left and folios mirror", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page
    .locator("#introduction")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  const thickness = () =>
    page
      .locator(".page-stack")
      .evaluateAll((nodes) =>
        nodes.map((node) =>
          Number(getComputedStyle(node).transform.split("(")[1].split(",")[0]),
        ),
      );
  await expect
    .poll(async () =>
      Number(
        await page
          .locator(".page-stacks")
          .evaluate((el) => getComputedStyle(el).opacity),
      ),
    )
    .toBeGreaterThan(0.8);
  const early = await thickness();
  await page
    .locator(".skills-spread")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(async () => (await thickness())[0])
    .toBeGreaterThan(early[0]);
  const late = await thickness();
  expect(late[1]).toBeLessThan(early[1]);
  const folio = page.locator(".experience-row .folio").first();
  await expect(folio.locator(".folio-verso")).toBeVisible();
  await expect(folio.locator(".folio-recto")).toBeVisible();
  await expect(folio.locator(".folio-flat")).toBeHidden();
  await page.screenshot({ path: "test-results/material-late.png" });
});

test("no-JS desktop preserves the original flat paper and content", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-book-enhanced");
  await expect(page.locator(".page-stacks")).toBeHidden();
  await expect(page.locator(".introduction")).toHaveCSS(
    "background-image",
    "none",
  );
  await expect(page.locator(".introduction .folio-flat")).toBeVisible();
  await page.locator(".book-index summary").click();
  await page.locator('.book-index a[href="#experience"]').click();
  await expect(page).toHaveURL(/#experience$/);
  await context.close();
});
