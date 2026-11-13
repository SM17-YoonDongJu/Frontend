import { expect, test, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/**
 * 아이디·비밀번호 로그인·회원가입 E2E (이슈 #322).
 *
 * 원칙: 핵심 사용자 흐름만 — 소셜 계정 없이 가입해 바로 홈 진입(CUJ), 로그인 성공 후 역할별 분기,
 *   아이디 중복(409)·로그인 실패(401)가 폼 안에서 안내되고 /login-required로 튕기지 않는 것,
 *   새로고침 세션 유지.
 * 세션 판정이 두 층이다. 서버 가드(proxy.ts)는 access_token 쿠키만 보므로 보호 경로 진입에는
 *   setAuthCookie로 더미 쿠키가 필요하고, 역할 교차 리다이렉트도 이 쿠키의 role로 결정된다.
 *   클라이언트 쪽 로그인 여부는 GET /users/me가 정하는데 MSW가 실제 쿠키를 심을 수 없어
 *   목이 localStorage["mock:loggedOut"]로 대역한다 —
 *   비로그인 상태로 시작(플래그 세팅)하고, 가입·로그인 성공 핸들러가 플래그를 지워 세션 복귀를 재현한다.
 *   `x-mock-scenario: unauthenticated` 헤더는 전 요청에 붙어 로그인 후에도 401이 유지되므로 쓰지 않는다.
 * 클라이언트 검증(아이디 4~20자·비밀번호 8자·72바이트)이 서버 400 BAD_REQUEST보다 먼저 막으므로
 *   400 분기는 목 계약(handlers.ts)과 zod에 위임하고, 여기서는 폼이 전송 전에 막는 것만 본다.
 * 역할 분기는 localStorage["mock:userType"]로 주입한다(로그인 응답 role이 그 값에 따라 바뀜).
 */

const LOGIN_PATH = "/login";
const SIGNUP_PATH = "/signup/password";
const LOGGED_OUT_KEY = "mock:loggedOut";
const USER_TYPE_KEY = "mock:userType";

const SEED_GUARD_KEY = "e2e:loggedOutSeeded";

/**
 * 비로그인 상태로 시작 — 목 보호 엔드포인트가 401 LOGIN_REQUIRED를 돌려준다.
 *
 * init script는 내비게이션마다 다시 돌기 때문에 로그아웃 플래그를 매번 심으면 가입·로그인 성공으로
 * 지워진 플래그가 홈 이동 직후 되살아나 /login-required로 튕긴다. 그래서 탭 수명 동안 남는
 * sessionStorage 센티널로 첫 로드에서만 심는다. 역할 주입은 매번 유지돼야 하므로 가드 밖에 둔다.
 */
async function startLoggedOut(page: Page, userType?: "adjuster") {
  // 서버 가드 통과용 더미 쿠키 — 역할 교차 리다이렉트가 이 role을 보므로 목 역할과 맞춘다.
  await setAuthCookie(page, userType === "adjuster" ? "CERTIFICATED_ADJUSTER" : "USER");
  await page.addInitScript(
    ([loggedOutKey, userTypeKey, guardKey, value]) => {
      if (value) window.localStorage.setItem(userTypeKey, value);
      if (window.sessionStorage.getItem(guardKey)) return;
      window.sessionStorage.setItem(guardKey, "1");
      window.localStorage.setItem(loggedOutKey, "true");
    },
    [LOGGED_OUT_KEY, USER_TYPE_KEY, SEED_GUARD_KEY, userType ?? ""] as const,
  );
}

/** 로그인 화면의 아이디 폼은 기본으로 접혀 있다 — 펼쳐야 입력 칸이 나온다. */
async function openPasswordLogin(page: Page) {
  const toggle = page.getByRole("button", { name: "아이디로 로그인" });
  await expect(async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }).toPass({ timeout: 20000 });
}

/** 하이드레이션 전 입력·클릭 유실 방지 — 제출과 결과 확인을 묶어 재시도한다. */
async function submitAndExpect(page: Page, button: string, expectation: () => Promise<void>) {
  await expect(async () => {
    await page.getByRole("button", { name: button, exact: true }).click();
    await expectation();
  }).toPass({ timeout: 20000 });
}

