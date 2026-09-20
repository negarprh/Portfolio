import { settleBook } from "./motion-helpers";
import { test, expect } from "@playwright/test";

for (const input of ["wheel", "trackpad"]) {
  test(`${input}: every leaf follows a complete down/up journey and rapid reversals`, async ({
    page,
  }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    const total = await page.locator("[data-boundary]").count();
    const observed = [new Set<number>(), new Set<number>()];
    const frame = () => settleBook(page);
    const inspect = async (direction: number) => {
      const state = await page.evaluate(() => {
        const y = scrollY;
        const errors: string[] = [];
        const active: number[] = [];
        document
          .querySelectorAll<HTMLElement>("[data-boundary]")
          .forEach((el, i) => {
            const top =
              (el.closest(".chapter-opening") || el).getBoundingClientRect()
                .top + y;
            const progress = Math.max(
              0,
              Math.min(
                1,
                (y - top + innerHeight * 0.85) / (innerHeight * 0.85),
              ),
            );
            const animations = el.querySelector(".turn-sheet")!.getAnimations();
            if (progress > 0.001 && progress < 0.999) active.push(i);
            if (progress > 0 && animations.length !== 1)
              errors.push(`leaf ${i}: ${animations.length} rotations`);
            for (const animation of animations) {
              if (
                animation.playState !== "paused" ||
                Math.abs(Number(animation.currentTime) - progress * 1800) > 2
              )
                errors.push(`leaf ${i}: out of sync`);
            }
          });
        return {
          y,
          max: document.documentElement.scrollHeight - innerHeight,
          errors,
          active,
        };
      });
      expect(state.errors).toEqual([]);
      state.active.forEach((i) => observed[direction].add(i));
      return state;
    };
    // Coarse notched-wheel input vs. fine variable deltas with an inertial tail.
    const deltas =
      input === "wheel" ? [480] : [18, 42, 78, 115, 140, 128, 102, 75, 48, 24];
    for (const direction of [0, 1]) {
      for (let step = 0; step < 1200; step++) {
        await page.mouse.wheel(
          0,
          deltas[step % deltas.length] * (direction ? -1 : 1),
        );
        await frame();
        const state = await inspect(direction);
        if (
          (!direction && state.y >= state.max - 1) ||
          (direction && state.y <= 1)
        )
          break;
        if (step === 1199) throw new Error("Scroll did not reach the end");
      }
      expect(observed[direction].size).toBe(total);
    }
    await expect(page.locator(".cover > .turn-sheet")).toHaveCSS(
      "transform",
      "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.000454545, 0, 0, 0, 1)",
    );
    await page.locator("#work .chapter-opening").evaluate((el) =>
      scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 500,
        behavior: "instant",
      }),
    );
    for (const delta of [720, -960, 1500, -1800, 420, -220])
      await page.mouse.wheel(0, delta);
    await frame();
    await inspect(0);
    await page.screenshot({ path: `test-results/${input}-reverse-turn.png` });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-book-enhanced",
    );
    await expect(page.locator(".cover")).toHaveCSS("transform", "none");
    expect(
      await page
        .locator(".turn-sheet")
        .evaluateAll((nodes) => nodes.flatMap((n) => n.getAnimations()).length),
    ).toBe(0);
  });
}

test("both covers share their material and remain complete in static fallbacks", async ({
  browser,
}) => {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({
      javaScriptEnabled,
      reducedMotion: javaScriptEnabled ? "reduce" : "no-preference",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("/");
    const materials = await page
      .locator(".cover, .back-cover")
      .evaluateAll((nodes) =>
        nodes.map((el) => ({
          texture: getComputedStyle(el).backgroundImage,
          border: getComputedStyle(el, "::after").boxShadow,
          position: getComputedStyle(el).position,
        })),
      );
    expect(materials[0].texture).toBe(materials[1].texture);
    expect(materials[0].border).toBe(materials[1].border);
    expect(materials[0].position).toBe("relative");
    await expect(page.locator(".back-cover")).toContainText(
      "software engineering opportunity",
    );
    await expect(page.locator(".back-cover .closing-links")).toContainText(
      "Email",
    );
    await expect(page.locator(".back-cover .closing-links")).toContainText(
      "Resume",
    );
    await page.locator(".back-cover").scrollIntoViewIfNeeded();
    await expect(page.locator("#contact-title")).toBeInViewport();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect(page.locator("#cover-title")).toBeInViewport();
    await context.close();
  }
});

test("Open the book and the introduction bookmark open the hinged cover", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    const height = await page
      .locator(".cover")
      .evaluate((el) => (el as HTMLElement).offsetHeight);
    await page.locator(".cover > .cover-art .open-book").click();
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThanOrEqual(height - 1);
    await expect(page.locator("#intro-title")).toBeInViewport();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.locator(".book-index summary").click();
    await page.locator('.book-index a[href="#introduction"]').click();
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThanOrEqual(height - 1);
    await expect(page.locator("#introduction")).toBeFocused();
  }
});
