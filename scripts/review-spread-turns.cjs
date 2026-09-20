const { chromium } = require("@playwright/test");
const fs = require("node:fs/promises");
(async () => {
  const browser = await chromium.launch();
  await fs.mkdir("test-results/spread-review", { recursive: true });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto(
        process.env.BOOK_TEST_BASE_URL || "http://localhost:3000",
      );
      await page.waitForSelector("html[data-book-enhanced]");
      await page.evaluate(() => document.fonts.ready);
      const top = await page
        .locator(".role-1")
        .evaluate((el) => el.getBoundingClientRect().top + scrollY);
      for (const [index, progress] of [
        0.15, 0.3, 0.5, 0.75, 1, 0.75, 0.5, 0.3, 0.15,
      ].entries()) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: "instant" }),
          top - 850 + progress * 850,
        );
        await page.waitForFunction(() => {
          const el = document.querySelector(".role-1");
          const target =
            Math.max(
              0,
              Math.min(1, (850 - el.getBoundingClientRect().top) / 850),
            ) * 1800;
          return (
            Math.abs(
              Number(
                el.querySelector(".turn-sheet").getAnimations()[0].currentTime,
              ) - target,
            ) < 0.01
          );
        });
        await page.screenshot({
          path: `test-results/spread-review/${width}-${index < 5 ? "forward" : "reverse"}-${progress}.png`,
        });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
})();
