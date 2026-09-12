const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("http://localhost:3000");
  await page
    .locator("#introduction")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.screenshot({ path: "test-results/book-intro-material.png" });
  await page
    .locator('[data-boundary="experience"]')
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-boundary="experience"] .turn-sheet')
        .getAnimations().length > 0,
  );
  for (const [time, label] of [
    [170, "outgoing"],
    [430, "spine"],
    [780, "reverse"],
    [1450, "rest"],
  ]) {
    await page.locator('[data-boundary="experience"]').evaluate((el, time) => {
      for (const a of el.getAnimations({ subtree: true })) {
        a.pause();
        a.currentTime = time;
      }
    }, time);
    await page.screenshot({ path: `test-results/book-turn-${label}.png` });
  }
  await page
    .locator(".experience-row")
    .first()
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.screenshot({ path: "test-results/book-experience-material.png" });
  await page
    .locator(".about-spread")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.screenshot({ path: "test-results/book-about-material.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator(".experience-row")
    .first()
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.screenshot({ path: "test-results/book-mobile-material.png" });
  await browser.close();
})();
