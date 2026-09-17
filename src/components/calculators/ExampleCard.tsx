import type { CalculatorContent } from "@/src/lib/calculators";
import { InfoCard } from "./InfoCard";
import styles from "./calculator.module.css";

export function ExampleCard({ content }: { content: CalculatorContent }) {
  return <InfoCard title="Example Calculation" icon="EX" className={styles.exampleCard}><p>{content.example.description}</p><ol>{content.example.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className={styles.exampleConclusion}>{content.example.conclusion}</p></InfoCard>;
}
