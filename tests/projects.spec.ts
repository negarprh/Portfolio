import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  test(`three editorial projects preserve links and readable turns at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-book-enhanced",
      "true",
    );
    await page.evaluate(() => document.fonts.ready);
    const chapter = page.locator("#work");
    await expect(chapter.locator("h2")).toHaveText("Projects");
    await expect(chapter.locator("article h3")).toHaveText([
      "Canadian Tech Internships",
      "Evenly",
      "AirSense",
    ]);
    await expect(chapter).not.toContainText(
      /WealthWise|InvestGuard|SearchStop|Other Projects|More Projects/,
    );
    const articles = chapter.locator("article");
    const expected = [
      ["https://github.com/negarprh/Canadian-Tech-Internships-2027"],
      [
        "https://evenly-client.onrender.com/",
        "https://github.com/negarprh/Evenly",
      ],
      ["https://airsenseapp.org/", "https://github.com/negarprh/AirSense"],
    ];
    for (let index = 0; index < 3; index++) {
      const article = articles.nth(index);
      const screenshot = article.locator(".project-image img");
      await expect(screenshot).toHaveCount(1);
      await screenshot.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          screenshot.evaluate(
            (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
          ),
        )
        .toBe(true);
      const dimensions = await screenshot.evaluate(
        (node: HTMLImageElement) => ({
          actual:
            node.getBoundingClientRect().width /
            node.getBoundingClientRect().height,
          natural: node.naturalWidth / node.naturalHeight,
        }),
      );
      expect(dimensions.actual).toBeCloseTo(dimensions.natural, 2);
      expect(
        await article
          .locator(".project-links a")
          .evaluateAll((nodes) =>
            nodes.map((node) => node.getAttribute("href")),
          ),
      ).toEqual(expected[index]);
      expect(
        await article.locator(".project-copy > p:not(.eyebrow)").count(),
      ).toBeLessThanOrEqual(2);
      for (const link of await article.locator("a").all()) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        await expect(link).toHaveAttribute("aria-label", /opens in a new tab/);
      }
      const top = await article.evaluate(
        (el) => el.getBoundingClientRect().top + scrollY,
      );
      for (const progress of [1, 0.4, 0.8, 0.2, 1]) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: "instant" }),
          top - 850 + progress * 850,
        );
        await settleBook(page);
      }
      await expect(article.locator("h3")).toBeVisible();
      await expect(article.locator(".spread-content")).toHaveCSS(
        "clip-path",
        "none",
      );
      await article.screenshot({
        path: `test-results/project-${width}-${index}.png`,
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(chapter.locator(".community-note")).toContainText("197K+");
    await expect(chapter.locator(".community-note")).toContainText(
      "views in the past 12 months",
    );
    await expect(chapter.locator(".community-note")).toContainText(
      "Top Google result",
    );
    await expect(chapter.locator(".project-maintenance")).toContainText(
      "2026 → 2027",
    );
    await expect(articles.nth(1).locator("figcaption")).toContainText(
      "sample data",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-book-enhanced",
    );
    await expect(chapter.locator('[style*="--reading-clip"]')).toHaveCount(0);
    await expect(chapter.locator("article")).toHaveCount(3);
  });
}

test("projects remain complete without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#work article")).toHaveCount(3);
  await expect(page.locator("#work .project-links a")).toHaveCount(5);
  await expect(page.locator("#work .project-image img")).toHaveCount(3);
  await expect(page.locator("#work")).toContainText("197K+");
  await expect(page.locator('#book-index a[href="#work"]')).toContainText(
    "Projects",
  );
  await context.close();
});
