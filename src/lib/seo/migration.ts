export const LEGACY_SITE_ORIGIN = "https://home-project-calculators.dajiang0910.workers.dev";
export const PRODUCTION_SITE_ORIGIN = "https://projectbuylist.com";

/** Stable public paths published by the Phase 0 MVP. */
export const PUBLISHED_PATHS = [
  "/",
  "/calculators",
  "/calculators/paint",
  "/calculators/flooring",
  "/calculators/tile",
  "/calculators/drywall",
  "/calculators/wallpaper",
  "/calculators/ceiling-paint",
  "/calculators/baseboard",
  "/calculators/categories/painting",
  "/calculators/categories/flooring",
  "/calculators/categories/walls",
  "/calculators/categories/trim",
  "/how-we-calculate",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export const MIGRATABLE_PATHS = new Set<string>([
  ...PUBLISHED_PATHS,
  "/sitemap.xml",
  "/robots.txt",
]);

export function productionUrl(path: string, search = ""): string {
  return `${PRODUCTION_SITE_ORIGIN}${path}${search}`;
}

export function legacyRedirectUrl(request: Request, enabled: boolean): string | undefined {
  if (!enabled) return undefined;
  const url = new URL(request.url);
  const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  if (url.origin !== LEGACY_SITE_ORIGIN || !MIGRATABLE_PATHS.has(path)) return undefined;
  return productionUrl(path, url.search);
}

export function migrationRedirectResponse(request: Request, enabled: boolean): Response | undefined {
  const url = new URL(request.url);
  if (url.hostname === "www.projectbuylist.com") {
    const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return new Response(null, { status: 308, headers: { Location: productionUrl(path, url.search) } });
  }
  const location = legacyRedirectUrl(request, enabled);
  return location ? new Response(null, { status: 308, headers: { Location: location } }) : undefined;
}
