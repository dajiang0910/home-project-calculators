import Link from "next/link";
import { listCalculators } from "@/src/lib/calculators";
import styles from "./site.module.css";

export function SiteHeader() {
  const calculators = listCalculators();
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand} aria-label="Home Project Calculators home">
          <span aria-hidden="true" className={styles.brandMark}>HP</span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Home Project Calculators</span>
            <span className={styles.tagline}>Plan better. Build smarter.</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <details>
            <summary>Calculators</summary>
            <div className={styles.menu}>
              {calculators.map((calculator) => <Link key={calculator.slug} href={`/calculators/${calculator.slug}`}>{calculator.metadata.title}</Link>)}
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
