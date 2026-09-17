import styles from "./ui.module.css";

/** A compact visual marker whose accessible label is supplied by its parent. */
export function Icon({ label, size = "default" }: { label: string; size?: "default" | "small" }) {
  return <span aria-hidden="true" className={`${styles.icon} ${size === "small" ? styles.iconSmall : ""}`}>{label.slice(0, 2).toUpperCase()}</span>;
}
