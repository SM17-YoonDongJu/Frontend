import { expect, test } from "@playwright/test";

/**
 * 손해사정사(파트너) 마이페이지 로그아웃 E2E (이슈 #155).
 *
 * 원칙: 핵심 사용자 흐름만 — 파트너 로그아웃 버튼은 모바일 전용(md:hidden)이라 모바일 뷰포트로
 * 고정해 검증한다(CI chromium 데스크톱 프로젝트에서도 동일 조건으로 돌기 위함).
 * 로그아웃 성공 시 MSW가 localStorage["mock:loggedOut"]을 세팅해 GET /adjusters/me/mypage가
 * 401 LOGIN_REQUIRED를 돌려주므로, 뒤로 가기 시 로그인 안내(#148)로 이동한다.
 */

const MYPAGE_PATH = "/partner/mypage";

test.use({ viewport: { width: 390, height: 844 } });

test("로그아웃을 누르면 로그인 화면으로 이동하고, 다시 들어가도 마이페이지가 보이지 않는다", async ({
  page,
}) => {
  await page.goto(MYPAGE_PATH);
  await expect(page.getByRole("heading", { name: /김상정 사정사/ })).toBeVisible();

  const logoutButton = page
    .getByRole("button", { name: "로그아웃" })
    .filter({ visible: true });

  // 하이드레이션 가드 — 첫 클릭 유실 시 재시도
  await expect(async () => {
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 5000 });
  }).toPass({ timeout: 20000 });
  await expect(
    page.getByRole("heading", { name: "바른보상 시작하기" }),
  ).toBeVisible();

  // 마이페이지 히스토리는 대체(location.replace)돼 뒤로 가기 대상이 없으므로 재진입으로 검증 —
  // 세션이 끝나 이전 계정 데이터 대신 로그인 안내로 이동한다.
  await page.goto(MYPAGE_PATH);
  await expect(page).toHaveURL(/\/login-required/, { timeout: 20000 });
});
