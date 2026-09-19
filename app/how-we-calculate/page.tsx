import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/src/components/content/ContentPage";
import styles from "@/src/components/content/content.module.css";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { createPageMetadata } from "@/src/lib/seo/metadata";
import { breadcrumbStructuredData } from "@/src/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "How We Calculate",
  description: "Learn how Project Buy List handles measurements, unit conversions, waste, package rounding, costs, and estimate limitations.",
  path: "/how-we-calculate",
});

export default function HowWeCalculatePage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "How We Calculate", path: "/how-we-calculate" }])} />
      <ContentPage eyebrow="Our methodology" title="How we calculate" intro="A useful home-project estimate should be understandable, adjustable, and honest about its limits. Here is the method shared by every calculator on the site.">
        <section><h2>Measurements first</h2><div><p>Each tool starts with the smallest set of measurements needed for its project: lengths, widths, heights, openings, product dimensions, or package coverage. The formula shown on each calculator explains how those inputs become area, volume, or linear length.</p><p>Measure the actual project whenever possible. Small errors can compound across multiple walls, repeated pieces, or several material packages.</p></div></section>
        <section><h2>US and metric units</h2><div><p>Switching unit systems converts the physical quantity rather than changing the project. Length, area, volume, coverage, and unit price use quantity-aware conversion factors. Counts, waste percentages, and total purchase intent stay equivalent.</p><div className={styles.note}><strong>Why values may look different</strong><p>Converted inputs are displayed at practical precision. The calculator keeps enough numeric precision to preserve purchase boundaries when you switch units repeatedly.</p></div></div></section>
        <section><h2>Waste allowances</h2><div><p>Waste is applied once, after the usable project quantity is calculated and before package rounding. It covers common offcuts, pattern alignment, handling loss, touch-ups, and minor measurement variation.</p><p>The default is a planning assumption, not a rule. Complex layouts, fragile materials, strong pattern matching, textured surfaces, or an inexperienced installation may need a larger allowance.</p></div></section>
        <section><h2>Package rounding</h2><div><p>Materials sold as full boxes, sheets, rolls, pieces, gallons, or liters are rounded up to a purchasable quantity. The result keeps calculated need and recommended purchase separate so you can see what the project consumes and what the store sells.</p><p>Boundary tests cover values exactly on, just below, and just above common package limits to prevent floating-point noise from adding an unnecessary package.</p></div></section>
        <section><h2>Openings and deductions</h2><div><p>Doors and windows are deducted only when the selected project and material make that deduction useful. Some installers intentionally avoid small deductions because offcuts and layout constraints consume similar material; each calculator states its chosen assumption.</p></div></section>
        <section><h2>Cost estimates</h2><div><p>Material cost uses the rounded purchase quantity and the price you enter. Unless the calculator says otherwise, estimates exclude tax, delivery, labor, tools, primer, fasteners, substrate repair, disposal, and local price changes.</p></div></section>
        <section><h2>Testing and review</h2><div><p>Calculator logic is kept in framework-independent TypeScript functions. Contract tests cover reference examples, direct metric input, unit switching, invalid values, and purchase rounding. Interface checks cover keyboard focus, validation messages, and narrow mobile layouts.</p></div></section>
        <section><h2>Where the estimate stops</h2><div><p>These tools support early planning and shopping. They do not replace product instructions, an on-site measurement, structural design, a contractor quote, or local building-code review. Confirm package sizes, coverage, installation requirements, and safety guidance before buying or building.</p><Link href="/calculators" className={styles.actionLink}>Browse calculators <span aria-hidden="true">→</span></Link></div></section>
      </ContentPage>
    </>
  );
}
