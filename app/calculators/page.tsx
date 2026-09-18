import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorRow } from "@/src/components/discovery/CalculatorRow";
import { CalculatorSearch } from "@/src/components/discovery/CalculatorSearch";
import styles from "@/src/components/discovery/discovery.module.css";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { Breadcrumb } from "@/src/components/site/Breadcrumb";
import {
  calculatorCatalog,
  calculatorCategories,
  listActiveCalculatorCategories,
  listCalculatorsByCategory,
} from "@/src/lib/calculators/catalog";
import { createPageMetadata } from "@/src/lib/seo/metadata";
import { breadcrumbStructuredData } from "@/src/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Home Improvement Calculators",
  description: "Browse free calculators for paint, flooring, tile, drywall, wallpaper, ceiling paint, and trim projects.",
  path: "/calculators",
  keywords: ["home improvement calculators", "material calculators", "DIY project calculators"],
});

export default function CalculatorsPage() {
  const categories = listActiveCalculatorCategories();
  const plannedCategories = calculatorCategories.filter((category) => !categories.some((active) => active.slug === category.slug));

  return (
    <main id="main-content" className={styles.page}>
      <JsonLd data={breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Calculators", path: "/calculators" },
      ])} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Calculators" }]} />

      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <p className={styles.eyebrow}>The complete tool directory</p>
          <h1>Plan the material before you start the project.</h1>
          <p className={styles.pageHeroLead}>Find a calculator by material or project area. Every tool explains its assumptions, supports US and metric units, and rounds purchases the way materials are actually sold.</p>
          <CalculatorSearch calculators={calculatorCatalog} />
          <div className={styles.pageStats}><span><strong>{calculatorCatalog.length}</strong> live calculators</span><span><strong>{categories.length}</strong> active project areas</span><span><strong>02</strong> unit systems</span></div>
        </div>
      </section>

      <div className={styles.directory}>
        <div className={styles.directoryIntro}>
          <p className={styles.eyebrow}>Browse by project</p>
          <h2>Tools that belong together stay together.</h2>
          <p>Project hubs connect related calculators and explain the measurements they share. New tools will appear here automatically when they are published in the catalog.</p>
        </div>

        {categories.map((category) => {
          const calculators = listCalculatorsByCategory(category.slug);
          return (
            <section key={category.slug} className={styles.categorySection} aria-labelledby={`category-${category.slug}`}>
              <div className={styles.categoryHeading}>
                <p className={styles.eyebrow}>{String(calculators.length).padStart(2, "0")} live {calculators.length === 1 ? "tool" : "tools"}</p>
                <h2 id={`category-${category.slug}`}>{category.shortTitle}</h2>
                <p>{category.description}</p>
                <Link href={`/calculators/categories/${category.slug}`}>Explore {category.shortTitle.toLowerCase()} planning <span aria-hidden="true">→</span></Link>
              </div>
              <div className={styles.categoryTools}>{calculators.map((calculator) => <CalculatorRow key={calculator.slug} calculator={calculator} />)}</div>
            </section>
          );
        })}
      </div>

      <section className={styles.roadmap} aria-labelledby="next-project-areas">
        <div className={styles.roadmapInner}>
          <p className={styles.eyebrow}>Growing deliberately</p>
          <h2 id="next-project-areas">Next project areas</h2>
          <p>Construction, outdoor, and roofing hubs will become public when their first tested calculator is ready. This keeps the directory useful and avoids empty category pages.</p>
          <div className={styles.plannedList}>{plannedCategories.map((category) => <span key={category.slug}>{category.shortTitle} · {category.plannedTools[0]}</span>)}</div>
        </div>
      </section>
    </main>
  );
}
