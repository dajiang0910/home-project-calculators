import Link from "next/link";
import { getCalculatorCategory, type CalculatorCatalogEntry } from "@/src/lib/calculators/catalog";
import styles from "./discovery.module.css";

export function CalculatorRow({ calculator, showCategory = false }: { calculator: CalculatorCatalogEntry; showCategory?: boolean }) {
  const category = getCalculatorCategory(calculator.metadata.category);
  return (
    <Link href={`/calculators/${calculator.slug}`} className={styles.calculatorRow}>
      <span className={styles.rowMarker} aria-hidden="true">{calculator.marker}</span>
      <span className={styles.rowCopy}>
        {showCategory ? <small>{category?.shortTitle}</small> : null}
        <strong>{calculator.metadata.title}</strong>
        <span>{calculator.summary}</span>
      </span>
      <span className={styles.rowArrow} aria-hidden="true">→</span>
    </Link>
  );
}
