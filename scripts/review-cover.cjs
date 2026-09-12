const { chromium } = require("playwright");
const sharp = require("sharp");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("http://localhost:3000");
  await p.waitForTimeout(1800);
  await p.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  await p.screenshot({ path: "test-results/cover-finish.png" });
  await p
    .locator(".role-0")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.waitForTimeout(2000);
  await p.screenshot({ path: "test-results/interior-finish.png" });
  await sharp({
    create: { width: 2880, height: 1000, channels: 3, background: "#fff" },
  })
    .composite([
      { input: "test-results/cover-finish.png", left: 0, top: 0 },
      { input: "test-results/interior-finish.png", left: 1440, top: 0 },
    ])
    .png()
    .toFile("test-results/material-comparison.png");
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto("http://localhost:3000");
  await p.waitForTimeout(1800);
  await p.screenshot({ path: "test-results/cover-mobile-finish.png" });
  await b.close();
})();
