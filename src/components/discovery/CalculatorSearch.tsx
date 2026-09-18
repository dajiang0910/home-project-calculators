"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CalculatorCatalogEntry } from "@/src/lib/calculators/catalog";
import styles from "./discovery.module.css";

export function CalculatorSearch({ calculators }: { calculators: readonly CalculatorCatalogEntry[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) return calculators.filter((calculator) => calculator.featured).slice(0, 4);
    return calculators.filter((calculator) => {
      const haystack = [
        calculator.metadata.title,
        calculator.summary,
        calculator.metadata.category,
        ...calculator.metadata.keywords,
      ].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    }).slice(0, 6);
  }, [calculators, normalizedQuery]);

  return (
    <form
      className={styles.search}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        if (results[0]) router.push(`/calculators/${results[0].slug}`);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className={styles.searchControl}>
        <span aria-hidden="true" className={styles.searchIcon} />
        <input
          type="search"
          role="combobox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search paint, flooring, drywall…"
          aria-label="Search calculators"
          aria-controls="calculator-search-results"
          aria-expanded={focused}
          aria-autocomplete="list"
        />
        <button type="submit" disabled={!results.length}>Find a calculator <span aria-hidden="true">→</span></button>
      </div>
      {focused ? (
        <div id="calculator-search-results" className={styles.searchResults} aria-live="polite">
          <p>{normalizedQuery ? `${results.length} matching ${results.length === 1 ? "tool" : "tools"}` : "Popular calculators"}</p>
          {results.length ? results.map((calculator) => (
            <Link key={calculator.slug} href={`/calculators/${calculator.slug}`}>
              <span className={styles.resultMarker}>{calculator.marker}</span>
              <span><strong>{calculator.metadata.title}</strong><small>{calculator.summary}</small></span>
              <span aria-hidden="true" className={styles.resultArrow}>→</span>
            </Link>
          )) : <div className={styles.emptyResult}>No calculator matches yet. Browse the full directory to see every available tool.</div>}
        </div>
      ) : null}
    </form>
  );
}
