import { test, expect, type Page } from "@playwright/test";
import { settleBook } from "./motion-helpers";

async function stops(page: Page) {
  await expect(page.locator(".physical-turn")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  return page
    .locator(".book-fixed-page")
    .evaluateAll((nodes) =>
      nodes.map((el) => Number((el as HTMLElement).dataset.bookTop)),
    );
}

test("one wheel notch completes one spread, including long divider runways", async ({
  page,
}) => {
  await page.goto("/");
  const positions = await stops(page);
  for (const index of [1, 2, 3, 2, 1, 0]) {
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, positions[index] > before ? 100 : -100);
    await settleBook(page);
    expect(await page.evaluate(() => scrollY)).toBe(positions[index]);
    await expect(page.locator(".book-fixed-page").nth(index)).toHaveAttribute(
      "data-page-active",
      "true",
    );
  }
});

test("a continuous trackpad gesture and its long momentum tail never queue another leaf", async ({
  page,
}) => {
  await page.goto("/");
  const positions = await stops(page);
  // Send a complete simulated trace in the browser so process scheduling cannot
  // accidentally insert gesture boundaries between individual samples.
  await page.evaluate(async () => {
    const deltas = [
      2,
      5,
      9,
      22,
      55,
      100,
      ...Array(18).fill(100),
      80,
      50,
      30,
      18,
      10,
      6,
      4,
      2,
      1,
      1,
      1,
    ];
    for (const deltaY of deltas) {
      document
        .querySelector(".cover-art")!
        .dispatchEvent(
          new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }),
        );
      await new Promise((resolve) => setTimeout(resolve, 32));
    }
  });
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
  // A fresh impulse directly after the tail is usable without a cooldown.
  await page.mouse.wheel(0, 100);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
  // Native keyboard/programmatic movement may leave a long divider half open.
  // The next gesture must finish that leaf rather than skip its destination.
  await page.evaluate(
    (top) => scrollTo({ top, behavior: "instant" }),
    positions[2] - 720 * 0.85 * 0.8,
  );
  await settleBook(page);
  await page.mouse.wheel(0, 100);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
});

test("wheel units, exclusions, tiny jitter, and rapid direction changes", async ({
  page,
}) => {
  await page.goto("/");
  const positions = await stops(page);
  await page.evaluate(() => {
    for (const init of [
      { deltaY: 2 },
      { deltaY: 200, deltaX: 300 },
      { deltaY: 100, ctrlKey: true },
      { deltaY: 100, metaKey: true },
    ])
      document.body.dispatchEvent(
        new WheelEvent("wheel", { ...init, bubbles: true, cancelable: true }),
      );
  });
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.evaluate(() =>
    document.body.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: 3,
        deltaMode: 1,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  await page.waitForTimeout(120);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(40);
  await page.mouse.wheel(0, 100);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
  await page.evaluate(() =>
    document.body.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: 1,
        deltaMode: 2,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
  await page.locator("#book-index summary").click();
  await page
    .locator("#book-index summary")
    .dispatchEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true });
  expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
});

for (const width of [390, 820]) {
  test(`vertical touch intent works at ${width}px; horizontal swipes, jitter and cancellation stay put`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("/");
    const positions = await stops(page);
    const client = await context.newCDPSession(page);
    const swipe = async (dx: number, dy: number, cancel = false) => {
      const startY = Math.min(450, page.viewportSize()!.height - 80);
      await client.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: 160, y: startY }],
      });
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 160 + dx, y: startY + dy }],
      });
      await client.send("Input.dispatchTouchEvent", {
        type: cancel ? "touchCancel" : "touchEnd",
        touchPoints: [],
      });
      await settleBook(page);
    };
    for (const [dx, dy] of [
      [100, -15],
      [2, -5],
      [0, -20],
    ]) {
      await swipe(dx, dy);
      expect(await page.evaluate(() => scrollY)).toBe(0);
    }
    await swipe(0, -100, true);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await swipe(0, -65);
    expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
    await swipe(0, -65);
    expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
    await swipe(0, 65);
    expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
    // Recontact during a long divider's release brakes and resumes the same
    // leaf, even when the document coordinate is closer to the incoming stop.
    for (let attempt = 0; attempt < 2; attempt++) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: 160, y: 450 }],
      });
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 160, y: 385 }],
      });
      await client.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      if (!attempt) await page.waitForTimeout(60);
    }
    await settleBook(page);
    expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
    await swipe(0, 65);
    expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
    await page.setViewportSize({ width: 844, height: width });
    await settleBook(page);
    const resized = await stops(page);
    await swipe(0, -65);
    expect(await page.evaluate(() => scrollY)).toBe(resized[2]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await context.close();
  });
}

for (const [width, height] of [
  [390, 844],
  [320, 568],
  [844, 390],
] as const) {
  test(`phone guidance at ${width}px is readable on the cover even on a return visit`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: true,
      isMobile: true,
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("book-phone-gesture-message", "seen");
    });
    const page = await context.newPage();
    await page.goto("/");
    const hint = page.locator(".cover .opening-mobile-copy");
    await expect(hint).toHaveText("Swipe up to turn the page");
    await expect(hint).toBeInViewport({ ratio: 1 });
    await expect(hint).toHaveCSS("font-size", "13px");
    await expect(page.locator(".cover .navigation-hint")).toBeHidden();
    await expect(
      page.locator('.cover .cover-name[data-signature="complete"]'),
    ).toBeAttached();
    await page.screenshot({ path: `test-results/gesture-hint-${width}.png` });
    await page.locator(".cover .open-book").tap();
    await expect(page).toHaveURL(/#introduction$/);
    await page.locator("#book-index summary").click();
    await page.locator('#book-index a[href="#top"]').click();
    await settleBook(page);
    await page.reload();
    await expect(hint).toBeVisible();
    await expect(hint).toBeInViewport({ ratio: 1 });
    await context.close();
  });
}

