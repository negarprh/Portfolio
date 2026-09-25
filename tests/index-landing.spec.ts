import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

for (const width of [1440, 390]) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`index lands at chapter starts from either direction: ${width}, ${reducedMotion}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      if (reducedMotion === "no-preference") {
        await expect(page.locator("html")).toHaveAttribute(
          "data-book-enhanced",
          "true",
        );
      }
      const chapters = [
        "introduction",
        "experience",
        "skills",
        "work",
        "education",
        "contact",
      ];
      for (const id of [
        ...chapters,
        ...chapters.toReversed(),
        "introduction",
      ]) {
        await page.locator(".book-index summary").click();
        await page.locator(`.book-index a[href="#${id}"]`).click();
        if (reducedMotion === "no-preference") await settleBook(page);
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect(page.locator(`#${id}`)).toBeFocused();
        expect(
          Math.abs(
            await page
              .locator(`#${id}`)
              .evaluate((el) => el.getBoundingClientRect().top),
          ),
        ).toBeLessThan(2);
        if (id !== "introduction" && id !== "contact") {
          await expect(page.locator(`#${id} .divider h2`)).toBeInViewport();
        }
      }
    });
  }
}
