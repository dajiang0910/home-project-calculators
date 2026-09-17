import type { CalculatorMetadata } from "@/src/lib/calculators";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import { calculatorPresentation } from "./presentation";
import styles from "./calculator.module.css";

export function CalculatorHero({ slug, metadata, intro }: { slug: string; metadata: CalculatorMetadata; intro?: string }) {
  const hero = calculatorPresentation[slug]?.hero ?? "paint";
  const image = {
    paint: "/images/calculators/paint-hero.png",
    flooring: "/images/calculators/flooring-hero.png",
    tile: "/images/calculators/tile-hero.png",
    drywall: "/images/calculators/drywall-hero.png",
    wallpaper: "/images/calculators/wallpaper-hero.png",
  }[hero];
  const heroClass = {
    paint: styles.heroPaint,
    flooring: styles.heroFlooring,
    tile: styles.heroTile,
    drywall: styles.heroDrywall,
    wallpaper: styles.heroWallpaper,
  }[hero];
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
      <div aria-hidden="true" className={`${styles.heroVisual} ${heroClass}`}>
        <Image
          src={image}
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
