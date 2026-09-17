import styles from "./ui.module.css";

type UnitOption = { value: string; label: string };

export function UnitToggle({ name, value, options, onChange }: { name: string; value: string; options: readonly UnitOption[]; onChange: (value: string) => void }) {
  return (
    <div className={styles.unitToggle} role="radiogroup" aria-label="Unit system">
      {options.map((option) => (
        <label key={option.value} className={styles.unitOption}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
