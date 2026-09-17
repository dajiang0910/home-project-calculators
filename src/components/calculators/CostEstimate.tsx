import type { ResultItem } from "@/src/lib/calculators";
import { ResultMetric } from "./ResultMetric";

export function CostEstimate({ item }: { item: ResultItem }) {
  return <ResultMetric item={{ ...item, emphasis: true }} />;
}
