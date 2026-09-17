import type { ResultItem } from "@/src/lib/calculators";
import { Icon } from "../ui/Icon";
import styles from "./calculator.module.css";

export function ResultMetric({ item }: { item: ResultItem }) {
  return <div className={item.emphasis ? styles.metricFeatured : styles.metric}><div className={styles.metricLabel}><Icon label={item.label} size="small" /><span>{item.label}</span></div><strong>{item.value}</strong>{item.detail ? <p>{item.detail}</p> : null}</div>;
}
