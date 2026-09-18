import Image from "next/image";
import Link from "next/link";
import { getCalculatorCategory, type CalculatorCatalogEntry } from "@/src/lib/calculators/catalog";
import styles from "./discovery.module.css";

export function CalculatorCard({ calculator }: { calculator: CalculatorCatalogEntry }) {
  const category = getCalculatorCategory(calculator.metadata.category);
  return (
    <Link href={`/calculators/${calculator.slug}`} className={styles.calculatorCard}>
      <span className={styles.cardImage}>
        <Image src={calculator.image} alt="" fill sizes="(max-width: 639px) 92vw, (max-width: 1023px) 44vw, 280px" />
        <span className={styles.cardMarker} aria-hidden="true">{calculator.marker}</span>
      </span>
      <span className={styles.cardCopy}>
        <small>{category?.shortTitle}</small>
        <strong>{calculator.metadata.title}</strong>
        <span>{calculator.summary}</span>
        <span className={styles.cardAction}>Open calculator <span aria-hidden="true">→</span></span>
      </span>
    </Link>
  );
}
