const { chromium } = require("playwright");
const sharp = require("sharp");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("http://localhost:3000");
  await p.waitForTimeout(1600);
  await p.screenshot({ path: "test-results/jacket-front.png" });
  await p.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await p.waitForTimeout(100);
  await p.screenshot({ path: "test-results/jacket-back.png" });
  await sharp({
    create: { width: 2880, height: 1000, channels: 3, background: "#24241f" },
  })
    .composite([
      { input: "test-results/jacket-front.png", left: 0, top: 0 },
      { input: "test-results/jacket-back.png", left: 1440, top: 0 },
    ])
    .png()
    .toFile("test-results/jacket-comparison.png");
  await p.evaluate(() => scrollTo({ top: 400, behavior: "instant" }));
  await p.waitForTimeout(100);
  await p.screenshot({ path: "test-results/jacket-opening.png" });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(100);
  await p.screenshot({ path: "test-results/jacket-front-mobile.png" });
  await p.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await p.waitForTimeout(100);
  await p.screenshot({ path: "test-results/jacket-back-mobile.png" });
  await b.close();
})();
