import type { CalculatorContent } from "@/src/lib/calculators";
import { ExampleCard } from "./ExampleCard";
import { FAQ } from "./FAQ";
import { FormulaCard } from "./FormulaCard";
import { InfoCard } from "./InfoCard";
import { RelatedCalculatorCard } from "./RelatedCalculatorCard";
import styles from "./calculator.module.css";

export function CalculatorGuide({ content }: { content: CalculatorContent }) {
  return <div className={styles.guide}>
    <section aria-labelledby="how-it-works"><p className={styles.sectionKicker}>A little planning goes a long way</p><h2 id="how-it-works" className={styles.guideTitle}>How It Works</h2><div className={styles.steps}>{content.howItWorks.map((step, index) => <InfoCard key={step.title} title={step.title} icon={String(index + 1).padStart(2, "0")} level="h3"><p>{step.text}</p></InfoCard>)}</div></section>
    <div className={styles.guideGrid}><FormulaCard content={content} /><ExampleCard content={content} /><FAQ content={content} /></div>
    <section aria-labelledby="related-calculators" className={styles.related}><div className={styles.relatedHeading}><div><p className={styles.sectionKicker}>Keep planning</p><h2 id="related-calculators">Related Calculators</h2></div><span className={styles.relatedRule} /></div><div className={styles.relatedGrid}>{content.related.map((item) => <RelatedCalculatorCard key={item.slug} item={item} />)}</div></section>
  </div>;
}
