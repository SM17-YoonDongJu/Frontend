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

// 로그인 화면은 비로그인 유저에게만 보인다(#108 접근 제한 가드). 기본 MSW 핸들러의 /users/me는
// 로그인 유저를 반환하므로, 로그인 화면 검증 케이스는 비로그인 시나리오를 헤더로 주입한다.
const UNAUTH_HEADER = { "x-mock-scenario": "unauthenticated" };

// 재로그인 화면 카피는 뷰포트별로 다르다(데스크톱 "다시 만나서 반가워요" / 모바일 "다시 오신 걸 환영해요").
// 최근 로그인 카드는 데스크톱 전용(모바일 시안엔 없음).
const MOBILE_MAX_WIDTH = 640;
function returningHeading(width: number): string {
  return width < MOBILE_MAX_WIDTH ? "다시 오신 걸 환영해요" : "다시 만나서 반가워요";
}

test("흔적이 없으면 첫 로그인 화면과 시작하기 버튼·약관 문구가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
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
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);

  await page.goto(LOGIN_PATH);

  const width = page.viewportSize()?.width ?? 0;
  await expect(page.getByRole("heading", { name: returningHeading(width) })).toBeVisible();
  await expect(page.getByRole("button", { name: "카카오로 계속하기" })).toBeVisible();

  // 최근 로그인 카드(플랫폼·마스킹 계정·일자)는 데스크톱 화면에만 노출된다.
  if (width >= MOBILE_MAX_WIDTH) {
    await expect(page.getByText("카카오 · yun***@example.com")).toBeVisible();
    await expect(page.getByText("마지막 로그인 2026.05.20")).toBeVisible();
  }
});

test("기존 회원 콜백이면 홈으로 이동하고 로그인 흔적이 저장된다", async ({ page }) => {
  await page.goto("/login/oauth2/code/kakao?code=valid&state=s1");

  // 콜백은 "/"로 보내고, 랜딩 가드가 곧바로 역할별 홈으로 다시 보낸다(#108).
  // "/" 체류 시간이 짧아 관측되지 않을 수 있어 최종 도착지인 고객 대시보드로 단언한다.
  await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });

  // 흔적 저장은 사용자 관찰 기준으로 검증 — 로그인 화면 재진입 시 재로그인 화면이 보인다.
  // 로그인 상태로는 가드에 막히므로(#108) 로그아웃 상태를 주입해 재진입한다(흔적은 localStorage라 유지).
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
  await page.goto(LOGIN_PATH);
  const width = page.viewportSize()?.width ?? 0;
  await expect(page.getByRole("heading", { name: returningHeading(width) })).toBeVisible();
  await expect(page.getByRole("button", { name: "카카오로 계속하기" })).toBeVisible();
});

test("신규 회원 콜백이면 회원가입으로 이동한다", async ({ page }) => {
  await page.goto("/login/oauth2/code/kakao?code=new&state=s1");

  await expect(page).toHaveURL(/\/signup/, { timeout: 15000 });
  // 콜백이 보관한 가입 티켓으로 컨텍스트 가드를 통과해 퍼널 첫 단계가 렌더된다.
  await expect(page.getByRole("heading", { name: "어떤 역할로 시작하시겠어요?" })).toBeVisible();
});

test("콜백이 실패하면 에러 안내와 다시 시도 버튼이 보이고 재시도해도 실패가 유지된다", async ({ page }) => {
  // MSW 핸들러가 URL code로 실패를 결정 주입(code=fail-external → 500 EXTERNAL_API_ERROR).
  await page.goto("/login/oauth2/code/kakao?code=fail-external&state=s1");

  const errorMessage = page.getByText(
    "소셜 로그인 연동 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
  );
  await expect(errorMessage).toBeVisible();

  const retry = page.getByRole("button", { name: "다시 시도" });
  await expect(retry).toBeVisible();

  // 재시도해도 동일 code로 실패가 유지된다(결정적) — 에러 안내가 그대로 노출되고 이동하지 않는다.
  await retry.click();
  await expect(errorMessage).toBeVisible();
  await expect(page).toHaveURL(/\/login\/oauth2\/code\/kakao/);
});

test("인가 코드가 없으면 로그인 화면으로 되돌아간다", async ({ page }) => {
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
  await page.goto("/login/oauth2/code/kakao");

  await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
});

/**
 * 로그인 사용자 접근 제한 (이슈 #108).
 * 로그인 여부는 GET /users/me로 판별 — 기본 MSW 핸들러가 로그인 유저(insured_person),
 * localStorage["mock:userType"]="adjuster"면 사정사, x-mock-failure:me면 조회 실패(500).
 */
test.describe("로그인 사용자 접근 제한", () => {
  test("로그인 유저가 진입하면 고객 대시보드로 이동한다", async ({ page }) => {
    await page.goto(LOGIN_PATH);

    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 10000 });
  });

  test("사정사가 진입하면 파트너 홈으로 이동한다", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("mock:userType", "adjuster");
    });

    await page.goto(LOGIN_PATH);

    await expect(page).toHaveURL(/\/partner/, { timeout: 10000 });
  });

  test("로그인 여부 확인에 실패하면 로그인 화면이 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-failure": "me" });

    await page.goto(LOGIN_PATH);

    await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
