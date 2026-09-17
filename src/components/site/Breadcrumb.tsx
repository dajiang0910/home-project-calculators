import Link from "next/link";
import styles from "./site.module.css";

export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <Link href="/">Home</Link><span aria-hidden="true" className={styles.separator}>›</span><span aria-current="page">{title}</span>
    </nav>
  );
}