test.describe("회원가입", () => {
  test("아이디·비밀번호로 가입하면 바로 로그인 상태로 홈에 진입한다", async ({ page }) => {
    await startLoggedOut(page);
    await page.goto(SIGNUP_PATH);

    await expect(page.getByRole("heading", { name: "아이디로 가입하기" })).toBeVisible();

    await page.getByLabel("아이디").fill("newmember");
    await page.getByLabel("비밀번호").fill("password123");
    await page.getByLabel("이름").fill("홍길동");

    await submitAndExpect(page, "가입하고 시작하기", async () => {
      await expect(page).toHaveURL(/\/customer\/dashboard$/, { timeout: 10000 });
    });

    await expect(
      page.getByRole("heading", { name: "안녕하세요, 홍길동님" }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });

    // 일반 가입 계정은 전화번호·성별·지역·소셜 연결이 비어 있다 — 그 상태로 마이페이지가 렌더되는지.
    // 이름 히어로는 PC 전용이라 뷰포트 무관하게 보이는 회원 구분으로 확인한다.
    await hideQueryDevtools(page);
    await page.goto("/customer/mypage");
    await expect(page.getByText("일반 회원").filter({ visible: true })).toBeVisible({
      timeout: 15000,
    });
  });

  test("이미 사용 중인 아이디는 폼 안에서 안내되고 로그인 안내 화면으로 튕기지 않는다", async ({
    page,
  }) => {
    await startLoggedOut(page);
    await page.goto(SIGNUP_PATH);

    await page.getByLabel("아이디").fill("takenid");
    await page.getByLabel("비밀번호").fill("password123");
    await page.getByLabel("이름").fill("홍길동");

    await submitAndExpect(page, "가입하고 시작하기", async () => {
      await expect(page.getByText("이미 사용 중인 아이디예요.", { exact: false })).toBeVisible({
        timeout: 10000,
      });
    });

    await expect(page).toHaveURL(/\/signup\/password$/);
  });

  test("아이디 형식이 맞지 않으면 전송 전에 폼에서 막는다", async ({ page }) => {
    await startLoggedOut(page);
    await page.goto(SIGNUP_PATH);

    // 한글·3자 — 영문·숫자·밑줄 4~20자 규칙 위반.
    await page.getByLabel("아이디").fill("가나다");
    await page.getByLabel("비밀번호").fill("password123");
    await page.getByLabel("이름").fill("홍길동");

    await submitAndExpect(page, "가입하고 시작하기", async () => {
      await expect(
        page.getByText("아이디는 영문·숫자·밑줄 4~20자로 입력해 주세요."),
      ).toBeVisible({ timeout: 10000 });
    });

    // 오류 문구가 입력의 접근 가능한 설명으로 연결돼 스크린 리더가 입력에서 이유를 읽는다
    await expect(page.getByLabel("아이디")).toHaveAccessibleDescription(
      "아이디는 영문·숫자·밑줄 4~20자로 입력해 주세요.",
    );

    await expect(page).toHaveURL(/\/signup\/password$/);
  });
});

test.describe("로그인", () => {
  test("아이디 대소문자를 다르게 입력해도 로그인되고 새로고침해도 세션이 유지된다", async ({
    page,
  }) => {
    await startLoggedOut(page);
    await page.goto(LOGIN_PATH);
    await openPasswordLogin(page);

    // 백엔드가 아이디를 소문자로 정규화한다 — FE는 입력을 그대로 보낸다.
    await page.getByLabel("아이디").fill("NewMember");
    await page.getByLabel("비밀번호").fill("password123");

    await submitAndExpect(page, "로그인", async () => {
      await expect(page).toHaveURL(/\/customer\/dashboard$/, { timeout: 10000 });
    });

    await page.reload();
    await expect(page).toHaveURL(/\/customer\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: /안녕하세요, .+님/ }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });
  });

  test("사정사 계정으로 로그인하면 파트너 홈으로 이동한다", async ({ page }) => {
    await startLoggedOut(page, "adjuster");
    await page.goto(LOGIN_PATH);
    await openPasswordLogin(page);

    await page.getByLabel("아이디").fill("adjuster1");
    await page.getByLabel("비밀번호").fill("password123");

    await submitAndExpect(page, "로그인", async () => {
      await expect(page).toHaveURL(/\/partner$/, { timeout: 10000 });
    });
  });

  test("비밀번호가 틀리면 폼 안에서 서버 문구로 안내되고 로그인 안내 화면으로 튕기지 않는다", async ({
    page,
  }) => {
    await startLoggedOut(page);
    await page.goto(LOGIN_PATH);
    await openPasswordLogin(page);

    await page.getByLabel("아이디").fill("newmember");
    await page.getByLabel("비밀번호").fill("wrongpw");

    await submitAndExpect(page, "로그인", async () => {
      // Next의 라우트 안내 노드도 role=alert이라 폼 안의 알림만 골라낸다.
      await expect(
        page.getByRole("alert").filter({ hasText: "아이디 또는 비밀번호" }),
      ).toBeVisible({ timeout: 10000 });
    });

    await expect(page).toHaveURL(/\/login$/);
  });
});
