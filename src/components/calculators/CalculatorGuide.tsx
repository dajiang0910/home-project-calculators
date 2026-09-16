import Link from "next/link";
import { getCalculator, type CalculatorContent } from "@/src/lib/calculators";
import styles from "./calculator.module.css";

export function CalculatorGuide({ content }: { content: CalculatorContent }) {
  return (
    <div className={styles.guide}>
      <section aria-labelledby="how-it-works">
        <p className={styles.eyebrow}>A little planning goes a long way</p>
        <h2 id="how-it-works">How It Works</h2>
        <ol className={styles.steps}>{content.howItWorks.map((step) => (
          <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>
        ))}</ol>
      </section>
      <div className={styles.explanationGrid}>
        <section aria-labelledby="formula-explanation">
          <h2 id="formula-explanation">The formula, explained</h2>
          <dl className={styles.formulas}>{content.formulas.map((formula) => (
            <div key={formula.label}><dt>{formula.label}</dt><dd>{formula.expression}</dd></div>
          ))}</dl>
        </section>
        <section aria-labelledby="example-calculation" className={styles.example}>
          <p className={styles.eyebrow}>Put it into practice</p>
          <h2 id="example-calculation">Example calculation</h2>
          <p>{content.example.description}</p>
          <ol>{content.example.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p className={styles.exampleConclusion}>{content.example.conclusion}</p>
        </section>
      </div>
      <section aria-labelledby="frequent-questions" className={styles.faq}>
        <h2 id="frequent-questions">Frequently asked questions</h2>
        {content.faq.map((item) => (
          <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
        ))}
      </section>
      <section aria-labelledby="related-calculators" className={styles.related}>
        <h2 id="related-calculators">Related Calculators</h2>
        {content.related.map((item) => (
          <div key={item.slug}>
            <h3>{getCalculator(item.slug) ? <Link href={`/calculators/${item.slug}`}>{item.title} ↗</Link> : item.title}</h3>
            <p>{item.description}</p>
            {!getCalculator(item.slug) ? <span className={styles.comingSoon}>Coming soon</span> : null}
          </div>
        ))}
      </section>
    </div>
  );
}
