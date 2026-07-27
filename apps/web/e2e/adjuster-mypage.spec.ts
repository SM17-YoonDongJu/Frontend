import { expect, test } from "@playwright/test";

/**
 * 손해사정사 마이페이지 E2E (이슈 #46).
 *
 * 원칙: 핵심 사용자 흐름만 — 헤더 진입 / 섹션 렌더 / 메뉴 이동 /
 *       알림 설정 저장·실패 / 모바일 알림 페이지 / 증빙 모달.
 * 응답은 기본 MSW 핸들러(GET /adjusters/me/mypage, GET·PATCH /users/me/notification-settings)가 제공.
 * 저장 실패는 x-mock-failure 헤더(setExtraHTTPHeaders)로 핸들러 500을 강제.
 * 필드 형식·null 표기("-") 분기는 zod·TS에 위임(의식적 미테스트).
 * 헤더 진입·알림 모달은 데스크톱 전용 UI라 "PC" 블록에서 뷰포트를 고정
 * (CI mobile-chrome/mobile-safari 프로젝트에서도 동일 조건으로 돌기 위함).
 */

const PATH = "/partner/mypage";

test.describe("PC", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("헤더 프로필을 누르면 마이페이지로 이동하고 모든 섹션이 보인다", async ({ page }) => {
    await page.goto("/partner");

    const profileLink = page.getByRole("link", { name: /김상정 사정사/ });
    await expect(async () => {
      await profileLink.click();
      await expect(page).toHaveURL(/\/partner\/mypage$/);
    }).toPass({ timeout: 10000 });

    await expect(page.getByRole("heading", { level: 1, name: "내 정보" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /김상정 손해사정사/ })).toBeVisible();
    await expect(page.getByText("자격 인증")).toBeVisible();

    // 통계 카드 3장 (값 "240건"은 메뉴 서브텍스트와 겹쳐 라벨로 검증)
    await expect(page.getByText("평점", { exact: true })).toBeVisible();
    await expect(page.getByText("누적 검수", { exact: true })).toBeVisible();
    await expect(page.getByText("62%")).toBeVisible();

    // 이번 달 활동
    await expect(page.getByRole("heading", { name: "이번 달 활동" })).toBeVisible();
    await expect(page.getByText("9건")).toBeVisible();
  });
});

test("프로필 관리를 누르면 프로필 수정 화면으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const row = page.getByRole("link", { name: /프로필 관리/ });
  await expect(async () => {
    await row.click();
    await expect(page).toHaveURL(/\/partner\/profile\/edit/);
  }).toPass({ timeout: 10000 });
});

test("검수 내역(240건)을 누르면 검수 대기 화면으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const row = page.getByRole("link", { name: /검수 내역/ });
  await expect(row).toContainText("240건");
  await expect(async () => {
    await row.click();
    await expect(page).toHaveURL(/\/partner\/review/);
  }).toPass({ timeout: 10000 });
});

test("전문 분야·자격 관리 메뉴는 없다(화면정의서 4번 제외)", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { level: 1, name: "내 정보" })).toBeVisible();
  await expect(page.getByText("전문 분야 · 자격")).toHaveCount(0);
});

test.describe("PC 알림 설정 모달", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("알림 설정 모달에서 토글을 바꿔 저장하면 모달이 닫힌다", async ({ page }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("button", { name: "알림 설정" }).click();
      await expect(page.getByRole("dialog", { name: "알림 설정" })).toBeVisible();
    }).toPass({ timeout: 10000 });

    const dialog = page.getByRole("dialog", { name: "알림 설정" });
    for (const label of [/새 검수 요청/, /고객 상담 신청/, /정산 · 공지/]) {
      await expect(dialog.getByRole("switch", { name: label })).toBeVisible();
    }

    const settlement = dialog.getByRole("switch", { name: /정산 · 공지/ });
    await settlement.click();
    await expect(settlement).toHaveAttribute("aria-checked", "true");

    await dialog.getByRole("button", { name: "저장하기" }).click();
    await expect(dialog).toBeHidden();
  });

  test("알림 설정 저장이 실패하면 오류 메시지가 보이고 모달은 유지된다", async ({ page }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("button", { name: "알림 설정" }).click();
      await expect(page.getByRole("dialog", { name: "알림 설정" })).toBeVisible();
    }).toPass({ timeout: 10000 });

    const dialog = page.getByRole("dialog", { name: "알림 설정" });
    await dialog.getByRole("switch", { name: /정산 · 공지/ }).click();

    // 조회는 성공한 뒤, 저장(PATCH)만 실패하도록 헤더 주입
    await page.setExtraHTTPHeaders({ "x-mock-failure": "notification-settings" });
    await dialog.getByRole("button", { name: "저장하기" }).click();

    await expect(dialog.getByText("저장하지 못했어요. 잠시 후 다시 시도해 주세요.")).toBeVisible();
    await expect(dialog).toBeVisible();
  });
});

test("인증·자격 증빙 모달을 열면 인증 정보가 보이고 닫힌다", async ({ page }) => {
  await page.goto(PATH);

  await expect(async () => {
    await page.getByRole("button", { name: /인증 · 자격 증빙/ }).click();
    await expect(page.getByRole("dialog", { name: "인증 · 자격 증빙" })).toBeVisible();
  }).toPass({ timeout: 10000 });

  const dialog = page.getByRole("dialog", { name: "인증 · 자격 증빙" });
  await expect(dialog.getByText("자격 인증 완료")).toBeVisible();
  await expect(dialog.getByText("제2014-0087호")).toBeVisible();
  await expect(dialog.getByText("금감원 등록확인서.pdf · 0.8MB")).toBeVisible();

  await dialog.getByRole("button", { name: "닫기" }).click();
  await expect(dialog).toBeHidden();
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("알림 설정을 누르면 별도 설정 페이지로 이동하고 뒤로 돌아온다", async ({ page }) => {
    await page.goto(PATH);

    const row = page.getByRole("link", { name: "알림 설정" });
    await expect(async () => {
      await row.click();
      await expect(page).toHaveURL(/\/partner\/mypage\/notifications/);
    }).toPass({ timeout: 10000 });

    await expect(page.getByRole("heading", { name: "알림 설정" })).toBeVisible();
    await expect(page.getByRole("switch", { name: /새 검수 요청/ })).toBeVisible();

    await page.getByRole("button", { name: "취소" }).click();
    await expect(page).toHaveURL(/\/partner\/mypage$/);
  });
});
