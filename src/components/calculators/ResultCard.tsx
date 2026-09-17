import type { ResultItem, ValidationErrors } from "@/src/lib/calculators";
import { Badge } from "../ui/Badge";
import { CostEstimate } from "./CostEstimate";
import { isCostResult } from "./presentation";
import { ResultMetric } from "./ResultMetric";
import styles from "./calculator.module.css";

export function ResultCard({ result, errors, resultNote }: { result?: readonly ResultItem[]; errors?: ValidationErrors; resultNote?: string }) {
  const invalid = errors && Object.keys(errors).length > 0;
  return (
    <section id="calculator-results" aria-label="Calculator results" className={styles.resultPanel}>
      <div className={styles.resultHeading}><div><p className={styles.panelKicker}>Your project summary</p><h2>Results</h2></div><Badge tone="live">Live estimate</Badge></div>
      <div aria-live="polite" aria-atomic="true">
        {invalid ? <div className={styles.errorSummary}><p>Let’s check those measurements.</p><p>Correct the highlighted inputs to see your updated estimate.</p><ul>{Object.entries(errors).map(([field, message]) => <li key={field}>{message}</li>)}</ul></div> : result?.length ? <div className={styles.metrics}>{result.map((item) => isCostResult(item.label) ? <CostEstimate key={item.label} item={item} /> : <ResultMetric key={item.label} item={item} />)}</div> : <p>Enter your measurements to see an estimate.</p>}
      </div>
      {resultNote ? <p className={styles.resultNote}>{resultNote}</p> : null}
    </section>
  );
}
