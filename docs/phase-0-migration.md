# Project Buy List Phase 0

Reviewed: September 19, 2026

## Production origin

The production origin is `https://projectbuylist.com`. The production Worker remains named `home-project-calculators`; it serves the custom domain. At the owner's request on September 19, 2026, its legacy `workers.dev` endpoint and preview URLs were disabled. The Worker itself must not be deleted while it serves production. Paths remain stable.

The historical machine-readable path map remains in `src/lib/seo/migration.ts` for recovery, but production now sets `ENABLE_PRODUCTION_REDIRECTS=false` and `workers_dev=false`. Old links no longer redirect. The `www.projectbuylist.com` custom domain redirects directly to HTTPS apex with a 308, preserving the path and query and normalizing trailing slashes. Unknown paths retain their path and resolve to the production 404.

## Canonical and crawl policy

`NEXT_PUBLIC_SITE_URL` is the source of truth for absolute metadata, sitemap, robots, and structured-data URLs. Production builds must use `https://projectbuylist.com`; development and unit tests may use the local fallback. `SITE_NOINDEX=1` or `true` emits `noindex,nofollow`, disallows crawling, and omits the sitemap pointer for preview builds.

The homepage owns the `/` canonical explicitly; the root 404 page is `noindex` and has no canonical so unknown URLs cannot inherit the homepage URL.

## Wallpaper calculation boundary

The current Wallpaper model is an area-based estimate with a vertical pattern-repeat adjustment. It calculates gross wall area, subtracts door and window area, applies extra waste, estimates full-height strips, and rounds whole rolls. It does not model match type, starting phase, per-drop trim, irregular wall layouts, or offcut reuse. Half-drop and complex pattern estimates require manufacturer guidance. The worked example is generated from the same engine and default fixture as the regression test.

## Money calculation

Calculator engines retain decimal unit prices as entered. Purchase quantities are whole numbers. Final cost totals use integerized decimal arithmetic and round once to USD cents; display formatting never feeds back into calculation. Prices must be finite and non-negative, and totals outside the supported JavaScript numeric range throw a validation error.

## Local analytics seam

The browser emits typed `calculator_event` CustomEvents for existing calculator interactions only. No event is sent to a network service, persisted, or associated with a user identifier. Payloads contain only the calculator slug, unit system, controlled field/group names, and related-tool slug; measurements, prices, results, and free text are excluded.

## Deployment status and remaining manual actions

Deployment `e21f4911-e1cd-4c06-a4e3-b9b37924af71` serves the apex and www custom domains. Live checks confirm apex 200, www 308 to apex with query preserved, and disabled legacy endpoint 404. Google Search Console domain ownership for `sc-domain:projectbuylist.com` was verified through Cloudflare DNS; retain the Google verification TXT record. The production sitemap was submitted successfully on September 19, 2026, and Search Console reported 18 discovered pages. Discovery does not mean indexing is complete. Change of Address was not submitted: the old property is not verified here and its redirects were removed at the owner's request. To restore legacy redirects, explicitly re-enable both `workers_dev` and `ENABLE_PRODUCTION_REDIRECTS` and deploy.
