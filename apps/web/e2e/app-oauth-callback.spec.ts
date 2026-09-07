import { devices, expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 앱 웹뷰 OAuth 콜백 분기 E2E (이슈 #178).
 *
 * 원칙: 앱에서 시작한 로그인(state `app.` 접두어)이 외부 브라우저에서 콜백에 도달하면
 *       code를 교환하지 않고 앱 딥링크로 넘긴다(쿠키가 외부 브라우저에 남는 것 방지).
 *       앱 웹뷰 안(UA에 BareunApp)에서는 접두어와 무관하게 정상 교환한다.
 * 인가 리다이렉트·실제 딥링크 복귀(brbosang://)는 브라우저 밖 영역이라 검증하지 않고,
 * "교환이 실행됐는가(홈 이동 여부)"와 실패 콜백의 로그인 복귀만 검증한다.
 */

const UNAUTH_HEADER = { "x-mock-scenario": "unauthenticated" };

test.describe("외부 브라우저 복귀", () => {
  test("앱에서 시작한 로그인 콜백은 code를 교환하지 않고 홈으로 이동하지 않는다", async ({
    page,
    browserName,
  }) => {
    // webkit은 미지원 스킴(brbosang://) 이동 시 동작이 달라 chromium 계열만 검증한다.
    test.skip(browserName === "webkit", "커스텀 스킴 이동 동작이 달라 chromium만 검증");

    await page.goto("/login/oauth2/code/kakao?code=valid&state=app.s1");

    // 교환이 실행됐다면 code=valid는 수 초 내 홈(→고객 대시보드)으로 이동한다.
    // 교환 차단이 정상이면 대기 화면(스피너)이 유지되고 콜백 URL에 머문다.
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/\/login\/oauth2\/code\/kakao/);
  });

  test("실패 콜백(제공자 거부)은 외부 브라우저여도 로그인 화면으로 돌아간다", async ({
    page,
  }) => {
    await page.setExtraHTTPHeaders(UNAUTH_HEADER);
    await page.goto("/login/oauth2/code/kakao?error=access_denied&state=app.s1");

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
  });
});

test.describe("콜백 code 중복 요청 방지 (#306)", () => {
  const CALL_COUNT_KEY = "mock:oauthCallbackCallCount:kakao:valid";

  test("성공 후 콜백 페이지가 같은 code로 리마운트돼도 API가 한 번만 호출된다", async ({
    page,
  }) => {
    // 테스트마다 새 브라우저 컨텍스트라 localStorage는 비어 있음(addInitScript는 매 네비게이션마다
    // 재실행돼 첫 호출 카운트까지 지워버리므로 별도 초기화 불필요).
    // 콜백 응답만으론 미들웨어 보호 라우트 진입이 안 되므로(SW는 실제 쿠키를 못 심음) 직접 주입.
    await setAuthCookie(page, "USER");

    await page.goto("/login/oauth2/code/kakao?code=valid&state=s1");
    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });

    // gcTime 만료 후 리마운트를 흉내: 같은 code로 콜백 페이지를 다시 연다.
    await page.goto("/login/oauth2/code/kakao?code=valid&state=s1");
    await page.waitForTimeout(1000);

    const callCount = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      CALL_COUNT_KEY,
    );
    expect(callCount).toBe("1");
  });

  test("다른 code로 로그인한 뒤에도 앞선 code의 소모 기록이 유지된다", async ({ page }) => {
    await setAuthCookie(page, "USER");

    await page.goto("/login/oauth2/code/kakao?code=valid&state=s1");
    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });

    // 같은 세션에서 두 번째 로그인 — 소모 기록이 code별로 분리돼 있어야 한다.
    await page.goto("/login/oauth2/code/kakao?code=valid-2&state=s2");
    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });

    await page.goto("/login/oauth2/code/kakao?code=valid&state=s1");
    await page.waitForTimeout(1000);

    const callCount = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      CALL_COUNT_KEY,
    );
    expect(callCount).toBe("1");
  });
});

test.describe("앱 웹뷰 내 콜백", () => {
  // 앱 웹뷰 판별은 UA 토큰(BareunApp) 기준 — 웹뷰 안에서는 접두어가 있어도 정상 교환.
  test.use({
    userAgent: `${devices["Desktop Chrome"].userAgent} BareunApp/1.0`,
  });

  test("앱 웹뷰 안에서는 state 접두어와 무관하게 교환이 완료되고 홈으로 이동한다", async ({
    page,
  }) => {
    // 콜백 성공 후 도착지(/customer/dashboard)는 미들웨어 보호 라우트 — MSW는 실제 쿠키를 못 심으므로 직접 주입.
    await setAuthCookie(page, "USER");
    await page.goto("/login/oauth2/code/kakao?code=valid&state=app.s1");

    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });
  });
});
