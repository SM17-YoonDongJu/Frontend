import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 회원 탈퇴 E2E (이슈 #179).
 *
 * 원칙: 핵심 사용자 흐름만 — 마이페이지(고객 PC·모바일 / 사정사) 진입점에서 탈퇴 안내로 이동,
 * 안내 확인 → 최종 확인 다이얼로그 → 계정 삭제 후 랜딩 복귀. 되돌릴 수 없는 동작이라
 * "확인 없이는 지워지지 않는다"와 "실패하면 계정이 남고 재시도로 회복된다"를 함께 검증한다.
 * 응답은 기본 MSW 핸들러(DELETE /users/me)가 제공 — 성공 시 로그아웃 상태를 기록해
 * 랜딩이 대시보드로 돌아가지 않고 유지된다.
 * 실패는 x-mock-failure=withdraw 헤더로 500을 강제(고가치 — 실패했는데 계정이 사라진 것처럼
 * 보이면 신뢰 직타). 응답 봉투·에러코드 enum·다이얼로그 포커스 트랩은 zod·api-spec 훅·정적
 * 리뷰에 위임(의식적 미테스트).
 * 앱 웹뷰 기기 토큰(이슈 #228): 브리지 스텁 + 저장 토큰 시드로 탈퇴 시 서버 해제(저장값 제거)와
 * 해제 실패 시에도 탈퇴가 진행되는 best-effort를 검증 — 해제 실패는 x-mock-failure=device-token.
 * 고객 마이페이지는 PC/모바일 트리가 DOM에 공존(hidden md:* / md:hidden)하므로 보이는
 * 진입점만 filter로 지정한다.
 */

const WITHDRAW_PATH = "/withdraw";
const CUSTOMER_MYPAGE_PATH = "/customer/mypage";
const PARTNER_MYPAGE_PATH = "/partner/mypage";

async function clickWithdrawEntry(page: import("@playwright/test").Page) {
  const entry = page.getByRole("link", { name: "회원 탈퇴" }).filter({ visible: true });

  // 하이드레이션 가드 — 첫 클릭 유실 시 재시도
  await expect(async () => {
    await entry.click();
    await expect(page).toHaveURL(/\/withdraw$/, { timeout: 5000 });
  }).toPass({ timeout: 20000 });
}

async function openWithdrawConfirm(page: import("@playwright/test").Page) {
  const withdrawButton = page.getByRole("button", { name: "회원 탈퇴" });

  await expect(async () => {
    await withdrawButton.click();
    await expect(page.getByRole("dialog", { name: "정말 탈퇴하시겠어요?" })).toBeVisible({
      timeout: 5000,
    });
  }).toPass({ timeout: 20000 });
}

test.describe("PC", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page, "USER");
  });

  test("마이페이지 사이드바의 회원 탈퇴를 누르면 탈퇴 안내가 보인다", async ({ page }) => {
    await page.goto(CUSTOMER_MYPAGE_PATH);
    await expect(page.getByRole("heading", { name: "윤서 님" })).toBeVisible({
      timeout: 15000,
    });

    await clickWithdrawEntry(page);

    await expect(page.getByRole("heading", { level: 1, name: "회원 탈퇴" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "탈퇴하면 이렇게 됩니다" })).toBeVisible();
    await expect(page.getByText("주고받은 채팅 대화가 삭제되어 다시 볼 수 없습니다.")).toBeVisible();
  });

  test("안내를 확인하고 탈퇴하면 랜딩 화면으로 돌아간다", async ({ page }) => {
    await page.goto(WITHDRAW_PATH);
    await openWithdrawConfirm(page);

    await page.getByRole("button", { name: "탈퇴하기" }).click();

    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
    await expect(page.getByRole("heading", { name: /적정한 금액일까요/ })).toBeVisible({
      timeout: 15000,
    });
  });

  test("최종 확인에서 취소하면 탈퇴되지 않고 안내 화면에 남는다", async ({ page }) => {
    await page.goto(WITHDRAW_PATH);
    await openWithdrawConfirm(page);

    await page.getByRole("button", { name: "취소" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/\/withdraw$/);
  });
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page, "USER");
  });

  test("설정 목록의 회원 탈퇴를 누르면 탈퇴 안내가 보인다", async ({ page }) => {
    await page.goto(CUSTOMER_MYPAGE_PATH);
    await expect(
      page.getByRole("heading", { level: 1, name: "내 정보" }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });

    await clickWithdrawEntry(page);

    await expect(page.getByRole("heading", { level: 1, name: "회원 탈퇴" })).toBeVisible();
  });

  test("탈퇴가 실패하면 안내가 보이고, 다시 시도하면 탈퇴된다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-failure": "withdraw" });

    await page.goto(WITHDRAW_PATH);
    await openWithdrawConfirm(page);
    await page.getByRole("button", { name: "탈퇴하기" }).click();

    // Next의 라우트 안내(role=alert)와 겹치지 않게 사용자가 읽는 문구로 지정한다.
    await expect(page.getByText("회원 탈퇴를 처리하지 못했어요")).toBeVisible({
      timeout: 15000,
    });
    await expect(page).toHaveURL(/\/withdraw$/);

    // 서버가 회복된 뒤 재시도하면 그대로 탈퇴가 끝난다.
    await page.setExtraHTTPHeaders({});
    await page.getByRole("button", { name: "다시 시도" }).click();

    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
    await expect(page.getByRole("heading", { name: /놓친 만큼 찾아드립니다/ })).toBeVisible({
      timeout: 15000,
    });
  });
});

