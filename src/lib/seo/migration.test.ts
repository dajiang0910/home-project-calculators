import assert from "node:assert/strict";
import test from "node:test";
import { LEGACY_SITE_ORIGIN, MIGRATABLE_PATHS, PRODUCTION_SITE_ORIGIN, legacyRedirectUrl, migrationRedirectResponse, PUBLISHED_PATHS } from "./migration";

test("www redirects directly to HTTPS apex, preserving query and unknown paths", () => {
  for (const protocol of ["http", "https"]) {
    const response = migrationRedirectResponse(new Request(`${protocol}://www.projectbuylist.com/calculators/paint/?unit=metric`), false);
    assert.equal(response?.status, 308);
    assert.equal(response?.headers.get("location"), "https://projectbuylist.com/calculators/paint?unit=metric");
  }
  assert.equal(migrationRedirectResponse(new Request("https://www.projectbuylist.com/unknown"), false)?.headers.get("location"), "https://projectbuylist.com/unknown");
  assert.equal(migrationRedirectResponse(new Request("https://projectbuylist.com/"), false), undefined);
});

test("the migration map contains the 18 published paths", () => {
  assert.equal(PUBLISHED_PATHS.length, 18);
  assert.equal(new Set(PUBLISHED_PATHS).size, PUBLISHED_PATHS.length);
  assert.ok(PUBLISHED_PATHS.includes("/calculators/wallpaper"));
  assert.ok(PUBLISHED_PATHS.includes("/calculators/categories/trim"));
});

test("legacy published URLs redirect directly to production and preserve query strings", async () => {
  const request = new Request(`${LEGACY_SITE_ORIGIN}/calculators/wallpaper?unit=metric`);
  assert.equal(legacyRedirectUrl(request, true), `${PRODUCTION_SITE_ORIGIN}/calculators/wallpaper?unit=metric`);
  const response = migrationRedirectResponse(request, true);
  assert.equal(response?.status, 308);
  assert.equal(response?.headers.get("location"), `${PRODUCTION_SITE_ORIGIN}/calculators/wallpaper?unit=metric`);
});

test("redirects stay disabled by default and unknown paths are not sent to the homepage", () => {
  const disabled = new Request(`${LEGACY_SITE_ORIGIN}/calculators/paint`);
  assert.equal(migrationRedirectResponse(disabled, false), undefined);
  const unknown = new Request(`${LEGACY_SITE_ORIGIN}/not-a-page`);
  assert.equal(migrationRedirectResponse(unknown, true), undefined);
  assert.equal(MIGRATABLE_PATHS.has("/not-a-page"), false);
});

test("trailing slash is normalized in one legacy redirect", () => {
  const request = new Request(`${LEGACY_SITE_ORIGIN}/calculators/paint/`);
  assert.equal(migrationRedirectResponse(request, true)?.headers.get("location"), `${PRODUCTION_SITE_ORIGIN}/calculators/paint`);
});
