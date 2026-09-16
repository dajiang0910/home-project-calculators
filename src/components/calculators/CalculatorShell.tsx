import type { CalculatorMetadata, ResultItem } from "@/src/lib/calculators";

type CalculatorShellProps = {
  metadata: CalculatorMetadata;
  children: React.ReactNode;
  result?: readonly ResultItem[];
  errors?: Readonly<Record<string, string>>;
};

export function CalculatorShell({
  metadata,
  children,
  result,
  errors,
}: CalculatorShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          {metadata.category}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {metadata.title}
        </h1>
        <p className="max-w-2xl text-zinc-600">{metadata.description}</p>
      </header>

      <section aria-label="Calculator inputs" className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {children}
      </section>

      {errors && Object.keys(errors).length > 0 ? (
        <aside role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <ul className="list-disc space-y-1 pl-5">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </aside>
      ) : null}

      {result && result.length > 0 ? (
        <section aria-label="Calculator results" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-semibold text-emerald-950">Your result</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {result.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-emerald-800">{item.label}</dt>
                <dd className="text-2xl font-semibold text-emerald-950">{item.value}</dd>
                {item.detail ? <p className="text-sm text-emerald-800">{item.detail}</p> : null}
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </main>
  );
}
