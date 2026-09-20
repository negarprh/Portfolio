const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  fs.mkdirSync("test-results/signature", { recursive: true });
  const b = await chromium.launch();
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const c = await b.newContext({
      viewport: { width, height },
      recordVideo: { dir: "test-results/signature", size: { width, height } },
    });
    const p = await c.newPage();
    await p.addInitScript(() => {
      window.signatureReview = { frames: [], longTasks: [] };
      new PerformanceObserver((list) =>
        window.signatureReview.longTasks.push(
          ...list
            .getEntries()
            .map((e) => ({ start: e.startTime, duration: e.duration })),
        ),
      ).observe({ type: "longtask", buffered: true });
      const sample = () => {
        const name = document.querySelector(".cover > .cover-art .cover-name");
        if (name?.dataset.signature === "writing")
          window.signatureReview.frames.push({
            time: performance.now(),
            offsets: Array.from(
              name.querySelectorAll("[data-signature-stroke]"),
            ).map((p) => p.style.strokeDashoffset),
            pen: name.querySelector(".signature-pen").style.transform,
          });
        if (name?.dataset.signature !== "complete")
          requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await p.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await p.waitForSelector(
      '.cover > .cover-art .cover-name[data-signature="complete"]',
    );
    await p.waitForTimeout(500);
    await p.screenshot({ path: `test-results/signature/${name}-resting.png` });
    fs.writeFileSync(
      `test-results/signature/${name}-trace.json`,
      JSON.stringify(await p.evaluate(() => window.signatureReview), null, 2),
    );
    const video = p.video();
    await c.close();
    await video.saveAs(`test-results/signature/${name}.webm`);
  }
  await b.close();
})();
