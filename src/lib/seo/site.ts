const localSiteUrl = "http://localhost:3000";

export function resolveSiteUrl(value: string | undefined, environment = process.env.NODE_ENV): string {
  const configuredUrl = value?.trim();
  const fail = (reason: string): string => {
    if (environment === "production") {
      throw new Error(`NEXT_PUBLIC_SITE_URL ${reason}`);
    }
    return localSiteUrl;
  };

  if (!configuredUrl) return fail("is required for production builds.");

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    return fail("must be a valid absolute URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return fail("must use an http or https URL.");
  }
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    return fail("must be a site origin without credentials, a path, a query, or a fragment.");
  }
  return url.origin;
}

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function isSiteNoIndex(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

export const siteNoIndex = isSiteNoIndex(process.env.SITE_NOINDEX);

export const SITE = {
  name: "Project Buy List",
  shortName: "PBL",
  url: resolveSiteUrl(configuredUrl),
  descriptor: "Home Improvement Calculators & Material Planning Tools",
  description: "Home improvement calculators and material planning tools for quantities, waste, purchase packages, and project costs.",
  locale: "en_US",
  githubIssuesUrl: "https://github.com/dajiang0910/home-project-calculators/issues",
} as const;
