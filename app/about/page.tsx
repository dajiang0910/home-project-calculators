import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/src/components/content/ContentPage";
import styles from "@/src/components/content/content.module.css";
import { createPageMetadata } from "@/src/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Home Project Calculators helps homeowners and DIY planners estimate material quantities, waste, packages, and costs with transparent formulas.",
  path: "/about",
});

export default function AboutPage() {
  return <ContentPage eyebrow="Built for practical planning" title="About Home Project Calculators" intro="We build focused tools that turn room measurements and product details into purchase-ready material estimates.">
    <section><h2>Why this site exists</h2><div><p>Home projects often start with a simple question: how much material should I buy? The arithmetic may be straightforward, but openings, waste, product coverage, package sizes, and unit conversions make the final purchase less obvious.</p><p>Home Project Calculators keeps those steps together and explains them in plain English.</p></div></section>
    <section><h2>What we value</h2><div className={styles.principles}>
      <div className={styles.principle}><span>01</span><div><strong>Clarity over mystery</strong><p>Show the formula, intermediate values, assumptions, and limits.</p></div></div>
      <div className={styles.principle}><span>02</span><div><strong>Purchases over abstract totals</strong><p>Translate calculated need into full containers, pieces, sheets, rolls, or boxes.</p></div></div>
      <div className={styles.principle}><span>03</span><div><strong>Depth over page count</strong><p>Publish a calculator after its specification and contract tests are ready.</p></div></div>
      <div className={styles.principle}><span>04</span><div><strong>Planning over false precision</strong><p>Use estimates to prepare, then verify local products and site conditions.</p></div></div>
    </div></section>
    <section><h2>How the collection grows</h2><div><p>Calculators are organized by project area so related tools form a useful planning path. New categories become public only when they contain a tested calculator.</p><Link href="/how-we-calculate" className={styles.actionLink}>Read our methodology <span aria-hidden="true">→</span></Link></div></section>
  </ContentPage>;
}
