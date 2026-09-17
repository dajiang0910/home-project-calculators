import type { CalculatorContent } from "@/src/lib/calculators";
import { InfoCard } from "./InfoCard";
import styles from "./calculator.module.css";

export function FAQ({ content }: { content: CalculatorContent }) {
  return <InfoCard title="FAQ" icon="?" className={styles.faqCard}>{content.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</InfoCard>;
}
