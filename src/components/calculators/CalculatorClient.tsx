"use client";

import { useMemo, useState, type ReactNode } from "react";
import { getCalculator, type CalculatorFormInput } from "@/src/lib/calculators";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorShell } from "./CalculatorShell";

type CalculatorClientProps = {
  slug: string;
  children?: ReactNode;
};

export function CalculatorClient({ slug, children }: CalculatorClientProps) {
  const calculator = getCalculator(slug);
  const [input, setInput] = useState<CalculatorFormInput>(() =>
    calculator ? calculator.createInitialInput() as CalculatorFormInput : {},
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const evaluation = useMemo(() => {
    if (!calculator) return undefined;
    const validation = calculator.validate(input);
    if (!validation.valid) return { errors: validation.errors };
    return { result: calculator.formatResult(calculator.calculate(validation.value)) };
  }, [calculator, input]);

  if (!calculator) return null;
  const fields = calculator.getFields?.(input) ?? calculator.fields;
  const errors = evaluation && "errors" in evaluation ? evaluation.errors : undefined;

  function changeField(name: string, value: string) {
    setInput((current) => calculator?.updateInput
      ? calculator.updateInput(current, name, value)
      : { ...current, [name]: value });
  }

  function focusFirstError() {
    const firstField = errors ? Object.keys(errors).find((name) => name !== "form") : undefined;
    if (firstField) document.getElementById(`${slug}-${firstField}`)?.focus();
    else document.getElementById("calculator-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <CalculatorShell
      slug={slug}
      metadata={calculator.metadata}
      intro={calculator.content?.intro}
      errors={errors}
      result={evaluation && "result" in evaluation ? evaluation.result : undefined}
      shoppingList={calculator.shoppingList}
      resultNote={calculator.resultNote}
      guide={children}
    >
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
    </CalculatorShell>
  );
}
