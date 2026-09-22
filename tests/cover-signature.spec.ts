import { expect, test } from "@playwright/test";

const name = ".cover > .cover-art .cover-name";

test("signature waits for assets, writes connected paths with an aligned pen, then rests once", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/fonts/*.woff2", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(`${name} > h1`)).toHaveCSS("opacity", "1");
  await expect(page.locator(`${name} > svg`)).toBeHidden();
  release();
  await expect(page.locator(name)).toHaveAttribute("data-signature", "writing");
  const result = await page.locator(name).evaluate(async (el) => {
    const samples: { active: number; tipError: number; offsets: number[] }[] =
      [];
    const start = performance.now();
    while (el.getAttribute("data-signature") === "writing") {
      const paths = Array.from(
        el.querySelectorAll<SVGPathElement>("[data-signature-stroke]"),
      );
      const offsets = paths.map((p) =>
        Number.parseFloat(p.style.strokeDashoffset),
      );
      const active = paths.findIndex(
        // CSS serializes dash lengths with less precision than SVG geometry.
        (p, i) => offsets[i] > 0.01 && offsets[i] < p.getTotalLength() - 0.01,
      );
      const pen = el.querySelector<SVGGElement>(".signature-pen")!;
      if (active >= 0 && pen.style.opacity === "1") {
        const path = paths[active];
        const tip = path.getPointAtLength(
          path.getTotalLength() - offsets[active],
        );
        const matrix = new DOMMatrix(getComputedStyle(pen).transform);
        samples.push({
          active,
          tipError: Math.hypot(tip.x - matrix.e, tip.y - matrix.f),
          offsets,
        });
      }
      await new Promise(requestAnimationFrame);
      if (performance.now() - start > 4000)
        throw new Error("Signature did not settle");
    }
    return { samples, duration: performance.now() - start };
  });
  expect(result.samples.length).toBeGreaterThan(20);
  expect(result.samples.some((s) => s.active === 0)).toBe(true);
  expect(result.samples.some((s) => s.active === 2)).toBe(true);
  expect(Math.max(...result.samples.map((s) => s.tipError))).toBeLessThan(1);
  expect(result.duration).toBeLessThan(2700);
  for (let i = 1; i < result.samples.length; i++) {
    result.samples[i].offsets.forEach((value, index) => {
      expect(value).toBeLessThanOrEqual(
        result.samples[i - 1].offsets[index] + 0.01,
      );
    });
  }
  await expect(page.locator(`${name} > svg`)).toBeHidden();
  await expect(page.locator("#cover-title")).toHaveCSS("opacity", "1");
  await page.evaluate(() => scrollTo(0, 400));
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator(name)).toHaveAttribute(
    "data-signature",
    "complete",
  );
});

for (const mode of ["no-js", "reduced"] as const) {
  test(`${mode}: original heading immediately visible without signature`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== "no-js",
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("#cover-title")).toHaveCSS("opacity", "1");
    await expect(page.locator("#cover-title")).toHaveCSS(
      "font-family",
      "Orbitron, Arial, sans-serif",
    );
    await expect(page.locator(`${name} > svg`)).toBeHidden();
    await context.close();
  });
}

for (const interruption of ["reduce", "scroll"] as const) {
  test(`${interruption} during writing settles immediately without replay`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(name)).toHaveAttribute(
      "data-signature",
      "writing",
    );
    if (interruption === "reduce")
      await page.emulateMedia({ reducedMotion: "reduce" });
    else await page.evaluate(() => scrollTo(0, 150));
    await expect(page.locator(name)).toHaveAttribute(
      "data-signature",
      "complete",
    );
    await expect(page.locator(`${name} > svg`)).toBeHidden();
    await expect(page.locator("#cover-title")).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator(name)).toHaveAttribute(
      "data-signature",
      "complete",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
