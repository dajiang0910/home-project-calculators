import type { Metadata } from "next";
import { ContentPage } from "@/src/components/content/ContentPage";
import { createPageMetadata } from "@/src/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Privacy Policy", description: "Privacy information for Home Project Calculators.", path: "/privacy" });

export default function PrivacyPage() {
  return <ContentPage eyebrow="Site information" title="Privacy policy" intro="This page explains what information the site uses today and how future changes will be communicated.">
    <section><h2>Calculator inputs</h2><div><p>Calculator measurements and prices are processed in your browser to produce the displayed estimate. The site does not require an account, and calculator inputs are not submitted to us by the calculator interface.</p></div></section>
    <section><h2>Technical information</h2><div><p>Our hosting provider may process standard request information such as IP address, browser type, requested page, timestamps, and diagnostic logs to deliver and protect the site. Retention and handling depend on the hosting provider’s infrastructure and settings.</p></div></section>
    <section><h2>Analytics and advertising</h2><div><p>The current application does not configure analytics, advertising, or behavioral tracking. If those services are added, this policy will be updated to identify the service, purpose, and available choices before the change is treated as part of the published site.</p></div></section>
    <section><h2>External links</h2><div><p>The site may link to third-party websites. Their privacy practices and content are controlled by those third parties.</p></div></section>
    <section><h2>Policy changes</h2><div><p>Material changes will be reflected on this page. This policy was last updated on September 18, 2026.</p></div></section>
  </ContentPage>;
}
