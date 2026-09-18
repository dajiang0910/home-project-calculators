import Link from "next/link";
import styles from "./site.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ title, items }: { title?: string; items?: readonly BreadcrumbItem[] }) {
  const breadcrumbs = items ?? [{ label: "Home", href: "/" }, { label: title ?? "Current page" }];
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      {breadcrumbs.map((item, index) => (
        <span key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
          {index ? <span aria-hidden="true" className={styles.separator}>›</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
