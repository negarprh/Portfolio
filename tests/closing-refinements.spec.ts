import { settleBook } from "./motion-helpers";
import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`last leaf and introduction typography at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("#contact > .colophon > .eyebrow")).toHaveText(
      "Contact",
    );
    await expect(page.locator("#contact-title")).toHaveText(
      "Have a role in mind?Let’s talk.",
    );
    await expect(
      page.locator("#contact > .colophon > .colophon-note"),
    ).toHaveText("I’m currently open to softwaredevelopment opportunities.");
    await expect(page.locator("#contact .colophon-name")).toHaveCount(0);
    const contactLinks = page.locator(
      "#contact > .colophon > .closing-links > *",
    );
    await expect(contactLinks).toHaveCount(3);
    await expect(contactLinks.first()).toHaveAttribute(
      "href",
      "mailto:negarpr@hotmail.com",
    );
    await expect(contactLinks.first()).toHaveCSS("font-size", "16px");
    await expect(page.locator("#contact > .colophon")).not.toContainText(
      /résumé|resume|coming soon/i,
    );
    const linkBounds = await contactLinks.evaluateAll((nodes) =>
      nodes.map((node) => {
        const { top, left, width } = node.getBoundingClientRect();
        return { top, left, width };
      }),
    );
    expect(linkBounds[0].top).toBe(linkBounds[1].top);
    expect(linkBounds[1].top).toBe(linkBounds[2].top);
    await expect(page.locator("#intro-title")).toHaveCSS(
      "font-family",
      "Editorial, Georgia, serif",
    );
    await expect(page.locator("#intro-title")).toHaveCSS("font-weight", "400");
    await page
      .locator("#introduction")
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await page.screenshot({
      path: `test-results/intro-merged-${width}.png`,
    });
    const top = await page
      .locator("#contact")
      .evaluate((el) => el.getBoundingClientRect().top + scrollY);
    const samples: Record<string, string> = {};
    for (const progress of [0.1, 0.3, 0.5, 0.7, 1, 0.7, 0.5, 0.3, 0.1]) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        top - 850 + progress * 850,
      );
      await settleBook(page);
      const state = await page
        .locator("#contact > .turn-sheet")
        .evaluate((el) => ({
          transform: getComputedStyle(el).transform,
          time: el.getAnimations()[0].currentTime,
          inert: (el as HTMLElement).inert,
        }));
      // Native scrolling rounds the requested position to a CSS pixel, while
      // font layout can leave a fractional boundary top. Match the actual seek.
      const actualProgress = await page.evaluate(
        (boundaryTop) =>
          Math.max(0, Math.min(1, (scrollY - boundaryTop + 850) / 850)),
        top,
      );
      expect(Number(state.time)).toBeCloseTo(actualProgress * 1800, 0);
      expect(state.inert).toBe(true);
      if (samples[progress]) expect(state.transform).toBe(samples[progress]);
      samples[progress] = state.transform;
      await expect(
        page.locator(".closing-art [id], .closing-art [data-boundary]"),
      ).toHaveCount(0);
      await page.screenshot({
        path: `test-results/closing-${width}-${progress}.png`,
      });
    }
    await page
      .locator("#contact")
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await expect(page.locator("#contact-title")).toBeInViewport();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-book-enhanced",
    );
    await expect(page.locator(".closing-art")).toHaveCount(0);
    await expect(page.locator("#intro-title")).toHaveCSS(
      "font-family",
      "Editorial, Georgia, serif",
    );
  });
}
