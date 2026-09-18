const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function normalizeUrl(value: string): string {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE = {
  name: "Home Project Calculators",
  shortName: "HPC",
  url: normalizeUrl(configuredUrl || "http://localhost:3000"),
  description: "Free, transparent calculators for home improvement materials, quantities, waste, and project costs.",
  locale: "en_US",
  githubIssuesUrl: "https://github.com/dajiang0910/home-project-calculators/issues",
} as const;
