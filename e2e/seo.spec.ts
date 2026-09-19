import { expect, test } from "@playwright/test";
import { PUBLISHED_PATHS } from "../src/lib/seo/migration";
import { calculatorCatalog } from "../src/lib/calculators/catalog";

const origin = "https://projectbuylist.com";
const homeTitle = "Home Improvement Calculators | Project Buy List";

test("homepage publishes consistent metadata and an accessible organization logo", async ({ page, request }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(homeTitle);
  await expect(page.locator("title")).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", homeTitle);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", homeTitle);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).href).toBe(`${origin}/`);
  const robots = await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("content")));
  expect(robots.join(" ")).not.toMatch(/noindex|nofollow/i);

  const data = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .flatMap(text => JSON.parse(text));
  expect(data).toEqual(expect.arrayContaining([
    expect.objectContaining({ "@type": "WebSite", url: origin }),
    expect.objectContaining({
      "@type": "Organization",
      url: origin,
      logo: `${origin}/images/brand/project-buy-list-logo-mark.png`,
    }),
  ]));
  const logo = await request.get("/images/brand/project-buy-list-logo-mark.png");
  expect(logo.status()).toBe(200);
  expect(logo.headers()["content-type"]).toContain("image/png");
});

test("robots allows production crawling and advertises the canonical sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toMatch(/^User-Agent:\s*\*\s*$/im);
  expect(body).toMatch(/^Allow:\s*\/\s*$/im);
  expect(body).not.toMatch(/^Disallow:\s*\/\s*$/im);
  expect(body).toContain(`Sitemap: ${origin}/sitemap.xml`);
});

test("sitemap separates canonical pages from images and every page resolves", async ({ page, request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  await page.goto("/");
  const sitemap = await page.evaluate(source => {
    const doc = new DOMParser().parseFromString(source, "application/xml");
    return {
      errors: doc.getElementsByTagName("parsererror").length,
      pages: Array.from(doc.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "url"))
        .map(node => Array.from(node.children).find(child => child.localName === "loc")?.textContent),
      images: Array.from(doc.getElementsByTagNameNS("http://www.google.com/schemas/sitemap-image/1.1", "loc"))
        .map(node => node.textContent),
    };
  }, xml);
  expect(sitemap.errors).toBe(0);
  expect(sitemap.pages.sort()).toEqual(PUBLISHED_PATHS.map(path => `${origin}${path}`).sort());
  expect(sitemap.images.sort()).toEqual(calculatorCatalog.map(item => `${origin}${item.image}`).sort());
  for (const url of sitemap.pages) {
    const result = await request.get(new URL(url!).pathname, { maxRedirects: 0 });
    expect(result.status(), url!).toBe(200);
    expect(result.headers()["x-robots-tag"] ?? "").not.toMatch(/noindex/i);
  }
});

test("unknown top-level paths return a non-indexable 404 without a canonical", async ({ page }) => {
  const response = await page.goto("/not-a-published-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  const directives = await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("content")));
  expect(directives.length).toBeGreaterThan(0);
  expect(directives.every(value => /\bnoindex\b/.test(value ?? ""))).toBe(true);
});
