import type { ReactNode } from "react";
import type { CalculatorMetadata, ResultItem, ShoppingListItem } from "@/src/lib/calculators";
import styles from "./calculator.module.css";

type CalculatorShellProps = {
  metadata: CalculatorMetadata;
  intro?: string;
  children: ReactNode;
  guide?: ReactNode;
  result?: readonly ResultItem[];
  errors?: Readonly<Record<string, string>>;
  shoppingList?: readonly ShoppingListItem[];
  resultNote?: string;
};

export function CalculatorShell({ metadata, intro, children, guide, result, errors, shoppingList, resultNote }: CalculatorShellProps) {
  const invalid = errors && Object.keys(errors).length > 0;
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Home project calculators <span aria-hidden="true">/</span> {metadata.category}</p>
          <h1>{metadata.title}</h1>
          <p className={styles.intro}>{intro ?? metadata.description}</p>
          <a className={styles.jumpLink} href="#calculator-results">View your estimate <span aria-hidden="true">↗</span></a>
        </header>

        <div className={styles.workspace}>
          <section aria-label="Calculator inputs" className={styles.inputPanel}>
            {children}
          </section>

          <div className={styles.summaryColumn}>
            <section id="calculator-results" aria-label="Calculator results" className={styles.resultPanel}>
              <div className={styles.resultHeading}>
                <h2>Your estimate</h2>
                <span className={styles.liveBadge}>Live estimate</span>
              </div>
              <div aria-live="polite" aria-atomic="true">
                {invalid ? (
                  <div className={styles.errorSummary}>
                    <p>Let’s check those measurements.</p>
                    <p>Correct the highlighted inputs to see your updated estimate.</p>
                    <ul>{Object.entries(errors).map(([field, message]) => <li key={field}>{message}</li>)}</ul>
                  </div>
                ) : result?.length ? (
                  <dl className={styles.results}>
                    {result.map((item) => (
                      <div key={item.label} className={item.emphasis ? styles.featuredResult : styles.resultRow}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                        {item.detail ? <dd className={styles.resultDetail}>{item.detail}</dd> : null}
                      </div>
                    ))}
                  </dl>
                ) : <p>Enter your measurements to see an estimate.</p>}
              </div>
              {resultNote ? <p className={styles.resultNote}>{resultNote}</p> : null}
            </section>

            {shoppingList?.length ? (
              <section aria-labelledby="shopping-list-title" className={styles.shoppingPanel}>
                <p className={styles.eyebrow}>Before you start</p>
                <h2 id="shopping-list-title">Shopping List</h2>
                <ul>{shoppingList.map((item) => (
                  <li key={item.name}>
                    <span aria-hidden="true" className={styles.listMarker}>✓</span>
                    <div><h3>{item.name}</h3><p>{item.detail}</p></div>
                  </li>
                ))}</ul>
              </section>
            ) : null}
          </div>
        </div>
        {guide}
        <footer className={styles.footer}>Measure with confidence. Make room for your next project.</footer>
      </div>
    </main>
  );
}
