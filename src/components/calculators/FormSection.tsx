import type { CalculatorField, CalculatorFieldGroup, CalculatorFormInput, ValidationErrors } from "@/src/lib/calculators";
import { FormField } from "./FormField";
import styles from "./calculator.module.css";

type FormSectionProps = {
  slug: string;
  group: CalculatorFieldGroup;
  fields: readonly CalculatorField[];
  input: CalculatorFormInput;
  errors?: ValidationErrors;
  expanded?: boolean;
  onToggle?: (open: boolean) => void;
  onChange: (name: string, value: string) => void;
};

export function FormSection({ slug, group, fields, input, errors, expanded, onToggle, onChange }: FormSectionProps) {
  const body = <>
    {group.description ? <p className={styles.groupDescription}>{group.description}</p> : null}
    <div className={styles.fields}>{fields.map((field) => <FormField key={field.name} slug={slug} field={field} input={input} errors={errors} onChange={onChange} />)}</div>
  </>;
  const hasErrors = fields.some((field) => errors?.[field.name]);
  if (group.collapsible) {
    return <details className={styles.advanced} open={expanded || hasErrors || false} onToggle={(event) => onToggle?.(event.currentTarget.open)}><summary>{group.title}</summary>{body}</details>;
  }
  return <fieldset className={styles.fieldset}><legend>{group.title}</legend>{body}</fieldset>;
}
