export type CalculatorCategory =
  | "painting"
  | "flooring"
  | "roofing"
  | "landscaping"
  | "general";

export type CalculatorFieldType = "number" | "select" | "text";

export type CalculatorFieldOption = {
  value: string;
  label: string;
};

export type CalculatorField = {
  name: string;
  label: string;
  description?: string;
  type: CalculatorFieldType;
  unit?: string;
  placeholder?: string;
  options?: readonly CalculatorFieldOption[];
  required?: boolean;
};

export type ValidationErrors = Readonly<Record<string, string>>;

export type ValidationResult<TInput> =
  | { valid: true; value: TInput }
  | { valid: false; value?: TInput; errors: ValidationErrors };

export type ResultItem = {
  label: string;
  value: string;
  detail?: string;
};

export type CalculatorMetadata = {
  title: string;
  description: string;
  category: CalculatorCategory;
  keywords: readonly string[];
};

export type CalculatorDefinition<TInput, TResult> = {
  slug: string;
  metadata: CalculatorMetadata;
  fields: readonly CalculatorField[];
  createInitialInput: () => TInput;
  validate: (input: TInput) => ValidationResult<TInput>;
  calculate: (input: TInput) => TResult;
  formatResult: (result: TResult) => readonly ResultItem[];
};

export type AnyCalculatorDefinition = CalculatorDefinition<unknown, unknown>;
