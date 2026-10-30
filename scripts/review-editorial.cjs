const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const sharp = require("sharp");

(async () => {
  const browser = await chromium.launch();
  const phase = process.argv[2] || "after";
  const root = `test-results/editorial-${phase}`;
  fs.mkdirSync(root, { recursive: true });
  const measurements = [];
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
    await page.waitForTimeout(3000);
    measurements.push({
      width,
      height,
      blocks: await page
        .locator(".intro-grid, .spread-content")
        .evaluateAll((nodes) =>
          nodes
            .filter((n) => n.closest(".book-fixed-page"))
            .map((n) => ({
              section: n.closest("section")?.id,
              zoom: getComputedStyle(n).zoom,
              height: n.getBoundingClientRect().height,
            })),
        ),
    });
    for (const [name, selector] of [
      ["cover", ".cover"],
      ["introduction", "#introduction"],
      ["experience", ".experience-row"],
      ["skills", ".skills-spread"],
      ["projects", ".flagship"],
      ["education", ".education-spread"],
      ["contact", ".back-cover"],
      ["divider", "#work .divider"],
    ]) {
      await page
        .locator(selector)
        .first()
        .evaluate((el) =>
          scrollTo({
            top: Number(el.dataset.bookTop || 0),
            behavior: "instant",
          }),
        );
      await page.waitForFunction(
        () =>
          Math.abs(
            Number(document.querySelector(".physical-turn")?.dataset.scrollY) -
              scrollY,
          ) < 0.01,
      );
      await page.screenshot({ path: `${root}/${width}-${name}.png` });
    }
    await page.close();
    const names = [
      "cover",
      "introduction",
      "experience",
      "skills",
      "projects",
      "education",
      "contact",
      "divider",
    ];
    const thumbWidth = Math.min(width, 360);
    const thumbHeight = Math.round((height * thumbWidth) / width);
    const panels = await Promise.all(
      names.map(async (name, i) => ({
        input: await sharp(`${root}/${width}-${name}.png`)
          .resize(thumbWidth, thumbHeight)
          .toBuffer(),
        left: (i % 4) * thumbWidth,
        top: Math.floor(i / 4) * thumbHeight,
      })),
    );
    await sharp({
      create: {
        width: thumbWidth * 4,
        height: thumbHeight * 2,
        channels: 3,
        background: "#f5f1e8",
      },
    })
      .composite(panels)
      .png()
      .toFile(`${root}/${width}-overview.png`);
  }
  fs.writeFileSync(
    `${root}/fitting.json`,
    JSON.stringify(measurements, null, 2),
  );
  if (process.argv.includes("--share")) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
    });
    await page.goto(process.env.BOOK_TEST_BASE_URL || "http://localhost:3000");
    await page.waitForSelector('.cover-name[data-signature="complete"]');
    await page.screenshot({ path: "app/opengraph-image.png" });
    await page.close();
  }
  await browser.close();
})();
