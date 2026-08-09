/**
 * 로그인 안내 화면·인증 에러 분기 E2E (이슈 #145).
 * 원칙: 핵심 사용자 흐름만 — 비로그인 접근 시 안내 화면 / 로그인 이동 / 로그인 후 원래 페이지 복귀 / 일반 에러 비간섭.
 * 인증 에러는 x-mock-scenario·x-mock-failure 헤더로 MSW 핸들러가 401을 강제.
 * 복귀 경로 저장 포맷·open redirect 차단은 정적 레이어(TS·유틸 단위 로직)에 위임(미테스트).
 */
import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

const PROTECTED_PATH = "/customer/dashboard";
const LOGIN_REQUIRED_PATH = "/login-required";
const STATUS_PATH = "/signup/verification/status";

const UNAUTH_HEADER = { "x-mock-scenario": "unauthenticated" };

test("비로그인 상태로 보호 페이지에 접근하면 로그인 안내 화면이 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
  await page.goto(PROTECTED_PATH);

  await expect(page).toHaveURL(new RegExp(LOGIN_REQUIRED_PATH));
  await expect(
    page.getByRole("heading", { name: "서비스를 이용하시려면 로그인이 필요합니다" }),
  ).toBeVisible();
});

test("안내 화면의 버튼을 누르면 로그인 페이지로 이동한다", async ({ page }) => {
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
  await page.goto(LOGIN_REQUIRED_PATH);

  const loginLink = page.getByRole("link", { name: "로그인하러 가기" });
  await expect(async () => {
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  }).toPass({ timeout: 10000 });
});

test("로그인이 완료되면 원래 보던 페이지로 돌아온다", async ({ page }) => {
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
  await page.goto(PROTECTED_PATH);
  await expect(page).toHaveURL(new RegExp(LOGIN_REQUIRED_PATH));

  // 로그인 성공 상태로 전환(기본 MSW = 로그인 유저) 후 로그인 화면 진입 → 저장된 복귀 경로로 이동
  await page.setExtraHTTPHeaders({});
  // 복귀 목적지(보호 라우트)는 미들웨어가 실제 쿠키를 요구 — MSW는 쿠키를 못 심으므로 직접 주입.
  await setAuthCookie(page, "USER");
  const loginLink = page.getByRole("link", { name: "로그인하러 가기" });
  await expect(async () => {
    await loginLink.click();
    await expect(page).toHaveURL(new RegExp(PROTECTED_PATH));
  }).toPass({ timeout: 15000 });
});

test("인증과 무관한 서버 에러는 기존 에러 상태 그대로 표시된다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "application-status" });
  await page.goto(STATUS_PATH);

  await expect(page.getByText(/심사 현황을 불러오지 못했어요/)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(STATUS_PATH));
});

test("보호 데이터 조회가 인증 에러로 실패하면 일반 에러 대신 로그인 안내 화면으로 이동한다", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "application-unauthorized" });
  await page.goto(STATUS_PATH);

  await expect(page).toHaveURL(new RegExp(LOGIN_REQUIRED_PATH), { timeout: 15000 });
  await expect(
    page.getByRole("heading", { name: "서비스를 이용하시려면 로그인이 필요합니다" }),
  ).toBeVisible();
});
