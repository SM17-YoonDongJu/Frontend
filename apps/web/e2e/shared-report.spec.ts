import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { clickChatHeaderAction } from "./_chat-header-helpers";

/**
 * 채팅방 공유 리포트(사정사 검수 결과) E2E — 이슈 #187.
 * 원칙: 핵심 사용자 흐름만 — 상담방에서 리포트 보기 진입 → 사정사 정보·예상 보상 범위·쟁점 열람,
 *   그리고 권한 없음(403)·리포트 미등록(404) 안내.
 * 응답은 앱 내장 MSW 기본 핸들러(쟁점 3건: 인정·수정·사정사 추가)가 제공하고,
 *   에러만 x-mock-failure 헤더로 override한다.
 * 필드 형식·nullable 분기(career null, description null 등)는 zod·TS에 위임(미테스트).
 */

const CUSTOMER_LIST = "/customer/chat";
const ROOM_1 = "e1000000-0000-4000-8000-000000000001";
const SHARED_REPORT_PATH = `${CUSTOMER_LIST}/${ROOM_1}/shared-report`;

const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("상담방에서 리포트 보기를 누르면 공유 리포트로 이동한다", async ({ page }) => {
  // 리포트 보기는 헤더 "더보기" 패널 안(데스크톱·모바일 동일)
  await page.setViewportSize(DESKTOP);
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  await clickChatHeaderAction(page, "리포트 보기");
  await expect(page).toHaveURL(new RegExp(`${ROOM_1}/shared-report`));

  await expect(page.getByText("김도현 손해사정사")).toBeVisible();
});

test("공유 리포트에 사정사 정보와 예상 보상 범위가 보인다", async ({ page }) => {
  await page.goto(SHARED_REPORT_PATH);

  await expect(page.getByText("김도현 손해사정사")).toBeVisible();
  await expect(page.getByText("12년차")).toBeVisible();
  await expect(page.getByText("예상 보상 범위")).toBeVisible();
  await expect(page.getByText("1,400~1,750만원")).toBeVisible();
  await expect(page.getByText("검수 완료")).toBeVisible();
  await expect(page.getByText("사정사 종합 의견")).toBeVisible();
});

test("공유 리포트에 쟁점 목록과 판정이 보인다", async ({ page }) => {
  await page.goto(SHARED_REPORT_PATH);

  await expect(page.getByRole("heading", { name: "주요 쟁점" })).toBeVisible();
  await expect(page.getByText("3건").first()).toBeVisible();

  const first = page
    .getByRole("listitem")
    .filter({ hasText: "장해등급 산정 기준 재검토" });
  await expect(first).toBeVisible();
  await expect(first.getByText("인정")).toBeVisible();
  await expect(first.getByText("+ 약 320만원")).toBeVisible();

  await expect(page.getByText("외모추상 특약 청구 범위")).toBeVisible();
  await expect(page.getByText("휴업손해 미청구 확인")).toBeVisible();

  // 보장·근거 섹션
  await expect(page.getByRole("heading", { name: "적용 가능 보장" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "누락 가능 특약" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "근거 약관·판례" })).toBeVisible();
});

test("참여하지 않은 상담방의 리포트는 권한 안내가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "shared-report-forbidden" });
  await page.goto(SHARED_REPORT_PATH);

  await expect(page.getByText("접근 권한이 없어요")).toBeVisible();
  await expect(
    page.getByText("참여 중인 상담방의 리포트만 볼 수 있어요."),
  ).toBeVisible();
});

test("검수 리포트가 아직 없으면 준비 중 안내가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "shared-report-missing" });
  await page.goto(SHARED_REPORT_PATH);

  await expect(page.getByText("검수 리포트가 아직 없어요")).toBeVisible();
  await expect(
    page.getByText("사정사가 검수를 마치면 여기서 확인할 수 있어요."),
  ).toBeVisible();
});
