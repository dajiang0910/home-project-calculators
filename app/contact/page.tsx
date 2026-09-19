import type { Metadata } from "next";
import { ContentPage } from "@/src/components/content/ContentPage";
import styles from "@/src/components/content/content.module.css";
import { SITE } from "@/src/lib/seo/site";
import { createPageMetadata } from "@/src/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Contact", description: "Report calculator issues or suggest improvements to Project Buy List.", path: "/contact" });

export default function ContactPage() {
  return <ContentPage eyebrow="Questions and feedback" title="Contact" intro="Found a confusing assumption, a calculation edge case, or a project tool that should exist? Useful feedback makes the whole catalog better.">
    <section><h2>Report a calculator issue</h2><div><p>Include the calculator name, unit system, inputs, result you received, and what you expected. Please avoid sharing personal or property-identifying information.</p><a className={styles.actionLink} href={SITE.githubIssuesUrl} target="_blank" rel="noreferrer">Open a GitHub issue <span aria-hidden="true">↗</span></a></div></section>
    <section><h2>Suggest a calculator</h2><div><p>Describe the project decision, required measurements, material package size, and the result a useful tool should produce. Specific, independently useful calculators are prioritized over near-duplicate keyword pages.</p></div></section>
    <section><h2>Before requesting project advice</h2><div><p>We can improve the calculator and its explanation, but this site does not provide contractor quotes, structural advice, code interpretation, or product-specific installation approval.</p></div></section>
  </ContentPage>;
}
