import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 45_000,
  expect: {
    timeout: 8_000
  },
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4174",
    port: 4174,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
