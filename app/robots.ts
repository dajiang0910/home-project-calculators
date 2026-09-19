import type { MetadataRoute } from "next";
import { SITE, siteNoIndex } from "@/src/lib/seo/site";
import { absoluteUrl } from "@/src/lib/seo/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(siteNoIndex ? { disallow: "/" } : { allow: "/" }) },
    sitemap: siteNoIndex ? undefined : absoluteUrl("/sitemap.xml"),
    host: siteNoIndex ? undefined : SITE.url,
  };
}
