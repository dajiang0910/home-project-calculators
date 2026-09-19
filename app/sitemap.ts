import type { MetadataRoute } from "next";
import { calculatorCatalog, listActiveCalculatorCategories } from "@/src/lib/calculators/catalog";
import { absoluteUrl } from "@/src/lib/seo/urls";
import { siteNoIndex } from "@/src/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteNoIndex) return [];
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/calculators"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/how-we-calculate"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  const categoryPages: MetadataRoute.Sitemap = listActiveCalculatorCategories().map((category) => ({
    url: absoluteUrl(`/calculators/categories/${category.slug}`),
    changeFrequency: "weekly",
    priority: 0.75,
  }));
  const calculatorPages: MetadataRoute.Sitemap = calculatorCatalog.map((calculator) => ({
    url: absoluteUrl(`/calculators/${calculator.slug}`),
    changeFrequency: "monthly",
    priority: calculator.featured ? 0.85 : 0.8,
    images: [absoluteUrl(calculator.image)],
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages];
}
