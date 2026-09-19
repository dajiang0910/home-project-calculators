import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalculatorCard } from "@/src/components/discovery/CalculatorCard";
import { CalculatorRow } from "@/src/components/discovery/CalculatorRow";
import { CalculatorSearch } from "@/src/components/discovery/CalculatorSearch";
import styles from "@/src/components/discovery/discovery.module.css";
import { JsonLd } from "@/src/components/seo/JsonLd";
import {
  calculatorCatalog,
  listActiveCalculatorCategories,
  listCalculatorsByCategory,
} from "@/src/lib/calculators/catalog";
import { organizationStructuredData, websiteStructuredData } from "@/src/lib/seo/structured-data";
import { SITE } from "@/src/lib/seo/site";
import { createPageMetadata } from "@/src/lib/seo/metadata";

const homeTitle = "Home Improvement Calculators | Project Buy List";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: homeTitle,
    description: SITE.description,
    path: "/",
  }),
  title: { absolute: homeTitle },
};

export default function Home() {
  const featured = calculatorCatalog.filter((calculator) => calculator.featured);
  const moreCalculators = calculatorCatalog.filter((calculator) => !calculator.featured);
  const categories = listActiveCalculatorCategories();

  return (
    <main id="main-content" className={styles.home}>
      <JsonLd data={[websiteStructuredData(), organizationStructuredData()]} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{SITE.descriptor}</p>
            <h1>Measure once. Buy with confidence.</h1>
            <p className={styles.heroLead}>Plan home improvement materials, waste, package quantities, and cost with calculators that show their assumptions.</p>
            <CalculatorSearch calculators={calculatorCatalog} />
            <div className={styles.heroProof} aria-label="Site benefits">
              <span>Free to use</span>
              <span>US and metric</span>
              <span>Transparent formulas</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.visualMain}>
              <Image src="/images/calculators/flooring-hero.png" alt="" fill priority sizes="(max-width: 899px) 100vw, 42vw" />
              <div className={styles.visualCaption}><strong>Plan the whole purchase</strong><span>Area → waste → boxes</span></div>
            </div>
            <div className={styles.visualSecondary}>
              <Image src="/images/calculators/paint-hero.png" alt="" fill priority sizes="(max-width: 899px) 54vw, 22vw" />
            </div>
            <div className={styles.visualBlueprint} />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="popular-calculators">
        <div className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>Start with the room in front of you</p><h2 id="popular-calculators">Popular calculators</h2></div>
          <Link href="/calculators" className={styles.textLink}>Browse all {calculatorCatalog.length} tools <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.popularGrid}>{featured.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}</div>
      </section>

      <section className={styles.section} aria-labelledby="browse-project">
        <div className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>A clearer way into the catalog</p><h2 id="browse-project">Browse by project</h2></div>
          <p>Each project area groups tools that share measurements, materials, and the next decisions you will make.</p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const toolCount = listCalculatorsByCategory(category.slug).length;
            return (
              <Link key={category.slug} href={`/calculators/categories/${category.slug}`} className={styles.categoryLink}>
                <span className={styles.categoryMarker} aria-hidden="true">{category.marker}</span>
                <span className={styles.categoryCopy}><strong>{category.shortTitle}</strong><span>{category.description}</span></span>
                <span className={styles.categoryCount}>{toolCount === 1 ? "tool" : "tools"}<span>{String(toolCount).padStart(2, "0")}</span></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.planningBand} aria-labelledby="plan-next-project">
        <div className={styles.planningInner}>
          <h2 id="plan-next-project">From rough measurements to a store-ready number.</h2>
          <p>A useful estimate does more than multiply dimensions. It makes the assumptions between a room and a purchase visible.</p>
          <div className={styles.planningSteps}>
            <div className={styles.planningStep}><span>01</span><div><strong>Measure the project</strong><p>Enter the dimensions and openings that affect the material area.</p></div></div>
            <div className={styles.planningStep}><span>02</span><div><strong>Adjust the assumptions</strong><p>Match coverage, waste, package size, and price to the product you plan to use.</p></div></div>
            <div className={styles.planningStep}><span>03</span><div><strong>Plan the purchase</strong><p>See the calculated need, the rounded quantity to buy, and the estimated material cost.</p></div></div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="more-calculators">
        <div className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>Keep the project moving</p><h2 id="more-calculators">More calculators</h2></div>
          <p>Finish the surrounding surfaces and trim with the same measurement-first approach.</p>
        </div>
        <div className={styles.toolList}>{moreCalculators.map((calculator) => <CalculatorRow key={calculator.slug} calculator={calculator} showCategory />)}</div>
      </section>

      <section className={styles.section} aria-labelledby="why-trust-us">
        <div className={styles.trustGrid}>
          <h2 id="why-trust-us" className={styles.trustStatement}>An estimate is more useful when you can see <span>how it was made.</span></h2>
          <div className={styles.trustPoints}>
            <div className={styles.trustPoint}><span>01</span><div><strong>Transparent formulas</strong><p>Every calculator explains the geometry, deductions, waste, and rounding behind the result.</p></div></div>
            <div className={styles.trustPoint}><span>02</span><div><strong>Practical purchase quantities</strong><p>Results distinguish calculated material need from the full boxes, sheets, rolls, or containers you may need to buy.</p></div></div>
            <div className={styles.trustPoint}><span>03</span><div><strong>Tested calculations</strong><p>Reference examples, conversion behavior, validation, and package boundaries are covered by automated contract tests.</p></div></div>
            <div className={styles.trustPoint}><span>04</span><div><strong>Clear limits</strong><p>Each tool states what its estimate includes so you know when local product details or professional advice still matter.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
