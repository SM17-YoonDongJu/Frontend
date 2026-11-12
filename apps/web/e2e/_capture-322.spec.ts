import { test, expect, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#322). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-322";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const SEED_GUARD_KEY = "e2e:loggedOutSeeded";

async function startLoggedOut(page: Page) {
  await setAuthCookie(page, "USER");
  await page.addInitScript((guardKey) => {
    if (window.sessionStorage.getItem(guardKey)) return;
    window.sessionStorage.setItem(guardKey, "1");
    window.localStorage.setItem("mock:loggedOut", "true");
  }, SEED_GUARD_KEY);
}

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await startLoggedOut(page);
});

/** 로그인 화면의 아이디 폼은 기본으로 접혀 있다. */
async function openPasswordLogin(page: Page) {
  const toggle = page.getByRole("button", { name: "아이디로 로그인" });
  await expect(async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }).toPass({ timeout: 20000 });
  // 셰브런 회전 트랜지션이 끝난 뒤 찍는다 — 중간 프레임이 잡히면 아이콘이 기운 채로 남는다.
  await page.waitForTimeout(400);
}

test("01 로그인 화면 PC — 아이디 로그인 접힌 기본 상태", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "아이디로 로그인" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/01-login-desktop.png`, fullPage: true });
});

test("02 로그인 화면 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "아이디로 로그인" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/02-login-mobile.png`, fullPage: true });
});

test("08 로그인 화면 PC — 아이디 로그인 펼친 상태", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/login");
  await openPasswordLogin(page);
  await page.screenshot({ path: `${DIR}/08-login-desktop-expanded.png`, fullPage: true });
});

test("09 로그인 화면 모바일 — 아이디 로그인 펼친 상태", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/login");
  await openPasswordLogin(page);
  await page.screenshot({ path: `${DIR}/09-login-mobile-expanded.png`, fullPage: true });
});

test("03 가입 화면 PC", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/signup/password");
  await expect(page.getByRole("heading", { name: "아이디로 가입하기" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/03-signup-desktop.png`, fullPage: true });
});

test("04 가입 화면 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/signup/password");
  await expect(page.getByRole("heading", { name: "아이디로 가입하기" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/04-signup-mobile.png`, fullPage: true });
});

test("05 로그인 실패 — 폼 안 인라인 안내", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/login");
  await openPasswordLogin(page);
  await page.getByLabel("아이디").fill("newmember");
  await page.getByLabel("비밀번호").fill("wrongpw");
  await expect(async () => {
    await page.getByRole("button", { name: "로그인", exact: true }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "아이디 또는 비밀번호" }),
    ).toBeVisible({ timeout: 10000 });
  }).toPass({ timeout: 20000 });
  await page.screenshot({ path: `${DIR}/05-login-failed.png`, fullPage: true });
});

test("06 아이디 중복 — 폼 안 인라인 안내", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/signup/password");
  await page.getByLabel("아이디").fill("takenid");
  await page.getByLabel("비밀번호").fill("password123");
  await page.getByLabel("이름").fill("홍길동");
  await expect(async () => {
    await page.getByRole("button", { name: "가입하고 시작하기", exact: true }).click();
    await expect(page.getByText("이미 사용 중인 아이디예요.")).toBeVisible({ timeout: 10000 });
  }).toPass({ timeout: 20000 });
  await page.screenshot({ path: `${DIR}/06-signup-duplicate.png`, fullPage: true });
});

test("07 아이디 형식 위반 — 전송 전 폼 검증", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/signup/password");
  await page.getByLabel("아이디").fill("가나다");
  await page.getByLabel("비밀번호").fill("short");
  await page.getByLabel("이름").fill("홍길동");
  await expect(async () => {
    await page.getByRole("button", { name: "가입하고 시작하기", exact: true }).click();
    await expect(
      page.getByText("아이디는 영문·숫자·밑줄 4~20자로 입력해 주세요."),
    ).toBeVisible({ timeout: 10000 });
  }).toPass({ timeout: 20000 });
  await page.screenshot({ path: `${DIR}/07-signup-validation.png`, fullPage: true });
});
