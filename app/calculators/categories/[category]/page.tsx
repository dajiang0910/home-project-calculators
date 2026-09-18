import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorRow } from "@/src/components/discovery/CalculatorRow";
import styles from "@/src/components/discovery/discovery.module.css";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { Breadcrumb } from "@/src/components/site/Breadcrumb";
import {
  getCalculatorCategory,
  listActiveCalculatorCategories,
  listCalculatorsByCategory,
} from "@/src/lib/calculators/catalog";
import { createPageMetadata } from "@/src/lib/seo/metadata";
import { breadcrumbStructuredData } from "@/src/lib/seo/structured-data";

export function generateStaticParams() {
  return listActiveCalculatorCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/calculators/categories/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCalculatorCategory(slug);
  const calculators = category ? listCalculatorsByCategory(category.slug) : [];
  if (!category || !calculators.length) return {};
  return createPageMetadata({
    title: category.title,
    description: category.description,
    path: `/calculators/categories/${category.slug}`,
    keywords: [`${category.shortTitle.toLowerCase()} calculators`, `${category.shortTitle.toLowerCase()} material calculator`],
  });
}

export default async function CalculatorCategoryPage({ params }: PageProps<"/calculators/categories/[category]">) {
  const { category: slug } = await params;
  const category = getCalculatorCategory(slug);
  const calculators = category ? listCalculatorsByCategory(category.slug) : [];
  if (!category || !calculators.length) notFound();
  const relatedCategories = listActiveCalculatorCategories().filter((item) => item.slug !== category.slug);

  const breadcrumbData = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    { name: category.shortTitle, path: `/calculators/categories/${category.slug}` },
  ];

  return (
    <main id="main-content" className={styles.page}>
      <JsonLd data={breadcrumbStructuredData(breadcrumbData)} />
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Calculators", href: "/calculators" },
        { label: category.shortTitle },
      ]} />

      <section className={styles.categoryHero}>
        <div className={styles.categoryHeroGrid}>
          <div>
            <p className={styles.eyebrow}>{String(calculators.length).padStart(2, "0")} tested {calculators.length === 1 ? "calculator" : "calculators"}</p>
            <h1>{category.title}</h1>
            <p className={styles.categoryHeroLead}>{category.description}</p>
          </div>
          <div className={styles.categoryAccent} aria-hidden="true">{category.marker}</div>
        </div>
      </section>

      <div className={styles.categoryBody}>
        <div className={styles.categoryBodyGrid}>
          <section aria-labelledby="available-tools">
            <h2 id="available-tools">Available tools</h2>
            <div className={styles.toolList}>{calculators.map((calculator) => <CalculatorRow key={calculator.slug} calculator={calculator} />)}</div>
          </section>

          <aside className={styles.categoryDetail}>
            <p className={styles.eyebrow}>Plan the next decision</p>
            <h2>What these tools account for</h2>
            <p>{category.detail}</p>
            <h2>Planned additions</h2>
            <ul className={styles.plannedTools}>{category.plannedTools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
            <h2>Related project areas</h2>
            <div className={styles.relatedCategories}>{relatedCategories.map((item) => <Link key={item.slug} href={`/calculators/categories/${item.slug}`}>{item.shortTitle}</Link>)}</div>
          </aside>
        </div>
      </div>
    </main>
  );
}
