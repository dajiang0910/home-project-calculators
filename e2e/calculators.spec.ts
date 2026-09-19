import { expect, test } from "@playwright/test";

test("homepage search opens a calculator", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search calculators" });
  await search.fill("paint");
  await expect(page.getByRole("link", { name: /Paint Calculator/ }).first()).toBeVisible();
  await search.press("Enter");
  await expect(page).toHaveURL(/\/calculators\/paint$/);
  await expect(page.getByRole("heading", { name: "Paint Calculator", exact: true })).toBeVisible();
});

test("calculator renders a default estimate and guides the user through validation", async ({ page }) => {
  await page.goto("/calculators/paint");
  await expect(page.getByRole("heading", { name: "Paint Calculator", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Calculator results" }).getByText("Recommended Purchase", { exact: true })).toBeVisible();

  await page.getByLabel("Room Length").fill("");
  await expect(page.getByRole("region", { name: "Calculator inputs" }).getByText(/Enter a valid number for room length/)).toBeVisible();
  await page.getByLabel("Room Length").fill("14");
  await expect(page.getByRole("region", { name: "Calculator results" }).getByText("Recommended Purchase", { exact: true })).toBeVisible();
});

test("every published calculator renders its default result", async ({ page }) => {
  const calculators = [
    ["paint", "Recommended Purchase"],
    ["flooring", "Boxes Needed"],
    ["tile", "Tiles Needed"],
    ["drywall", "Sheets Needed"],
    ["wallpaper", "Rolls Needed"],
    ["ceiling-paint", "Recommended Purchase"],
    ["baseboard", "Pieces Needed"],
  ] as const;
  for (const [slug, resultLabel] of calculators) {
    await page.goto(`/calculators/${slug}`);
    await expect(page.getByRole("heading", { name: /Calculator/, exact: false }).first()).toBeVisible();
    await expect(page.getByRole("region", { name: "Calculator results" }).getByText(resultLabel, { exact: true })).toBeVisible();
  }
});

test("unit switching keeps the calculator usable", async ({ page }) => {
  await page.goto("/calculators/flooring");
  await expect(page.getByRole("region", { name: "Calculator results" }).getByText("Boxes Needed", { exact: true })).toBeVisible();
  await page.getByRole("radio", { name: /Metric/ }).check();
  await expect(page.getByLabel("Room Length")).toHaveValue("4.2672");
  await expect(page.getByRole("region", { name: "Calculator results" }).getByText("Boxes Needed", { exact: true })).toBeVisible();
});

test("zero openings hide their unused fields", async ({ page }) => {
  await page.goto("/calculators/drywall");
  await page.getByText("Door & window sizes", { exact: true }).click();
  await page.getByLabel("Number of Doors").fill("0");
  await expect(page.getByLabel("Door Width")).not.toBeVisible();
  await page.getByLabel("Number of Doors").fill("1");
  await expect(page.getByLabel("Door Width")).toBeVisible();
  await page.getByLabel("Number of Doors").fill("0");
  await expect(page.getByLabel("Door Width")).not.toBeVisible();
});

test("unknown calculator slugs return not found", async ({ page }) => {
  const response = await page.goto("/calculators/not-a-calculator");
  expect(response?.status()).toBe(404);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("calculator pages keep their SEO link and fit on a phone", async ({ page }) => {
  await page.goto("/calculators/paint");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/calculators\/paint$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
