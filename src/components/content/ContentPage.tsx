import type { ReactNode } from "react";
import { Breadcrumb } from "../site/Breadcrumb";
import styles from "./content.module.css";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function ContentPage({ eyebrow, title, intro, children }: ContentPageProps) {
  return (
    <main id="main-content" className={styles.page}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
      <article>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        <div className={styles.body}>{children}</div>
      </article>
    </main>
  );
}
