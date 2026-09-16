"use client";

import { useMemo, useState } from "react";
import { getCalculator } from "@/src/lib/calculators";
import { CalculatorShell } from "./CalculatorShell";

type CalculatorClientProps = {
  slug: string;
};

export function CalculatorClient({ slug }: CalculatorClientProps) {
  const calculator = getCalculator(slug);
  const [input, setInput] = useState<Record<string, unknown>>(() =>
    calculator ? (calculator.createInitialInput() as Record<string, unknown>) : {},
  );
  const [submitted, setSubmitted] = useState(false);

  const evaluation = useMemo(() => {
    if (!calculator || !submitted) return undefined;
    const validation = calculator.validate(input);
    if (!validation.valid) return { errors: validation.errors };
    return { result: calculator.formatResult(calculator.calculate(validation.value)) };
  }, [calculator, input, submitted]);

  if (!calculator) return null;

  return (
    <CalculatorShell metadata={calculator.metadata} errors={evaluation && "errors" in evaluation ? evaluation.errors : undefined} result={evaluation && "result" in evaluation ? evaluation.result : undefined}>
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        {calculator.fields.map((field) => (
          <label key={field.name} className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">{field.label}</span>
            <span className="flex items-center gap-2">
              {field.type === "select" ? (
                <select
                  required={field.required}
                  name={field.name}
                  value={String(input[field.name] ?? "")}
                  onChange={(event) =>
                    setInput((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-950 outline-none ring-offset-2 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required={field.required}
                  type={field.type === "number" ? "number" : "text"}
                  name={field.name}
                  value={String(input[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    setInput((current) => ({
                      ...current,
                      [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value,
                    }))
                  }
                  className="min-h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-950 outline-none ring-offset-2 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
                />
              )}
              {field.unit ? <span className="text-sm text-zinc-500">{field.unit}</span> : null}
            </span>
            {field.description ? <span className="block text-sm text-zinc-500">{field.description}</span> : null}
          </label>
        ))}
        <button type="submit" className="min-h-11 rounded-lg bg-zinc-950 px-5 font-medium text-white transition hover:bg-zinc-700">
          Calculate
        </button>
      </form>
    </CalculatorShell>
  );
}
