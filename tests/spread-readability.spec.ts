import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  test(`paired paper scrubs sharp reading ink at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    const boundaries = page.locator(".readable-turn");
    const count = await boundaries.count();
    expect(count).toBeGreaterThan(10);
    for (let index = 0; index < count; index++) {
      const boundary = boundaries.nth(index);
      const top = await boundary.evaluate(
        (el) =>
          (el.closest(".chapter-opening") || el).getBoundingClientRect().top +
          scrollY,
      );
      const samples = [0.15, 0.3, 0.5, 0.75, 1, 0.75, 0.5, 0.3, 0.15];
      for (const [frame, progress] of samples.entries()) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: "instant" }),
          top - 850 + progress * 850,
        );
        await settleBook(page);
        const state = await boundary.evaluate((el) => {
          const sheets = Array.from(
            el.querySelectorAll<HTMLElement>(":scope > .turn-sheet"),
          );
          const text = Array.from(
            el.querySelectorAll<HTMLElement>("h2, h3, p, li"),
          ).filter((node) => !node.closest(".turn-sheet"));
          return {
            times: sheets.map((sheet) => sheet.getAnimations()[0].currentTime),
            easing: sheets.map(
              (sheet) => sheet.getAnimations()[0].effect!.getTiming().easing,
            ),
            ink: text.map((node) => {
              const style = getComputedStyle(node);
              let ancestor: Element | null = node;
              let clean = true;
              let opacity = 1;
              while (ancestor && ancestor !== el.parentElement) {
                const s = getComputedStyle(ancestor);
                clean &&= s.transform === "none" && s.filter === "none";
                opacity *= Number(s.opacity);
                ancestor = ancestor.parentElement;
              }
              return { clean, opacity, visibility: style.visibility };
            }),
            opacity: 1,
            copies: el.querySelectorAll(".outgoing-content").length,
            layers: sheets.map((sheet) => getComputedStyle(sheet).zIndex),
          };
        });
        expect(state.times[0]).toBe(state.times[1]);
        expect(state.easing).toEqual([
          "cubic-bezier(0.24, 0.12, 0.22, 1)",
          "cubic-bezier(0.24, 0.12, 0.22, 1)",
        ]);
        expect(state.copies).toBe(0);
        expect(
          state.ink.every(
            (ink) =>
              ink.clean &&
              ink.visibility === "visible" &&
              Math.abs(ink.opacity - state.opacity) < 0.00001,
          ),
        ).toBe(true);
        expect(state.layers).toEqual(["-2", "-2"]);
        if (index === 2 && [0.15, 0.3, 0.5, 0.75].includes(progress)) {
          await page.screenshot({
            path: `test-results/readable-${width}-${frame < 4 ? "forward" : "reverse"}-${progress}.png`,
          });
        }
      }
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(
      page.locator(".readable-turn, .turn-sheet-left, .turn-shadow-left"),
    ).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".readable-turn")).toHaveCount(count);
    await expect(page.locator(".turn-sheet-left")).toHaveCount(count);
  });
}
