import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/src/components/content/ContentPage";
import styles from "@/src/components/content/content.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <ContentPage eyebrow="Project Buy List" title="Page not found" intro="The page you requested does not exist. Return to the calculator directory to find a planning tool.">
    <Link href="/calculators" className={styles.actionLink}>Browse calculators <span aria-hidden="true">→</span></Link>
  </ContentPage>;
}
