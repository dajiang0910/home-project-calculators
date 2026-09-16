import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorClient } from "@/src/components/calculators/CalculatorClient";
import { getCalculator } from "@/src/lib/calculators";

export async function generateMetadata({
  params,
}: PageProps<"/calculators/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};

  return {
    title: calculator.metadata.title,
    description: calculator.metadata.description,
    keywords: [...calculator.metadata.keywords],
  };
}

export default async function CalculatorPage({
  params,
}: PageProps<"/calculators/[slug]">) {
  const { slug } = await params;
  if (!getCalculator(slug)) notFound();

  return <CalculatorClient slug={slug} />;
}
