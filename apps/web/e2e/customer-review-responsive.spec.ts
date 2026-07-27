import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 고객 리뷰 작성 화면 반응형 E2E (이슈 #76).
 *
 * 원칙: 사용자 행동·룩 회귀. 모바일(앱바·풀폭 버튼·30일 안내) / 데스크톱(브레드크럼·확정 보상금·2버튼).
 * + done 새로고침 fallback(스냅샷 유실 시 상세로 복귀) 가드.
 * 응답은 기본 MSW 핸들러(test-id-123 = 종결 CLOSED, offeredAmount 850만 원).
 * 뷰포트는 각 describe에서 명시 고정해 3개 프로젝트에서 동일 통과.
 */

const REVIEW_PATH = "/customer/report/test-id-123/review";
const DONE_PATH = "/customer/report/test-id-123/review/done";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test.describe("모바일 뷰(454px)", () => {
  test.use({ viewport: { width: 454, height: 900 } });

  test("리뷰 작성에 진입하면 앱바·풀폭 등록 버튼·30일 안내가 보인다", async ({ page }) => {
    await page.goto(REVIEW_PATH);

    // 모바일 앱바: 뒤로
    await expect(page.getByRole("link", { name: "뒤로" })).toBeVisible();

    // 폼 본문
    await expect(page.getByRole("heading", { name: "사건이 잘 마무리되었나요?" })).toBeVisible();

    // 풀폭 등록 버튼 + 30일 안내(모바일 전용)
    await expect(page.getByRole("button", { name: "리뷰 등록" })).toBeVisible();
    await expect(page.getByText(/30일 내 수정·삭제/)).toBeVisible();
  });
});

test.describe("데스크톱 뷰(1280px)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("리뷰 작성에 진입하면 브레드크럼·확정 보상금·2버튼이 보인다", async ({ page }) => {
    await page.goto(REVIEW_PATH);

    // 브레드크럼(데스크톱 전용)
    const breadcrumb = page.getByRole("navigation", { name: "위치" });
    await expect(breadcrumb.getByText("내 분석 리포트")).toBeVisible();

    // 사건 요약 카드 확정 보상금(데스크톱 전용 · offeredAmount 8,500,000 → 850만 원)
    await expect(page.getByText("확정 보상금")).toBeVisible();
    await expect(page.getByText("850만 원")).toBeVisible();

    // 우측 2버튼: 나중에 쓰기 + 리뷰 등록
    await expect(page.getByRole("link", { name: "나중에 쓰기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "리뷰 등록" })).toBeVisible();
  });
});

test("완료 화면을 스냅샷 없이 직접 열면 리포트 상세로 되돌아간다", async ({ page }) => {
  // done은 등록 응답 스냅샷(sessionStorage)에 의존 — 새로고침·직접진입 시 유실되어 상세로 fallback
  await page.goto(DONE_PATH);
  await expect(page).toHaveURL(/\/customer\/report\/test-id-123$/);
});
