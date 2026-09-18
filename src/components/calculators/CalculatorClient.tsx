"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { loadCalculatorEngine } from "@/src/lib/calculators/runtime";
import type { CalculatorEngine, CalculatorFormInput, CalculatorHero, CalculatorMetadata } from "@/src/lib/calculators/types";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorShell } from "./CalculatorShell";

type CalculatorClientProps = {
  slug: string;
  metadata: CalculatorMetadata;
  hero: CalculatorHero;
  image: string;
  category?: { shortTitle: string; slug: string };
  intro?: string;
  children?: ReactNode;
};

export function CalculatorClient({ slug, metadata, hero, image, category, intro, children }: CalculatorClientProps) {
  const [loaded, setLoaded] = useState<{ slug: string; engine?: CalculatorEngine<unknown, unknown>; error?: string }>({ slug: "" });
  const [input, setInput] = useState<CalculatorFormInput>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    const load = loadCalculatorEngine(slug);
    if (!load) {
      return () => { active = false; };
    }
    void load.then((engine) => {
      if (!active) return;
      setLoaded({ slug, engine });
      setInput(engine.createInitialInput() as CalculatorFormInput);
      setExpandedGroups({});
    }).catch(() => {
      if (active) setLoaded({ slug, error: "We could not load this calculator. Please try again." });
    });
    return () => { active = false; };
  }, [slug]);

  const calculator = loaded.slug === slug ? loaded.engine : undefined;
  const loadError = loaded.slug === slug ? loaded.error : undefined;

  const evaluation = useMemo(() => {
    if (!calculator) return undefined;
    const validation = calculator.validate(input);
    if (!validation.valid) return { errors: validation.errors };
    return { result: calculator.formatResult(calculator.calculate(validation.value)) };
  }, [calculator, input]);

  function changeField(name: string, value: string) {
    setInput((current) => calculator?.updateInput
      ? calculator.updateInput(current, name, value)
      : { ...current, [name]: value });
  }

  function focusFirstError() {
    const errors = evaluation && "errors" in evaluation ? evaluation.errors : undefined;
    const firstField = errors ? Object.keys(errors).find((name) => name !== "form") : undefined;
    if (firstField) document.getElementById(`${slug}-${firstField}`)?.focus();
    else document.getElementById("calculator-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const fields = calculator?.getFields?.(input) ?? calculator?.fields ?? [];
  const errors = evaluation && "errors" in evaluation ? evaluation.errors : undefined;
  const loadingPanel = loadError ? (
    <div role="alert">
      <p>{loadError}</p>
      <button type="button" onClick={() => window.location.reload()}>Reload calculator</button>
    </div>
  ) : (
    <p role="status" aria-live="polite">Loading calculator…</p>
  );

  return (
    <CalculatorShell
      metadata={metadata}
      hero={hero}
      image={image}
      category={category}
      intro={intro}
      errors={errors}
      result={evaluation && "result" in evaluation ? evaluation.result : undefined}
      shoppingList={calculator?.shoppingList}
      resultNote={calculator?.resultNote}
      guide={children}
    >
      {calculator ? (
        <CalculatorForm
          slug={slug}
          fields={fields}
          fieldGroups={calculator.fieldGroups}
          input={input}
          errors={errors}
          expandedGroups={expandedGroups}
          onChange={changeField}
          onToggle={(groupId, open) => setExpandedGroups((current) => current[groupId] === open ? current : { ...current, [groupId]: open })}
          onSubmit={focusFirstError}
        />
      ) : loadingPanel}
    </CalculatorShell>
  );
}
