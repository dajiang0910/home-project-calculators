import type { ReactNode } from "react";
import { getCalculatorCategory } from "@/src/lib/calculators/catalog";
import type { CalculatorMetadata, ResultItem, ShoppingListItem, ValidationErrors } from "@/src/lib/calculators/types";
import { Breadcrumb } from "../site/Breadcrumb";
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
  const category = getCalculatorCategory(metadata.category);
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          ...(category ? [{ label: category.shortTitle, href: `/calculators/categories/${category.slug}` }] : []),
          { label: metadata.title },
        ]} />
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
    </main>
  );
}
