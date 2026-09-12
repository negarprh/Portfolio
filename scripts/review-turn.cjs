const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("http://localhost:3000");
  await p
    .locator('[data-boundary="experience"]')
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.waitForFunction(
    () =>
      document
        .querySelector('[data-boundary="experience"] .turn-sheet')
        .getAnimations().length > 0,
  );
  await p.locator('[data-boundary="experience"] .turn-sheet').evaluate((el) => {
    for (const a of el.getAnimations({ subtree: true })) {
      a.pause();
      a.currentTime = 360;
    }
  });
  await p.screenshot({ path: "test-results/turn-front.png" });
  await p.locator('[data-boundary="experience"] .turn-sheet').evaluate((el) => {
    for (const a of el.getAnimations({ subtree: true })) a.currentTime = 760;
  });
  await p.screenshot({ path: "test-results/turn-back.png" });
  await p.locator('[data-boundary="experience"] .turn-sheet').evaluate((el) => {
    for (const a of el.getAnimations({ subtree: true })) a.finish();
  });
  await p.screenshot({ path: "test-results/chapter-page.png" });
  await p
    .locator(".about-spread")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.screenshot({ path: "test-results/about-revised.png" });
  await b.close();
})();
