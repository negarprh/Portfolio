import { test, expect } from "@playwright/test";

test("the articulated leaf hinges at the gutter with opaque faces and a moving shadow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  const top = await page
    .locator('[data-boundary="experience"]')
    .evaluate((el) => Number((el as HTMLElement).dataset.bookTop));
  await page.evaluate((y) => scrollTo(0, y), top - 425);
  await expect(page.locator(".physical-turn")).toHaveAttribute(
    "data-progress",
    "0.5",
  );
  const state = await page.locator(".physical-turn").evaluate((stage) => {
    const root = stage.querySelector<HTMLElement>(".paper-joint")!;
    return {
      hinge: root.offsetLeft,
      width: stage.clientWidth,
      origin: getComputedStyle(root).transformOrigin,
      faces: Array.from(stage.querySelectorAll(".paper-strip")).map((el) => ({
        opacity: getComputedStyle(el).opacity,
        backface: getComputedStyle(el).backfaceVisibility,
      })),
      shadow: Number(
        getComputedStyle(stage.querySelector(".physical-shadow")!).opacity,
      ),
      ids: stage.querySelectorAll("[id]").length,
      inert: (stage as HTMLElement).inert,
    };
  });
  expect(state.hinge).toBeCloseTo(state.width / 2, 0);
  expect(state.origin.startsWith("0px ")).toBe(true);
  expect(
    state.faces.every((f) => f.opacity === "1" && f.backface === "hidden"),
  ).toBe(true);
  expect(state.shadow).toBeGreaterThan(0);
  expect(state.ids).toBe(0);
  expect(state.inert).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".physical-turn")).toHaveCount(0);
  await expect(page.locator(".page-stacks")).toBeHidden();
});

test("page stacks transfer thickness from right to left and folios mirror", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page
    .locator("#introduction")
    .evaluate((el) =>
      (el as HTMLElement).dataset.bookTop
        ? scrollTo(0, Number((el as HTMLElement).dataset.bookTop))
        : el.scrollIntoView({ behavior: "instant" }),
    );
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
    .last()
    .evaluate((el) =>
      (el as HTMLElement).dataset.bookTop
        ? scrollTo(0, Number((el as HTMLElement).dataset.bookTop))
        : el.scrollIntoView({ behavior: "instant" }),
    );
  await expect
    .poll(async () => (await thickness())[0])
    .toBeGreaterThan(early[0]);
  const late = await thickness();
  expect(late[1]).toBeLessThan(early[1]);
  await page
    .locator(".experience-row")
    .first()
    .evaluate((el) => scrollTo(0, Number((el as HTMLElement).dataset.bookTop)));
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
