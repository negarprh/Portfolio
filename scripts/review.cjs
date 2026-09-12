const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await p.goto("http://localhost:3000");
  for (const [name, selector] of [
    ["intro", "#introduction"],
    ["experience", ".experience-spreads"],
    ["work", ".flagship"],
    ["skills", ".skills-spread"],
    ["contact", "#contact"],
  ]) {
    await p
      .locator(selector)
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await p.screenshot({ path: `test-results/${name}-desktop.png` });
  }
  await p.setViewportSize({ width: 390, height: 844 });
  for (const [name, selector] of [
    ["experience", ".experience-spreads"],
    ["work", ".flagship"],
    ["contact", "#contact"],
  ]) {
    await p
      .locator(selector)
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await p.screenshot({ path: `test-results/${name}-mobile.png` });
  }
  await b.close();
})();
