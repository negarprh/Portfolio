import { test, expect } from "@playwright/test";
import { settleBook } from "./motion-helpers";

const inventory = [
  [
    "TypeScript",
    "Node.js",
    "NestJS",
    "Express.js",
    "Python",
    "FastAPI",
    "Flask",
    "Java",
    "Spring Boot",
  ],
  ["PostgreSQL", "MongoDB", "Prisma", "SQLAlchemy"],
  ["React", "Next.js", "Angular", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
  ["Docker", "AWS", "GitHub Actions", "Supabase", "Firebase", "Azure DevOps"],
  ["Git", "GitHub", "Postman", "Swagger", "Vitest", "Pytest", "Zod"],
];

for (const width of [1440, 1100, 820, 390]) {
  test(`Skills inventory fits two readable spreads at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const skills = page.locator("#skills");
    await expect(skills.locator(".skills-intro")).toHaveText(
      "I work primarily across backend and full-stack development.",
    );
    await expect(skills.locator(".skills-spread")).toHaveCount(2);
    const pages = skills.locator(".skills-page");
    for (const [index, headings] of [
      ["01Backend"],
      ["03Frontend"],
      ["02Data", "05Tools & Testing"],
      ["04Infra & Cloud"],
    ].entries()) {
      await expect(pages.nth(index).locator("h3")).toHaveText(headings);
    }
    await expect(pages.nth(0).locator(".skills-intro")).toHaveCount(1);
    await expect(
      skills.locator(".skills-spread").nth(0).locator(".skill-group"),
    ).toHaveCount(2);
    await expect(
      skills.locator(".skills-spread").nth(1).locator(".skill-group"),
    ).toHaveCount(3);
    await expect(skills.locator(".skill-group h3")).toHaveText([
      "01Backend",
      "03Frontend",
      "02Data",
      "05Tools & Testing",
      "04Infra & Cloud",
    ]);
    for (let i = 0; i < inventory.length; i++) {
      await expect(
        skills.locator(
          `ul[aria-labelledby="skill-category-${i}"] > li > span:last-child`,
        ),
      ).toHaveText(inventory[i]);
    }
    await expect(skills).not.toContainText(
      /Redis|Stripe|OpenAPI|proficiency|expert|intermediate|beginner/i,
    );
    for (const [i, spread] of (
      await skills.locator(".skills-spread").all()
    ).entries()) {
      await spread.locator("img").evaluateAll(async (images) => {
        await Promise.all(
          images.map(async (node) => {
            const image = node as HTMLImageElement;
            image.loading = "eager";
            await image.decode();
          }),
        );
      });
      const top = await spread.evaluate(
        (el) => el.getBoundingClientRect().top + scrollY,
      );
      for (const offset of [0, -350, 0]) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: "instant" }),
          top + offset,
        );
        await settleBook(page);
      }
      await expect(spread.locator(".skills-content")).toHaveCSS(
        "clip-path",
        "none",
      );
      const overflow = await spread
        .locator("li, h3, ul")
        .evaluateAll((nodes) =>
          nodes.some((n) => n.scrollWidth > n.clientWidth + 1),
        );
      expect(overflow).toBe(false);
      for (const logo of await spread.locator("img").all()) {
        await expect(logo).toHaveAttribute("alt", "");
        await expect(logo).toHaveCSS("filter", /skills-icon-ink/);
      }
      await spread.screenshot({
        path: `test-results/skills-${width}-${i}.png`,
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-book-enhanced",
    );
    await expect(skills.locator('[style*="--reading-clip"]')).toHaveCount(0);
  });
}

test("Skills inventory remains complete without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.locator("#skills .skill-group li > span:last-child"),
  ).toHaveText(
    [
      inventory[0],
      inventory[2],
      inventory[1],
      inventory[4],
      inventory[3],
    ].flat(),
  );
  await expect(page.locator("#skills .skills-spread")).toHaveCount(2);
  await context.close();
});
