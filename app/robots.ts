import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/seo/site";
import { absoluteUrl } from "@/src/lib/seo/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
