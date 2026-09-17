import type { ReactNode } from "react";
import { Icon } from "../ui/Icon";
import styles from "./calculator.module.css";

export function InfoCard({ title, icon, children, className = "", level = "h2" }: { title: string; icon: string; children: ReactNode; className?: string; level?: "h2" | "h3" }) {
  const Heading = level;
  return <section className={`${styles.infoCard} ${className}`}><div className={styles.cardHeading}><Icon label={icon} /><Heading>{title}</Heading></div>{children}</section>;
}
