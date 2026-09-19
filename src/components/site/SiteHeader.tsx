import Link from "next/link";
import Image from "next/image";
import { calculatorCatalog } from "@/src/lib/calculators/catalog";
import styles from "./site.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand} aria-label="Project Buy List home">
          <Image
            src="/images/brand/project-buy-list-logo-mark.png"
            alt=""
            aria-hidden="true"
            className={styles.brandLogo}
            width={36}
            height={36}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Project Buy List</span>
            <span className={styles.tagline}>Plan better. Build smarter.</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <details>
            <summary>Calculators</summary>
            <div className={styles.menu}>
              <Link href="/calculators" className={styles.menuAll}>Browse all calculators <span aria-hidden="true">→</span></Link>
              {calculatorCatalog.map((calculator) => <Link key={calculator.slug} href={`/calculators/${calculator.slug}`}>{calculator.metadata.title}</Link>)}
            </div>
          </details>
          <Link href="/how-we-calculate" className={styles.methodologyLink}>How we calculate</Link>
        </nav>
      </div>
    </header>
  );
}