test.describe("앱 웹뷰 기기 토큰", () => {
  // device-token-storage.ts의 저장 키를 거울로 사용 — 앱 웹뷰에서 등록된 토큰이 있는 상태를 재현한다.
  const DEVICE_TOKEN_KEY = "bb.registeredDeviceToken";

  test.use({ viewport: { width: 390, height: 844 } });
  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page, "USER");
    // 브리지 스텁 + 토큰 시드. init script는 내비게이션마다 재실행되므로
    // 탈퇴 후 랜딩에서 재시드되지 않도록 1회만 심는다.
    await page.addInitScript((key) => {
      Object.assign(window, { ReactNativeWebView: { postMessage: () => {} } });
      if (!window.localStorage.getItem("e2e.deviceTokenSeeded")) {
        window.localStorage.setItem("e2e.deviceTokenSeeded", "1");
        window.localStorage.setItem(
          key,
          JSON.stringify({ userId: "user-e2e", token: "device-token-e2e" }),
        );
      }
    }, DEVICE_TOKEN_KEY);
  });

  test("탈퇴하면 등록된 기기 푸시 토큰이 해제된다", async ({ page }) => {
    await page.goto(WITHDRAW_PATH);
    await openWithdrawConfirm(page);
    await page.getByRole("button", { name: "탈퇴하기" }).click();

    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
    const remaining = await page.evaluate((key) => localStorage.getItem(key), DEVICE_TOKEN_KEY);
    expect(remaining).toBeNull();
  });

  test("기기 토큰 해제가 실패해도 탈퇴는 그대로 진행된다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-failure": "device-token" });

    await page.goto(WITHDRAW_PATH);
    await openWithdrawConfirm(page);
    await page.getByRole("button", { name: "탈퇴하기" }).click();

    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
    await expect(page.getByRole("heading", { name: /놓친 만큼 찾아드립니다/ })).toBeVisible({
      timeout: 15000,
    });
  });
});

test("사정사 마이페이지 메뉴의 회원 탈퇴를 누르면 탈퇴 안내가 보인다", async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
  await page.goto(PARTNER_MYPAGE_PATH);
  await expect(
    page.getByRole("heading", { level: 1, name: "내 정보" }).filter({ visible: true }),
  ).toBeVisible({ timeout: 15000 });

  await clickWithdrawEntry(page);

  await expect(page.getByRole("heading", { level: 1, name: "회원 탈퇴" })).toBeVisible();
  await expect(page.getByRole("button", { name: "회원 탈퇴" })).toBeVisible();
});
