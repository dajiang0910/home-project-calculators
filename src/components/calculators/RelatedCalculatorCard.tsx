import Link from "next/link";
import type { CalculatorContent } from "@/src/lib/calculators";
import { getCalculator } from "@/src/lib/calculators";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import styles from "./calculator.module.css";

export function RelatedCalculatorCard({ item }: { item: CalculatorContent["related"][number] }) {
  const available = !!getCalculator(item.slug);
  return <div className={styles.relatedCard}><Icon label={item.title} /><div><h3>{available ? <Link data-calculator-related={item.slug} href={`/calculators/${item.slug}`}>{item.title} <span aria-hidden="true">→</span></Link> : item.title}</h3><p>{item.description}</p>{available ? null : <Badge tone="comingSoon">Coming soon</Badge>}</div></div>;
}
