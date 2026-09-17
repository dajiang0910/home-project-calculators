import styles from "./ui.module.css";

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "live" | "comingSoon" }) {
  return <span className={`${styles.badge} ${tone === "live" ? styles.badgeLive : tone === "comingSoon" ? styles.badgeComingSoon : ""}`}>{children}</span>;
}
