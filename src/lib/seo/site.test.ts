import assert from "node:assert/strict";
import test from "node:test";
import { resolveSiteUrl } from "./site";

test("development and test environments may use the local site URL", () => {
  assert.equal(resolveSiteUrl(undefined, "development"), "http://localhost:3000");
  assert.equal(resolveSiteUrl("", "test"), "http://localhost:3000");
});

test("configured site URLs are normalized and restricted to HTTP origins", () => {
  assert.equal(resolveSiteUrl(" https://example.com/ ", "production"), "https://example.com");
  assert.throws(() => resolveSiteUrl("mailto:hello@example.com", "production"), /http or https/i);
});

test("production fails fast when the public site URL is missing or invalid", () => {
  assert.throws(() => resolveSiteUrl(undefined, "production"), /NEXT_PUBLIC_SITE_URL/);
  assert.throws(() => resolveSiteUrl("not a url", "production"), /NEXT_PUBLIC_SITE_URL/);
});
