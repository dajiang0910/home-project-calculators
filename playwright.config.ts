import { defineConfig, devices } from "@playwright/test";

const target = process.env.E2E_TARGET ?? "next";
if (target !== "next" && target !== "vinext") {
  throw new Error(`Unknown E2E_TARGET: ${target}. Use next or vinext.`);
}
const port = target === "vinext" ? 3101 : 3100;

export default defineConfig({
  testDir: "./e2e",
  outputDir: `test-results/${target}`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never", outputFolder: `playwright-report/${target}` }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: target === "vinext"
      ? `npm run start:vinext -- --ip 127.0.0.1 --port ${port}`
      : `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
