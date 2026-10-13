import { expect, test } from "@playwright/test";

const name = ".cover > .cover-art .cover-name";

test("signature waits for assets, reveals the final Orbitron lettering with the pen, then rests once", async ({
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
    const samples: number[][] = [];
    const start = performance.now();
    while (el.getAttribute("data-signature") === "writing") {
      samples.push(
        Array.from(el.querySelectorAll<HTMLElement>("[data-name-line]")).map(
          (line) => Number.parseFloat(line.style.clipPath.split(" ")[1]),
        ),
      );
      await new Promise(requestAnimationFrame);
      if (performance.now() - start > 4000)
        throw new Error("Signature did not settle");
    }
    return samples;
  });
  expect(result.length).toBeGreaterThan(20);
  expect(result.some((sample) => sample[0] === 0)).toBe(true);
  expect(result.some((sample) => sample[1] > 0 && sample[1] < 100)).toBe(true);
  for (let i = 1; i < result.length; i++) {
    result[i].forEach((value, index) =>
      expect(value).toBeLessThanOrEqual(result[i - 1][index] + 0.01),
    );
  }
  await expect(page.locator(`${name} [data-name-line]`).first()).toHaveCSS(
    "font-family",
    "Orbitron, Arial, sans-serif",
  );
  await expect(page.locator(`${name} [data-name-line]`).first()).toHaveCSS(
    "clip-path",
    "none",
  );
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
