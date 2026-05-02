import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Force UTC inside the dev server so INC-C (loyalty TZ bug) reproduces
    // identically on every developer machine. In production the Docker
    // container runs UTC; aligning the test webServer matches that, and the
    // CET/CEST fixture timestamps in INC-C.spec.ts assume UTC server time.
    env: { TZ: "UTC" },
  },
});
