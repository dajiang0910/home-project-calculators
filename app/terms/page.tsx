import type { Metadata } from "next";
import { ContentPage } from "@/src/components/content/ContentPage";
import { createPageMetadata } from "@/src/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Terms of Use", description: "Terms for using Project Buy List and its planning estimates.", path: "/terms" });

export default function TermsPage() {
  return <ContentPage eyebrow="Site information" title="Terms of use" intro="Use these calculators as planning aids and verify the details that depend on your property, products, supplier, and local requirements.">
    <section><h2>Planning estimates</h2><div><p>Calculator results are estimates based on the measurements, assumptions, and prices entered. They are not bids, guarantees, engineering documents, or instructions for a specific product or site.</p></div></section>
    <section><h2>Your responsibility</h2><div><p>Verify measurements, product coverage, package sizes, waste needs, installation instructions, site conditions, and local building requirements before purchasing materials or starting work. Consult a qualified professional where structural, electrical, plumbing, safety, permit, or code questions apply.</p></div></section>
    <section><h2>Availability and accuracy</h2><div><p>We work to keep formulas and examples clear and tested, but the site may contain errors or become temporarily unavailable. Features, formulas, and content may change as the tools improve.</p></div></section>
    <section><h2>Acceptable use</h2><div><p>You may use the site for personal or professional project planning. Do not interfere with the service, attempt unauthorized access, or use automated traffic in a way that degrades access for others.</p></div></section>
    <section><h2>Updates</h2><div><p>Continued use after published changes means the updated terms apply. These terms were last updated on September 18, 2026.</p></div></section>
  </ContentPage>;
}
