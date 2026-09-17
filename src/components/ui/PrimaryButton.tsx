import type { ButtonHTMLAttributes } from "react";
import styles from "./ui.module.css";

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`${styles.primaryButton} ${props.className ?? ""}`} />;
}
