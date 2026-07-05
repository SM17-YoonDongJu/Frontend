import { expect, test } from "@playwright/test";

/**
 * 로그인 E2E (이슈 #40).
 *
 * 원칙: 핵심 사용자 흐름 — 첫 로그인 화면 / 재로그인 화면(흔적) / 소셜 콜백 성공(기존·신규 분기) /
 *       콜백 실패 재시도 / 파라미터 누락 시 로그인 리다이렉트.
 * 응답은 기본 MSW 핸들러가 제공(콜백 성공=기존회원, code=new→신규, /users/me=yunseo@example.com).
 * 인가 리다이렉트(window.location→외부 OAuth)는 서드파티라 테스트하지 않고, 콜백 진입 이후만 검증한다.
 * 콜백 실패는 MSW 핸들러의 URL code 트리거로 결정 주입한다(code=fail-external → 500 EXTERNAL_API_ERROR).
 */

const LOGIN_PATH = "/login";
const RECENT_LOGIN_KEY = "bb.recentLogin";

test("흔적이 없으면 첫 로그인 화면과 시작하기 버튼·약관 문구가 보인다", async ({ page }) => {
  await page.goto(LOGIN_PATH);

  await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "카카오로 시작하기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "네이버로 시작하기" })).toBeVisible();
  await expect(page.getByText("이용약관")).toBeVisible();
  await expect(page.getByText("개인정보 처리방침")).toBeVisible();
});

test("최근 로그인 흔적이 있으면 재로그인 화면과 최근 로그인 카드가 보인다", async ({ page }) => {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [
      RECENT_LOGIN_KEY,
      JSON.stringify({
        provider: "kakao",
        maskedEmail: "yun***@example.com",
        lastLoginAt: "2026-05-20T09:00:00Z",
      }),
    ] as const,
  );

  await page.goto(LOGIN_PATH);

  await expect(page.getByRole("heading", { name: "다시 만나서 반가워요" })).toBeVisible();
  await expect(page.getByText("카카오 · yun***@example.com")).toBeVisible();
  await expect(page.getByText("마지막 로그인 2026.05.20")).toBeVisible();
  await expect(page.getByRole("button", { name: "카카오로 계속하기" })).toBeVisible();
});

test("기존 회원 콜백이면 홈으로 이동하고 로그인 흔적이 저장된다", async ({ page }) => {
  await page.goto("/oauth/kakao/callback?code=valid&state=s1");

  await expect(page).toHaveURL(/\/$/, { timeout: 15000 });

  const stored = await page.evaluate(
    (key) => window.localStorage.getItem(key),
    RECENT_LOGIN_KEY,
  );
  expect(stored).toContain("kakao");
});

test("신규 회원 콜백이면 회원가입으로 이동한다", async ({ page }) => {
  await page.goto("/oauth/kakao/callback?code=new&state=s1");

  await expect(page).toHaveURL(/\/signup/, { timeout: 15000 });
});

test("콜백이 실패하면 에러 안내와 다시 시도 버튼이 보이고 재시도해도 실패가 유지된다", async ({ page }) => {
  // MSW 핸들러가 URL code로 실패를 결정 주입(code=fail-external → 500 EXTERNAL_API_ERROR).
  await page.goto("/oauth/kakao/callback?code=fail-external&state=s1");

  const errorMessage = page.getByText(
    "소셜 로그인 연동 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
  );
  await expect(errorMessage).toBeVisible();

  const retry = page.getByRole("button", { name: "다시 시도" });
  await expect(retry).toBeVisible();

  // 재시도해도 동일 code로 실패가 유지된다(결정적) — 에러 안내가 그대로 노출되고 이동하지 않는다.
  await retry.click();
  await expect(errorMessage).toBeVisible();
  await expect(page).toHaveURL(/\/oauth\/kakao\/callback/);
});

test("인가 코드가 없으면 로그인 화면으로 되돌아간다", async ({ page }) => {
  await page.goto("/oauth/kakao/callback");

  await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
});
