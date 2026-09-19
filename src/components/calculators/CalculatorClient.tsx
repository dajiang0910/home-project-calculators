"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadCalculatorEngine } from "@/src/lib/calculators/runtime";
import type { CalculatorEngine, CalculatorFormInput, CalculatorHero, CalculatorMetadata } from "@/src/lib/calculators/types";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorShell } from "./CalculatorShell";
import { emitCalculatorEvent } from "@/src/lib/analytics/events";

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
  const started = useRef(false);
  const completed = useRef(false);
  const userEdited = useRef(false);

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
      started.current = false;
      completed.current = false;
      userEdited.current = false;
      emitCalculatorEvent("calculator_view", { slug });
    }).catch(() => {
      if (active) setLoaded({ slug, error: "We could not load this calculator. Please try again." });
    });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    function handleRelatedClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-calculator-related]") : null;
      const targetSlug = target?.dataset.calculatorRelated;
      if (targetSlug) emitCalculatorEvent("related_tool_click", { slug, targetSlug });
    }
    document.addEventListener("click", handleRelatedClick);
    return () => document.removeEventListener("click", handleRelatedClick);
  }, [slug]);

  const calculator = loaded.slug === slug ? loaded.engine : undefined;
  const loadError = loaded.slug === slug ? loaded.error : undefined;

  const evaluation = useMemo(() => {
    if (!calculator) return undefined;
    const validation = calculator.validate(input);
    if (!validation.valid) return { errors: validation.errors };
    return { result: calculator.formatResult(calculator.calculate(validation.value)) };
  }, [calculator, input]);

  useEffect(() => {
    if (!calculator || !userEdited.current || completed.current || !evaluation || !("result" in evaluation)) return;
    completed.current = true;
    emitCalculatorEvent("calculator_complete", { slug, unitSystem: typeof input.unitSystem === "string" && (input.unitSystem === "imperial" || input.unitSystem === "metric") ? input.unitSystem : undefined });
  }, [calculator, evaluation, input.unitSystem, slug]);

  function changeField(name: string, value: string) {
    if (name === "unitSystem") {
      if (value !== input.unitSystem && (value === "imperial" || value === "metric")) {
        emitCalculatorEvent("unit_change", { slug, unitSystem: value });
      }
    } else if (!started.current) {
      started.current = true;
      userEdited.current = true;
      emitCalculatorEvent("calculator_start", { slug, field: name });
    } else {
      userEdited.current = true;
      emitCalculatorEvent("assumption_change", { slug, field: name });
    }
    setInput((current) => calculator?.updateInput
      ? calculator.updateInput(current, name, value)
      : { ...current, [name]: value });
  }

  function focusFirstError() {
    const errors = evaluation && "errors" in evaluation ? evaluation.errors : undefined;
    const firstField = errors ? Object.keys(errors).find((name) => name !== "form") : undefined;
    if (errors) emitCalculatorEvent("validation_error", { slug, field: firstField });
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
          onAdvancedOpen={(groupId) => emitCalculatorEvent("advanced_options_open", { slug, group: groupId })}
          onSubmit={focusFirstError}
        />
      ) : loadingPanel}
    </CalculatorShell>
  );
}
