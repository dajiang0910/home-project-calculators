import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorClient } from "@/src/components/calculators/CalculatorClient";
import { CalculatorGuide } from "@/src/components/calculators/CalculatorGuide";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { getCalculatorCategory } from "@/src/lib/calculators/catalog";
import { getCalculatorManifest, listCalculators } from "@/src/lib/calculators/registry";
import { createPageMetadata } from "@/src/lib/seo/metadata";
import { breadcrumbStructuredData } from "@/src/lib/seo/structured-data";

export function generateStaticParams() {
  return listCalculators().map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/calculators/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorManifest(slug);
  if (!calculator) return {};

  return createPageMetadata({
    title: calculator.metadata.seoTitle ?? calculator.metadata.title,
    description: calculator.metadata.description,
    keywords: [...calculator.metadata.keywords],
    path: `/calculators/${slug}`,
    image: calculator.image,
  });
}

export default async function CalculatorPage({
  params,
}: PageProps<"/calculators/[slug]">) {
  const { slug } = await params;
  const calculator = getCalculatorManifest(slug);
  if (!calculator) notFound();
  const category = getCalculatorCategory(calculator.metadata.category);
  const content = await calculator.loadContent();
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    ...(category ? [{ name: category.shortTitle, path: `/calculators/categories/${category.slug}` }] : []),
    { name: calculator.metadata.title, path: `/calculators/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbStructuredData(breadcrumbItems)} />
      <CalculatorClient
        key={slug}
        slug={slug}
        metadata={calculator.metadata}
        hero={calculator.hero}
        image={calculator.image}
        category={category ? { slug: category.slug, shortTitle: category.shortTitle } : undefined}
        intro={content.intro}
      >
        <CalculatorGuide content={content} />
      </CalculatorClient>
    </>
  );
}
