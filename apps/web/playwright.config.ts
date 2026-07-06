import { defineConfig, devices } from "@playwright/test";

// 로컬에서 dev 서버 포트가 다를 때(예: 3000 점유 → 3001) PLAYWRIGHT_BASE_URL로 덮어쓴다.
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const IS_CI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  // _capture-*는 스크린샷 캡처 헬퍼(테스트 아님) — CI에서 제외, 로컬은 직접 지정 실행.
  testIgnore: IS_CI ? "**/_capture-*.spec.ts" : [],
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  reporter: IS_CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
  ],
  webServer: {
    // CI는 production 빌드로 검증(MSW는 NEXT_PUBLIC_API_MOCKING 플래그로 기동).
    command: IS_CI ? "pnpm build && pnpm start" : "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
    timeout: 240 * 1000,
    env: IS_CI ? { NEXT_PUBLIC_API_MOCKING: "enabled" } : {},
  },
});
