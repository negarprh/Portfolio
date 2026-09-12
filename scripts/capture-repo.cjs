const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });
    await page.goto(
      "https://github.com/negarprh/Canadian-Tech-Internships-2027",
      { waitUntil: "domcontentloaded" },
    );
    const readme = page
      .locator("article")
      .filter({ hasText: "Canadian Tech Internships - 2027" })
      .first();
    await readme.waitFor();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "public/images/internships-2027.png" });
    console.log("Captured the public repository README.");
  } finally {
    await browser.close();
  }
})();
