import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";
import { writeFile } from "node:fs/promises";
const sharp = require("sharp");

function luminance(rgb: number[]) {
  return rgb.reduce((sum, value, i) => {
    const c = value / 255;
    return (
      sum +
      (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) *
        [0.2126, 0.7152, 0.0722][i]
    );
  }, 0);
}

test("editorial text contrasts with rendered cloth and chapter stock", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".book-fixed-page")).toHaveCount(16);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".cover-name").first()).toHaveAttribute(
    "data-signature",
    "complete",
  );
  const results: { surface: string; text: string; ratio: number }[] = [];
  for (const [surface, selector] of [
    [
      ".cover",
      ".cover-top, .cover-heading .eyebrow, .cover-role, .open-book-title, .open-book-hint",
    ],
    ["#introduction", "h2, .body-copy, dt, dd, .links a"],
    [
      ".experience-row",
      ".job-heading > .eyebrow, h3, .job-role, .stack-chips span, .job-detail p, .role-anchor figcaption, .runtime-values small",
    ],
    [".skills-spread", ".skill-group h3, .skill-group li"],
    [
      ".flagship",
      "h3, .project-copy > p, .project-links a, .project-tech dd, .project-proof > span, figcaption, .project-context p",
    ],
    [".education-spread", "h3, p"],
    [".back-cover", "h2, .eyebrow, .closing-links a, .colophon-device"],
  ]) {
    const paper = page.locator(surface).first();
    await paper.evaluate((el) =>
      scrollTo({
        top: Number((el as HTMLElement).dataset.bookTop),
        behavior: "instant",
      }),
    );
    await settleBook(page);
    const nodes = paper.locator(selector);
    const samples = await nodes.evaluateAll((elements) =>
      elements.map((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          text: el.textContent?.trim().slice(0, 70) || "",
          color: style.color.match(/[\d.]+/g)!.map(Number),
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          size: parseFloat(style.fontSize),
          weight: Number(style.fontWeight),
        };
      }),
    );
    // Remove ink only: retain the real gradients, grain, cloth, and binding below it.
    const hide = await page.addStyleTag({
      content: `${surface} :is(${selector}), ${surface} :is(${selector}) * { color: transparent !important; text-shadow: none !important; }`,
    });
    const { data, info } = await sharp(await page.screenshot())
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    await hide.evaluate((el) => el.parentNode?.removeChild(el));
    for (const sample of samples) {
      if (
        sample.x < 0 ||
        sample.x >= info.width ||
        sample.y < 0 ||
        sample.y >= info.height
      )
        continue;
      const offset =
        (Math.floor(sample.y) * info.width + Math.floor(sample.x)) *
        info.channels;
      const background = [...data.subarray(offset, offset + 3)];
      const alpha = sample.color[3] ?? 1;
      const foreground = sample.color
        .slice(0, 3)
        .map((c, i) => c * alpha + background[i] * (1 - alpha));
      const a = luminance(foreground),
        b = luminance(background);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      results.push({ surface, text: sample.text, ratio });
      expect(ratio, `${surface}: ${sample.text}`).toBeGreaterThanOrEqual(
        sample.size >= 24 || (sample.size >= 18.66 && sample.weight >= 700)
          ? 3
          : 4.5,
      );
    }
  }
  const report = testInfo.outputPath("rendered-contrast.json");
  await writeFile(report, JSON.stringify(results, null, 2));
  await testInfo.attach("rendered-contrast", {
    path: report,
    contentType: "application/json",
  });
});
