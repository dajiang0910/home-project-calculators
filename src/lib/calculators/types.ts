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
  min?: number;
  max?: number;
  step?: number | "any";
  group?: string;
};

export type CalculatorFieldGroup = {
  id: string;
  title: string;
  description?: string;
  collapsible?: boolean;
};

export type CalculatorFormInput = Readonly<Record<string, unknown>>;

export type ShoppingListItem = {
  name: string;
  detail: string;
};

export type ValidationErrors = Readonly<Record<string, string>>;

export type ValidationResult<TInput> =
  | { valid: true; value: TInput }
  | { valid: false; value?: TInput; errors: ValidationErrors };

export type ResultItem = {
  label: string;
  value: string;
  detail?: string;
  emphasis?: boolean;
};

export type CalculatorMetadata = {
  title: string;
  seoTitle?: string;
  description: string;
  category: CalculatorCategory;
  keywords: readonly string[];
};

export type CalculatorDefinition<TInput, TResult> = {
  slug: string;
  metadata: CalculatorMetadata;
  fields: readonly CalculatorField[];
  fieldGroups?: readonly CalculatorFieldGroup[];
  getFields?: (input: CalculatorFormInput) => readonly CalculatorField[];
  updateInput?: (input: CalculatorFormInput, name: string, value: string) => CalculatorFormInput;
  createInitialInput(): TInput;
  validate(input: unknown): ValidationResult<TInput>;
  calculate(input: TInput): TResult;
  formatResult(result: TResult): readonly ResultItem[];
  shoppingList?: readonly ShoppingListItem[];
  resultNote?: string;
  content?: CalculatorContent;
};

// The registry erases domain types; consumers must validate before calculate and
// pass the returned result only to that same definition's formatter.
export type AnyCalculatorDefinition = CalculatorDefinition<unknown, unknown>;

export type CalculatorContent = {
  intro: string;
  howItWorks: readonly { title: string; text: string }[];
  formulas: readonly { label: string; expression: string }[];
  example: { description: string; steps: readonly string[]; conclusion: string };
  faq: readonly { question: string; answer: string }[];
  related: readonly { slug: string; title: string; description: string }[];
};
