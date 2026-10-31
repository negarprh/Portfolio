const { chromium } = require("@playwright/test");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch();
  const root = `test-results/content-${process.argv[2] || "after"}`;
  fs.mkdirSync(root, { recursive: true });
  const fitting = [];
  for (const [width, height] of [
    [1440, 900],
    [768, 1024],
    [390, 844],
    [320, 568],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(process.env.BOOK_TEST_BASE_URL || "http://localhost:3000");
    await page.waitForSelector(".book-fixed-page");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2800);
    for (const [chapter, selector] of [
      ["project", ".project-spread"],
      ["experience", ".experience-row"],
    ]) {
      for (const [index, article] of (
        await page.locator(selector).all()
      ).entries()) {
        await article.evaluate((el) =>
          scrollTo({ top: Number(el.dataset.bookTop), behavior: "instant" }),
        );
        await page.waitForFunction(
          () =>
            Math.abs(
              Number(
                document.querySelector(".physical-turn")?.dataset.scrollY,
              ) - scrollY,
            ) < 0.01,
        );
        fitting.push({
          width,
          chapter,
          index,
          zoom: await article
            .locator(".spread-content")
            .evaluate((el) => getComputedStyle(el).zoom),
        });
        await page.screenshot({
          path: `${root}/${width}-${chapter}-${index}.png`,
        });
      }
    }
    await page.close();
  }
  fs.writeFileSync(`${root}/fitting.json`, JSON.stringify(fitting, null, 2));
  await browser.close();
})();
