import type { ReactNode } from "react";
import type { CalculatorMetadata, ResultItem, ShoppingListItem, ValidationErrors } from "@/src/lib/calculators";
import { Breadcrumb } from "../site/Breadcrumb";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { CalculatorHero } from "./CalculatorHero";
import { ResultCard } from "./ResultCard";
import { ShoppingList } from "./ShoppingList";
import styles from "./calculator.module.css";

type CalculatorShellProps = {
  slug: string;
  metadata: CalculatorMetadata;
  intro?: string;
  children: ReactNode;
  guide?: ReactNode;
  result?: readonly ResultItem[];
  errors?: ValidationErrors;
  shoppingList?: readonly ShoppingListItem[];
  resultNote?: string;
};

export function CalculatorShell({ slug, metadata, intro, children, guide, result, errors, shoppingList, resultNote }: CalculatorShellProps) {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <div className={styles.container}>
        <Breadcrumb title={metadata.title} />
        <CalculatorHero slug={slug} metadata={metadata} intro={intro} />
        <div className={styles.workspace}>
          <section aria-label="Calculator inputs" className={styles.inputPanel}>{children}</section>
          <div className={styles.summaryColumn}>
            <ResultCard result={result} errors={errors} resultNote={resultNote} />
            {shoppingList?.length ? <ShoppingList items={shoppingList} /> : null}
          </div>
        </div>
        {guide}
      </div>
      <SiteFooter />
    </main>
  );
}
