import type { ReactNode } from "react";
import type { CalculatorHero as CalculatorHeroKind, CalculatorMetadata, ResultItem, ShoppingListItem, ValidationErrors } from "@/src/lib/calculators/types";
import { Breadcrumb } from "../site/Breadcrumb";
import { CalculatorHero } from "./CalculatorHero";
import { ResultCard } from "./ResultCard";
import { ShoppingList } from "./ShoppingList";
import styles from "./calculator.module.css";

type CalculatorShellProps = {
  metadata: CalculatorMetadata;
  hero: CalculatorHeroKind;
  image: string;
  category?: { shortTitle: string; slug: string };
  intro?: string;
  children: ReactNode;
  guide?: ReactNode;
  result?: readonly ResultItem[];
  errors?: ValidationErrors;
  shoppingList?: readonly ShoppingListItem[];
  resultNote?: string;
};

export function CalculatorShell({ metadata, hero, image, category, intro, children, guide, result, errors, shoppingList, resultNote }: CalculatorShellProps) {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          ...(category ? [{ label: category.shortTitle, href: `/calculators/categories/${category.slug}` }] : []),
          { label: metadata.title },
        ]} />
        <CalculatorHero metadata={metadata} intro={intro} hero={hero} image={image} />
        <div className={styles.workspace}>
          <section aria-label="Calculator inputs" className={styles.inputPanel}>{children}</section>
          <div className={styles.summaryColumn}>
            <ResultCard result={result} errors={errors} resultNote={resultNote} />
            {shoppingList?.length ? <ShoppingList items={shoppingList} /> : null}
          </div>
        </div>
        {guide}
      </div>
    </main>
  );
}
