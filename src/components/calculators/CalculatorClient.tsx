"use client";

import { useMemo, useState, type ReactNode } from "react";
import { getCalculator, type CalculatorField, type CalculatorFormInput } from "@/src/lib/calculators";
import { CalculatorShell } from "./CalculatorShell";
import styles from "./calculator.module.css";

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

  function renderField(field: CalculatorField) {
    const id = `${slug}-${field.name}`;
    const error = errors?.[field.name];
    const describedBy = [field.unit ? `${id}-unit` : "", field.description ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
    return (
      <div key={field.name} className={styles.field}>
        <label htmlFor={id}>{field.label}</label>
        <div className={styles.control}>
          {field.type === "select" ? (
            <select
              id={id} name={field.name} required={field.required}
              value={String(input[field.name] ?? "")}
              aria-invalid={!!error} aria-describedby={describedBy}
              onChange={(event) => changeField(field.name, event.target.value)}
            >
              {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          ) : (
            <input
              id={id} name={field.name} required={field.required}
              type={field.type === "number" ? "number" : "text"}
              inputMode={field.type === "number" ? field.step === 1 ? "numeric" : "decimal" : undefined}
              value={String(input[field.name] ?? "")} placeholder={field.placeholder}
              min={field.min} max={field.max} step={field.step}
              aria-invalid={!!error} aria-describedby={describedBy}
              onChange={(event) => changeField(field.name, event.target.value)}
            />
          )}
          {field.unit ? <span id={`${id}-unit`} className={styles.unit}>{field.unit}</span> : null}
        </div>
        {field.description ? <p id={`${id}-help`} className={styles.help}>{field.description}</p> : null}
        {error ? <p id={`${id}-error`} className={styles.fieldError}>{error}</p> : null}
      </div>
    );
  }

  return (
    <CalculatorShell
      metadata={calculator.metadata}
      intro={calculator.content?.intro}
      errors={errors}
      result={evaluation && "result" in evaluation ? evaluation.result : undefined}
      shoppingList={calculator.shoppingList}
      resultNote={calculator.resultNote}
      guide={children}
    >
      <form noValidate onSubmit={(event) => event.preventDefault()}>
        <div className={styles.unitSettings}>
          {fields.filter((field) => !field.group).map(renderField)}
        </div>
        {calculator.fieldGroups?.map((group) => {
          const groupFields = fields.filter((field) => field.group === group.id);
          const hasErrors = groupFields.some((field) => errors?.[field.name]);
          const body = <>
            {group.description ? <p className={styles.groupDescription}>{group.description}</p> : null}
            <div className={styles.fields}>{groupFields.map(renderField)}</div>
          </>;
          return group.collapsible ? (
            <details
              key={group.id}
              className={styles.advanced}
              open={expandedGroups[group.id] || hasErrors || false}
              onToggle={(event) => {
                const open = event.currentTarget.open;
                setExpandedGroups((current) => current[group.id] === open ? current : { ...current, [group.id]: open });
              }}
            >
              <summary>{group.title}</summary>
              {body}
            </details>
          ) : (
            <fieldset key={group.id} className={styles.fieldset}>
              <legend>{group.title}</legend>
              {body}
            </fieldset>
          );
        })}
        <p className={styles.liveHint}>Your estimate updates as you type.</p>
      </form>
    </CalculatorShell>
  );
}
