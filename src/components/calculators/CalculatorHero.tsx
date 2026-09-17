import type { CalculatorMetadata } from "@/src/lib/calculators";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import { calculatorPresentation } from "./presentation";
import styles from "./calculator.module.css";

export function CalculatorHero({ slug, metadata, intro }: { slug: string; metadata: CalculatorMetadata; intro?: string }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.heroKicker}>Home improvement planning</p>
        <h1>{metadata.title}</h1>
        <p className={styles.heroIntro}>{intro ?? metadata.description}</p>
        <div className={styles.heroBenefits} aria-label="Calculator benefits">
          <span><Icon label="FT" size="small" />Fast &amp; easy</span>
          <span><Icon label="OK" size="small" />Accurate results</span>
          <span><Icon label="US" size="small" />US &amp; metric</span>
          <span><Icon label="$" size="small" />Free to use</span>
        </div>
      </div>
      <div aria-hidden="true" className={`${styles.heroVisual} ${calculatorPresentation[slug]?.hero === "flooring" ? styles.heroFlooring : styles.heroPaint}`}>
        <Image
          src={calculatorPresentation[slug]?.hero === "flooring" ? "/images/calculators/flooring-hero.png" : "/images/calculators/paint-hero.png"}
          alt=""
          fill
          sizes="(max-width: 639px) 0vw, 42vw"
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
