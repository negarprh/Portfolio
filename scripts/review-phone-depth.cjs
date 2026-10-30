const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const sharp = require("sharp");

(async () => {
  const browser = await chromium.launch();
  const root = `test-results/phone-depth-${process.argv[2] || "after"}`;
  fs.mkdirSync(root, { recursive: true });
  if (process.argv[2] === "video") {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      recordVideo: { dir: root, size: { width: 390, height: 844 } },
    });
    const page = await context.newPage();
    const video = page.video();
    await page.goto(process.env.BOOK_TEST_BASE_URL || "http://localhost:3000");
    await page.waitForSelector('.cover-name[data-signature="complete"]');
    const top = await page
      .locator("#experience .divider")
      .evaluate((el) => Number(el.dataset.bookTop));
    const start = top - 844 * 0.85;
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      start,
    );
    await page.waitForTimeout(700);
    for (const reverse of [false, true]) {
      // Programmatic progression isolates the visual renderer from input pacing.
      await page.evaluate(
        async ({ start, top, reverse }) => {
          await new Promise((resolve) => {
            const begun = performance.now();
            const frame = (now) => {
              const progress = Math.min(1, (now - begun) / 1100);
              scrollTo({
                top:
                  start + (top - start) * (reverse ? 1 - progress : progress),
                behavior: "instant",
              });
              if (progress < 1) requestAnimationFrame(frame);
              else resolve();
            };
            requestAnimationFrame(frame);
          });
        },
        { start, top, reverse },
      );
      await page.waitForTimeout(600);
    }
    await context.close();
    await video.saveAs(`${root}/phone-turn.webm`);
    await browser.close();
    return;
  }
  const sizes = [
    [320, 568],
    [390, 844],
    [412, 915],
    [1440, 900],
  ];
  const fitting = [];
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(process.env.BOOK_TEST_BASE_URL || "http://localhost:3000");
    await page.waitForSelector(".book-fixed-page");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000);
    fitting.push({
      width,
      blocks: await page
        .locator(".book-fixed-page > :is(.intro-grid, .spread-content)")
        .evaluateAll((nodes) => nodes.map((el) => getComputedStyle(el).zoom)),
    });
    const top = await page
      .locator("#experience .divider")
      .evaluate((el) => Number(el.dataset.bookTop));
    const panels = [];
    for (const [i, progress] of [0, 0.22, 0.48, 0.72, 1].entries()) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        top - height * 0.85 + height * 0.85 * progress,
      );
      await page.waitForFunction(
        () =>
          Math.abs(
            Number(document.querySelector(".physical-turn")?.dataset.scrollY) -
              scrollY,
          ) < 0.01,
      );
      const path = `${root}/${width}-${progress}.png`;
      await page.screenshot({ path });
      panels.push({
        input: await sharp(path).resize(Math.min(width, 390)).toBuffer(),
        left: i * Math.min(width, 390),
        top: 0,
      });
    }
    const panelWidth = Math.min(width, 390);
    await sharp({
      create: {
        width: panelWidth * 5,
        height: Math.round((height * panelWidth) / width),
        channels: 3,
        background: "#252824",
      },
    })
      .composite(panels)
      .png()
      .toFile(`${root}/${width}-sequence.png`);
    await page.close();
  }
  fs.writeFileSync(`${root}/fitting.json`, JSON.stringify(fitting, null, 2));
  await browser.close();
})();
