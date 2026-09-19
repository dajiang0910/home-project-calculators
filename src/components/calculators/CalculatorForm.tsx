import type { CalculatorField, CalculatorFieldGroup, CalculatorFormInput, ValidationErrors } from "@/src/lib/calculators";
import { PrimaryButton } from "../ui/PrimaryButton";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import styles from "./calculator.module.css";

type CalculatorFormProps = {
  slug: string;
  fields: readonly CalculatorField[];
  fieldGroups?: readonly CalculatorFieldGroup[];
  input: CalculatorFormInput;
  errors?: ValidationErrors;
  expandedGroups: Record<string, boolean>;
  onChange: (name: string, value: string) => void;
  onToggle: (groupId: string, open: boolean) => void;
  onAdvancedOpen: (groupId: string) => void;
  onSubmit: () => void;
};

export function CalculatorForm({ slug, fields, fieldGroups, input, errors, expandedGroups, onChange, onToggle, onAdvancedOpen, onSubmit }: CalculatorFormProps) {
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <div className={styles.formHeading}>
        <div><p className={styles.panelKicker}>Get your estimate</p><h2>Enter your project details</h2></div>
        <span className={styles.formHint}>Updates as you type</span>
      </div>
      <div className={styles.unitSettings}>{fields.filter((field) => !field.group).map((field) => <FormField key={field.name} slug={slug} field={field} input={input} errors={errors} onChange={onChange} />)}</div>
      {fieldGroups?.filter((group) => fields.some((field) => field.group === group.id)).map((group) => <FormSection key={group.id} slug={slug} group={group} fields={fields.filter((field) => field.group === group.id)} input={input} errors={errors} expanded={expandedGroups[group.id]} onToggle={(open) => onToggle(group.id, open)} onOpen={() => onAdvancedOpen(group.id)} onChange={onChange} />)}
      <PrimaryButton type="submit" className={styles.submitButton}>View results <span aria-hidden="true">→</span></PrimaryButton>
      <p className={styles.liveHint}>Your estimate updates automatically as you type.</p>
    </form>
  );
}
