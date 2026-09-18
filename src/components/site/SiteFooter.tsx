import Link from "next/link";
import { listActiveCalculatorCategories } from "@/src/lib/calculators/catalog";
import styles from "./site.module.css";

export function SiteFooter() {
  const categories = listActiveCalculatorCategories();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.footerMark} aria-hidden="true">HP</span>
          <div>
            <p>Home Project Calculators</p>
            <span>Measure with confidence. Buy with a plan.</span>
          </div>
        </div>
        <div className={styles.footerColumn}>
          <p>Plan a project</p>
          <Link href="/calculators">All calculators</Link>
          {categories.map((category) => <Link key={category.slug} href={`/calculators/categories/${category.slug}`}>{category.shortTitle}</Link>)}
        </div>
        <div className={styles.footerColumn}>
          <p>About the estimates</p>
          <Link href="/how-we-calculate">How we calculate</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className={styles.footerColumn}>
          <p>Site information</p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className={styles.footerBottom}>© {new Date().getFullYear()} Home Project Calculators. Estimates are for planning purposes.</div>
    </footer>
  );
}
