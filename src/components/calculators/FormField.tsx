import type { CalculatorField, CalculatorFormInput, ValidationErrors } from "@/src/lib/calculators";
import { UnitToggle } from "../ui/UnitToggle";
import styles from "./calculator.module.css";

type FormFieldProps = {
  slug: string;
  field: CalculatorField;
  input: CalculatorFormInput;
  errors?: ValidationErrors;
  onChange: (name: string, value: string) => void;
};

export function FormField({ slug, field, input, errors, onChange }: FormFieldProps) {
  const id = `${slug}-${field.name}`;
  const error = errors?.[field.name];
  const describedBy = [field.unit ? `${id}-unit` : "", field.description ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const isUnitToggle = field.name === "unitSystem" && field.options?.length;
  return (
    <div className={`${styles.field} ${isUnitToggle ? styles.unitField : ""}`}>
      {isUnitToggle ? <span className={styles.fieldLabel}>{field.label}</span> : <label htmlFor={id}>{field.label}</label>}
      {isUnitToggle ? (
        <UnitToggle name={field.name} value={String(input[field.name] ?? "")} options={field.options ?? []} onChange={(value) => onChange(field.name, value)} />
      ) : (
        <div className={styles.control}>
          {field.type === "select" ? (
            <select id={id} name={field.name} required={field.required} value={String(input[field.name] ?? "")} aria-invalid={!!error} aria-describedby={describedBy} onChange={(event) => onChange(field.name, event.target.value)}>
              {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          ) : (
            <input id={id} name={field.name} required={field.required} type={field.type === "number" ? "number" : "text"} inputMode={field.type === "number" ? "decimal" : undefined} value={String(input[field.name] ?? "")} placeholder={field.placeholder} min={field.min} max={field.max} step={field.step} aria-invalid={!!error} aria-describedby={describedBy} onChange={(event) => onChange(field.name, event.target.value)} />
          )}
          {field.unit ? <span id={`${id}-unit`} className={styles.unit}>{field.unit}</span> : null}
        </div>
      )}
      {field.description ? <p id={`${id}-help`} className={styles.help}>{field.description}</p> : null}
      {error ? <p id={`${id}-error`} className={styles.fieldError}>{error}</p> : null}
    </div>
  );
}
