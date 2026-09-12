const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("http://localhost:3002");
  await p.evaluate(() => document.fonts.ready);
  for (const [name, selector] of [
    ["01-experience", ".experience-row:last-child"],
    ["02-work", ".flagship"],
    ["03-building", ".building-spread"],
  ]) {
    await p
      .locator(selector)
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await p.evaluate(() => {
      for (const a of document.getAnimations()) {
        if (a.effect?.getTiming().iterations !== Infinity) a.finish();
        a.pause();
      }
    });
    await p.screenshot({ path: `test-results/chapter-still-${name}.png` });
    console.log(
      name,
      await p.locator(selector).evaluate((el) => ({
        top: el.getBoundingClientRect().top,
        background: getComputedStyle(el).backgroundImage,
      })),
    );
  }
  await p.goto("http://localhost:3002");
  await p
    .locator('[data-boundary="work"]')
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.waitForTimeout(1950);
  await p.screenshot({ path: "test-results/chapter-title-work.png" });
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(300);
  console.log(
    "fast-scroll title",
    await p.locator("#work .divider h2").boundingBox(),
  );
  await p.screenshot({ path: "test-results/chapter-held-work.png" });
  await p.setViewportSize({ width: 390, height: 844 });
  await p
    .locator(".flagship")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.screenshot({ path: "test-results/chapter-mobile-work.png" });
  await b.close();
})();
