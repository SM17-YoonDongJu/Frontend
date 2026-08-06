import { expect, test, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { clickChatHeaderAction, openChatHeaderMenu } from "./_chat-header-helpers";

/**
 * 채팅방 신고 E2E (이슈 #244).
 * 원칙: 핵심 사용자 흐름만 — 신고 접수(고객·파트너 공통), 노출 조건 회귀 가드, 실패 후 재제출.
 * 응답은 기본 MSW 핸들러가 제공(항상 201 접수, 중복 제한 없음). 실패는 x-mock-failure=chat-report로 500 강제
 * (MSW 워커가 fetch를 가로채 page.route 불가 — repo 표준 주입 방식).
 * 회귀 가드: 신고 항목은 roomStatus(CLOSED 포함)·뷰포트와 무관하게 헤더 "더보기"에 항상 있어야 한다.
 * 정적 위임(미테스트): reason enum·reasonDetail 500자 제한 등 형식 검증은 zod·TS가 강제.
 */

const ROOM_1 = "e1000000-0000-4000-8000-000000000001";
const CUSTOMER_ROOM = `/customer/chat/${ROOM_1}`;
const PARTNER_ROOM = `/partner/chat/${ROOM_1}`;

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const DIALOG_TITLE = "이 대화를 신고할까요?";
const SUCCESS_TOAST = "신고가 접수됐어요. 운영팀이 확인 후 안내드릴게요.";
const FAIL_MESSAGE = "신고 접수에 실패했어요. 잠시 후 다시 시도해 주세요.";
const DETAIL_TEXT = "상담 중 반복적인 욕설이 있었습니다.";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

/** 헤더 "더보기"를 열고 `신고` 항목을 눌러 다이얼로그를 연다. */
async function openReportDialog(page: Page) {
  const dialog = page.getByRole("dialog", { name: DIALOG_TITLE });

  await clickChatHeaderAction(page, "신고");
  await expect(dialog).toBeVisible();

  return dialog;
}

/** 사유는 사용자처럼 라벨(카드)을 눌러 고른다 — 라디오 자체는 시각적으로 감춰져 있다. */
async function selectReason(dialog: ReturnType<Page["getByRole"]>, label: string) {
  await dialog.getByText(label, { exact: true }).click();
  await expect(dialog.getByRole("radio", { name: label })).toBeChecked();
}

test("사유를 고르고 신고하면 다이얼로그가 닫히고 접수 안내가 보인다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);

  const dialog = await openReportDialog(page);
  await expect(
    dialog.getByText("신고 내용은 운영팀만 확인하며, 상대방에게는 알려지지 않아요."),
  ).toBeVisible();

  await selectReason(dialog, "욕설·비방·괴롭힘");
  await dialog.getByRole("button", { name: "신고하기" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(SUCCESS_TOAST).first()).toBeVisible();
});

test("사유를 고르지 않으면 신고하기 버튼을 누를 수 없다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);

  const dialog = await openReportDialog(page);
  await expect(dialog.getByRole("button", { name: "신고하기" })).toBeDisabled();

  await selectReason(dialog, "사기 의심");
  await expect(dialog.getByRole("button", { name: "신고하기" })).toBeEnabled();
});

test("기타를 고르면 상세 사유를 적어야 신고할 수 있다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);

  const dialog = await openReportDialog(page);
  const submit = dialog.getByRole("button", { name: "신고하기" });
  const detail = dialog.getByLabel(/상세 사유/);

  await selectReason(dialog, "기타");
  await expect(submit).toBeDisabled();

  await detail.fill("   ");
  await expect(submit).toBeDisabled();

  await detail.fill(DETAIL_TEXT);
  await expect(submit).toBeEnabled();
});

test("접수에 실패하면 입력값이 남은 채 안내가 뜨고 다시 보내면 접수된다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.setExtraHTTPHeaders({ "x-mock-failure": "chat-report" });
  await page.goto(CUSTOMER_ROOM);

  const dialog = await openReportDialog(page);
  await selectReason(dialog, "개인정보 침해");
  await dialog.getByLabel(/상세 사유/).fill(DETAIL_TEXT);
  await dialog.getByRole("button", { name: "신고하기" }).click();

  // 다이얼로그는 열린 채 인라인 안내 + 입력값 보존(재제출 가능)
  await expect(dialog.getByRole("alert")).toHaveText(FAIL_MESSAGE);
  await expect(dialog.getByRole("radio", { name: "개인정보 침해" })).toBeChecked();
  await expect(dialog.getByLabel(/상세 사유/)).toHaveValue(DETAIL_TEXT);

  // 실패 주입을 걷어내고 그대로 재제출 → 접수 성공
  await page.setExtraHTTPHeaders({});
  await dialog.getByRole("button", { name: "신고하기" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(SUCCESS_TOAST).first()).toBeVisible();
});

test("같은 방을 연달아 두 번 신고해도 매번 접수된다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);

  for (const reason of ["스팸·광고", "사기 의심"]) {
    const dialog = await openReportDialog(page);
    await selectReason(dialog, reason);
    await dialog.getByRole("button", { name: "신고하기" }).click();

    // 닫힘 = 성공(실패면 인라인 안내와 함께 열린 채로 남는다)
    await expect(dialog).toBeHidden();
    await expect(page.getByText(FAIL_MESSAGE)).toHaveCount(0);
  }

  await expect(page.getByText(SUCCESS_TOAST).first()).toBeVisible();
});

test("상담이 종료된 방에서도 신고 항목은 그대로 남는다", async ({ page }) => {
  // 매칭 거절은 데스크톱 더보기에서 뺐다(팀 결정) — 모바일 뷰포트로 방을 종료시킨다.
  await page.setViewportSize(MOBILE);
  await page.goto(CUSTOMER_ROOM);

  const menu = await openChatHeaderMenu(page);
  await expect(menu.getByRole("menuitem", { name: "신고" })).toBeVisible();

  // 매칭 거절로 방을 종료(roomStatus CLOSED) — 매칭 액션은 사라져도 신고는 남아야 한다
  // 하이드레이션 전 클릭 유실 가드(openReportDialog와 동일 패턴)
  const rejectDialog = page.getByRole("dialog");
  await expect(async () => {
    await menu.getByRole("menuitem", { name: "매칭 거절" }).click();
    await expect(rejectDialog).toBeVisible();
  }).toPass({ timeout: 10000 });
  await rejectDialog.getByRole("button", { name: "매칭 거절" }).click();
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toBeDisabled();

  const dialog = await openReportDialog(page);
  await selectReason(dialog, "스팸·광고");
  await dialog.getByRole("button", { name: "신고하기" }).click();
  await expect(dialog).toBeHidden();
});

test("파트너 방에서도 상대를 신고할 수 있다", async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
  await page.setViewportSize(DESKTOP);
  await page.goto(PARTNER_ROOM);

  const dialog = await openReportDialog(page);
  await selectReason(dialog, "스팸·광고");
  await dialog.getByRole("button", { name: "신고하기" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(SUCCESS_TOAST).first()).toBeVisible();
});

test("모바일에서도 같은 더보기 항목으로 신고할 수 있다", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(CUSTOMER_ROOM);

  const dialog = await openReportDialog(page);
  await selectReason(dialog, "욕설·비방·괴롭힘");
  await dialog.getByRole("button", { name: "신고하기" }).click();
  await expect(dialog).toBeHidden();
});
