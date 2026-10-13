import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  test(`stationary spreads and a reversible physical sheet at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    const incoming = page.locator('[data-boundary="experience"]');
    const top = await incoming.evaluate((el) =>
      Number((el as HTMLElement).dataset.bookTop),
    );
    const states = new Map<number, string[]>();
    for (const p of [
      0.02, 0.2, 0.45, 0.55, 0.8, 0.98, 1, 0.98, 0.8, 0.55, 0.45, 0.2, 0.02,
    ]) {
      await page.evaluate((y) => scrollTo(0, y), top - 850 + 850 * p);
      await settleBook(page);
      const state = await page.evaluate(() => {
        const stage = document.querySelector<HTMLElement>(".physical-turn")!;
        const pages = Array.from(
          document.querySelectorAll<HTMLElement>(".book-fixed-page"),
        ).filter((el) => el.style.visibility === "visible");
        return {
          bounds: pages.map((el) => {
            const r = el.getBoundingClientRect();
            return [r.x, r.y, r.width, r.height];
          }),
          transforms: Array.from(
            stage.querySelectorAll<HTMLElement>(".paper-joint"),
          ).map((el) => el.style.transform),
          pageTransforms: pages.map((el) => getComputedStyle(el).transform),
          ids: stage.querySelectorAll("[id]").length,
          inert: stage.inert,
          front: stage.querySelector(".paper-recto")?.textContent,
          back: stage.querySelector(".paper-verso")?.textContent,
        };
      });
      expect(state.bounds.length).toBe(p === 1 ? 1 : 2);
      for (const bounds of state.bounds) {
        expect(bounds[1]).toBe(0);
        expect(bounds[3]).toBe(1000);
        expect(bounds).toEqual(state.bounds[0]);
      }
      expect(state.pageTransforms.every((t) => t === "none")).toBe(true);
      expect(state.ids).toBe(0);
      expect(state.inert).toBe(true);
      if (p !== 1) {
        expect(state.front).toContain("Hi, I’m Negar.");
        expect(state.back).toContain("Experience");
        expect(new Set(state.transforms).size).toBeGreaterThan(1);
        if (states.has(p)) expect(state.transforms).toEqual(states.get(p));
        states.set(p, state.transforms);
      }
      if ([0.2, 0.55, 0.8, 1].includes(p))
        await page.screenshot({
          path: `test-results/physical-${width}-${p}.png`,
        });
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(
      page.locator(".physical-turn, .book-fixed-page, .book-page-slot"),
    ).toHaveCount(0);
    await expect(incoming).toHaveCSS("position", "relative");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".physical-turn")).toHaveCount(1);
    await settleBook(page);
  });
}
