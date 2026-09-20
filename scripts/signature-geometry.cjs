// Regenerate only when the hand-authored paths change. Browser geometry is baked
// into the bundle so loading the cover never samples SVG curves on the main thread.
const fs = require("node:fs");
const { chromium } = require("playwright");
(async () => {
  const source = fs.readFileSync("lib/cover-signature.ts", "utf8");
  const paths = Array.from(
    source.matchAll(/d: "([^"]+)"/g),
    (match) => match[1],
  );
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const geometry = await page.evaluate(
    (paths) =>
      paths.map((d) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute("d", d);
        const length = path.getTotalLength();
        const count = Math.max(2, Math.ceil(length / 2));
        const points = Array.from({ length: count + 1 }, (_, i) => {
          const p = path.getPointAtLength((length * i) / count);
          return {
            x: Math.round(p.x * 100) / 100,
            y: Math.round(p.y * 100) / 100,
          };
        });
        return { length, points };
      }),
    paths,
  );
  fs.writeFileSync(
    "lib/cover-signature-geometry.json",
    JSON.stringify(geometry) + "\n",
  );
  await browser.close();
})();
