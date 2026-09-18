import type { Metadata } from "next";
import { SITE } from "./site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  image?: string;
};

export function createPageMetadata({ title, description, path, keywords, image }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url: path,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
