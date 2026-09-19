import Link from "next/link";
import Image from "next/image";
import { listActiveCalculatorCategories } from "@/src/lib/calculators/catalog";
import styles from "./site.module.css";

export function SiteFooter() {
  const categories = listActiveCalculatorCategories();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Image
            src="/images/brand/project-buy-list-logo-mark.png"
            alt=""
            aria-hidden="true"
            className={styles.footerLogo}
            width={48}
            height={48}
          />
          <div>
            <p>Project Buy List</p>
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
      <div className={styles.footerBottom}>© {new Date().getFullYear()} Project Buy List. Estimates are for planning purposes.</div>
    </footer>
  );
}
