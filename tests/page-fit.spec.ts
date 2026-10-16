import { test, expect } from "@playwright/test";
import { experience, projects } from "../lib/content";
import { settleBook } from "./motion-helpers";

for (const [width, height] of [
  [320, 568],
  [360, 640],
  [390, 844],
  [430, 932],
  [384, 824],
  [412, 915],
  [412, 1000],
  [430, 960],
  [768, 1024],
  [844, 390],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
  [3440, 1440],
  [3840, 2160],
]) {
  test(`complete reading content fits and stays centered at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".book-fixed-page")).toHaveCount(16);
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page
          .locator(".book-fixed-page > .spread-content")
          .first()
          .evaluate((el) => !!(el as HTMLElement).style.top),
      )
      .toBe(true);
    const states = await page
      .locator(
        ".book-fixed-page > .spread-content, .book-fixed-page > .intro-grid",
      )
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          const paper = node.parentElement!.getBoundingClientRect();
          return {
            centerError: Math.abs(
              rect.top + rect.height / 2 - (paper.top + paper.height / 2),
            ),
            bounded:
              rect.top >= paper.top &&
              rect.bottom <= paper.bottom &&
              rect.left >= paper.left &&
              rect.right <= paper.right,
            paragraphs: Array.from(node.querySelectorAll("p"))
              .filter((p) => p.textContent?.trim())
              .every(
                (p) =>
                  getComputedStyle(p).display !== "none" &&
                  p.getBoundingClientRect().height > 0,
              ),
          };
        }),
      );
    for (const state of states) {
      expect(state.centerError).toBeLessThan(1);
      expect(state.bounded).toBe(true);
      expect(state.paragraphs).toBe(true);
    }
    for (const [i, job] of experience.entries())
      await expect(
        page.locator(".experience-row").nth(i).locator(".job-detail p"),
      ).toHaveText(job.lines);
    for (const [i, project] of projects.entries())
      await expect(
        page
          .locator(".project-spread")
          .nth(i)
          .locator(".project-copy > p:not(.eyebrow)"),
      ).toHaveText(project.paragraphs);
    await expect(page.locator(".phone-copy, .full-copy")).toHaveCount(0);
    await page
      .locator("#evenly-title")
      .evaluate((el) =>
        scrollTo(
          0,
          Number(
            (el.closest(".book-fixed-page") as HTMLElement).dataset.bookTop,
          ),
        ),
      );
    await expect(page.locator("#evenly-title")).toBeVisible();
    await settleBook(page);
    await page.screenshot({
      path: `test-results/fit-evenly-${width}-${height}.png`,
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(
      page.locator(
        '.spread-content[style*="zoom"], .intro-grid[style*="zoom"]',
      ),
    ).toHaveCount(0);
  });
}