test("temporary desktop guidance clears after a turn and stays retired", async ({
  page,
}) => {
  const width = 1440,
    height = 900;
  await page.setViewportSize({ width, height });
  await page.goto("/");
  await stops(page);
  const hint = page.locator(".open-book > .navigation-hint");
  await expect(hint).not.toHaveAttribute("data-visible");
  await expect(
    page.locator('.cover .cover-name[data-signature="complete"]'),
  ).toBeAttached();
  await expect(hint).toHaveAttribute("data-visible", "true");
  await expect(hint.locator(".gesture-desktop-copy")).toBeVisible();
  await expect(hint).toHaveCSS("pointer-events", "none");
  const bounds = await hint.boundingBox();
  const link = await page.locator(".cover .open-book").boundingBox();
  const role = await page.locator(".cover .cover-role").boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThan(link!.y);
  expect(bounds!.y).toBeGreaterThan(role!.y + role!.height);
  expect(bounds!.y).toBeGreaterThan(0);
  expect(link!.y + link!.height).toBeLessThanOrEqual(height);
  expect(bounds!.x).toBeGreaterThan(0);
  expect(bounds!.x + bounds!.width).toBeLessThan(width);
  await page.waitForTimeout(650);
  await page.screenshot({
    path: `test-results/gesture-hint-${width}.png`,
  });
  await page.mouse.wheel(0, 100);
  await expect(hint).not.toHaveAttribute("data-visible");
  await settleBook(page);
  expect(await page.locator(".physical-turn .navigation-hint").count()).toBe(0);
  await page.reload();
  await page.locator("#book-index summary").click();
  await page.locator('#book-index a[href="#top"]').click();
  await settleBook(page);
  await expect(hint).not.toHaveAttribute("data-visible");
});

test("phone message gets its own first appearance after desktop guidance in the same tab", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hint = page.locator(".open-book > .navigation-hint");
  await expect(hint).toHaveAttribute("data-visible", "true");
  await expect(hint).not.toHaveAttribute("data-visible", { timeout: 6500 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(hint).toBeHidden();
  await expect(page.locator(".cover .opening-mobile-copy")).toBeVisible();
  await expect(page.locator(".cover .opening-desktop-copy")).toBeHidden();
  await expect(hint.locator("svg:visible")).toHaveCount(0);
});

test("guidance expires on its own and reduced motion uses a static illustration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hint = page.locator(".open-book > .navigation-hint");
  await expect(hint).toHaveAttribute("data-visible", "true");
  expect(
    await hint.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(hint).not.toHaveAttribute("data-visible", { timeout: 6500 });
  await page.reload();
  await expect(hint).not.toHaveAttribute("data-visible");
});

test("oversized reading content consumes wheel and touch gestures before a fresh turn", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/#introduction");
  const positions = await stops(page);
  await settleBook(page);
  // Model content enlargement that cannot be fitted, while retaining all ink.
  await page.addStyleTag({
    content: `
    .introduction > .intro-grid { zoom:1!important; width:342px!important; left:24px!important; top:64px!important; }
    .introduction .body-copy { font-size:40px!important; line-height:2!important; }
  `,
  });
  await page.evaluate(() => dispatchEvent(new Event("resize")));
  const reading = page.locator("#introduction");
  await expect(reading).toHaveCSS("overflow", "hidden");
  // Enlargement itself can move native anchor geometry while the fixture is
  // being measured. Start the input check at the measured reading destination.
  await reading.evaluate((el) =>
    scrollTo({
      top: Number((el as HTMLElement).dataset.bookTop),
      behavior: "instant",
    }),
  );
  await settleBook(page);
  await page.mouse.move(190, 400);
  await page.mouse.wheel(0, 200);
  await expect
    .poll(() => reading.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100);
  expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
  // Reaching the bottom within the same gesture cannot spill into navigation.
  await page.mouse.wheel(0, 20000);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
  await page.mouse.wheel(0, 100);
  await settleBook(page);
  expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
  await page.locator("#book-index summary").tap();
  await page.locator('#book-index a[href="#introduction"]').tap();
  await settleBook(page);
  await reading.evaluate((el) => {
    el.scrollTop = 0;
  });
  const client = await context.newCDPSession(page);
  const swipe = async (dy: number) => {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 180, y: 500 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 180, y: 500 + dy }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await settleBook(page);
  };
  await swipe(-160);
  expect(await reading.evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
  expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
  await reading.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  const bottom = await reading.evaluate((el) => el.scrollTop);
  await swipe(80);
  expect(await reading.evaluate((el) => el.scrollTop)).toBeLessThan(bottom);
  expect(await page.evaluate(() => scrollY)).toBe(positions[1]);
  await reading.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await swipe(-65);
  expect(await page.evaluate(() => scrollY)).toBe(positions[2]);
  await context.close();
});
