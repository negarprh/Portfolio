const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("http://localhost:3000");
  await p.waitForFunction(
    () => document.documentElement.dataset.coverReady === "true",
  );
  await p.waitForTimeout(950);
  await p.screenshot({ path: "test-results/makeover-cover.png" });
  for (let i = 0; i < 3; i++) {
    await p
      .locator(".experience-row")
      .nth(i)
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await p.screenshot({ path: `test-results/makeover-role-${i}.png` });
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto("http://localhost:3000");
  await p.waitForTimeout(1000);
  await p.screenshot({ path: "test-results/makeover-mobile-cover.png" });
  await p
    .locator(".role-0")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.screenshot({
    path: "test-results/makeover-mobile-role.png",
    fullPage: false,
  });
  await b.close();
})();
