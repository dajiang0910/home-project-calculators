import type { CalculatorContent } from "@/src/lib/calculators";
import { InfoCard } from "./InfoCard";
import styles from "./calculator.module.css";

export function FormulaCard({ content }: { content: CalculatorContent }) {
  return <InfoCard title="Formula" icon="FX"><dl className={styles.formulas}>{content.formulas.map((formula) => <div key={formula.label}><dt>{formula.label}</dt><dd>{formula.expression}</dd></div>)}</dl></InfoCard>;
}
