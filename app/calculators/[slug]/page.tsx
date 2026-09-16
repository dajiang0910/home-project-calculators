import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorClient } from "@/src/components/calculators/CalculatorClient";
import { CalculatorGuide } from "@/src/components/calculators/CalculatorGuide";
import { getCalculator, listCalculators } from "@/src/lib/calculators";

export function generateStaticParams() {
  return listCalculators().map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/calculators/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};

  return {
    title: calculator.metadata.seoTitle ?? calculator.metadata.title,
    description: calculator.metadata.description,
    keywords: [...calculator.metadata.keywords],
  };
}

export default async function CalculatorPage({
  params,
}: PageProps<"/calculators/[slug]">) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();

  return (
    <CalculatorClient key={slug} slug={slug}>
      {calculator.content ? <CalculatorGuide content={calculator.content} /> : null}
    </CalculatorClient>
  );
}
