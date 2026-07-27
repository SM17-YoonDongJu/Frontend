import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 손해사정사 검수 흐름 E2E (happy-path CUJ).
 *
 * 원칙(메모리 fe-e2e-strategy): 핵심 사용자 흐름·통합 happy-path만.
 * 엣지/검증은 RTL+MSW 통합테스트 영역. 응답은 앱 내장 MSW가 제공.
 *
 * 흐름: 검수 대기 목록 → 카드 선택 → 검수 시작(상세 진입) → 쟁점 인정/수정/제외(진행·카운트 즉시 갱신)
 *       → 종합의견 입력 → 검수 완료·고객 전송(PATCH status=AWAITING_ADOPTION) → 전송 완료 화면.
 *       + 임시저장 자동 복원 / 초안 되돌리기 확인.
 */

const LIST_PATH = "/partner/review";
// MSW 상세 핸들러는 어떤 reportId든 동일 리치 데이터를 반환 → 상세 직접 진입에 사용.
const DETAIL_PATH = "/partner/review/11111111-1111-4111-8111-111111111111";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
});

test("대기 목록에서 검수를 시작하면 상세로 진입한다", async ({ page, isMobile }) => {
  await page.goto(LIST_PATH);

  // #94 반응형: 모바일은 카드의 검수 링크로, 데스크톱은 카드 선택 → 프리뷰 패널의 검수 시작으로 진입.
  const firstCard = page
    .getByRole("listitem")
    .filter({ hasText: /우측 슬관절 인대 파열/ });
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    if (isMobile) {
      await firstCard.getByRole("link", { name: /검수/ }).click();
    } else {
      await firstCard.click();
      await page.getByRole("button", { name: /검수 시작/ }).click();
    }
    await expect(page).toHaveURL(/\/partner\/review\/[0-9a-f-]{36}/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "후유장해 등급 재산정" })).toBeVisible();
});

test("쟁점을 인정·수정·제외하면 진행현황과 카운트가 즉시 갱신되고, 검수 완료 시 고객 전송된다", async ({
  page,
}) => {
  await page.goto(DETAIL_PATH);
  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();

  const board = page.getByRole("listitem").filter({ hasText: "후유장해 등급 재산정" });
  const board2 = page.getByRole("listitem").filter({ hasText: "입원 일당 미반영분" });
  const board3 = page.getByRole("listitem").filter({ hasText: "외모변형 장해 특약 적용" });

  await expect(page.getByText("0/3")).toBeVisible();

  await board.getByRole("radio", { name: "인정" }).click();
  await expect(page.getByText("1/3")).toBeVisible();

  await board2.getByRole("radio", { name: "수정" }).click();
  await expect(page.getByText("2/3")).toBeVisible();

  await board3.getByRole("radio", { name: "제외" }).click();
  await expect(page.getByText("3/3")).toBeVisible();

  const progressCard = page
    .getByRole("region")
    .filter({ has: page.getByRole("heading", { name: "검수 진행" }) })
    .or(page.locator("section").filter({ hasText: "검수 진행" }));
  await expect(progressCard.getByText("1건").first()).toBeVisible();

  await page
    .getByRole("textbox", { name: "손해사정사 종합 의견" })
    .fill("검토 결과 후유장해 등급 재산정 여지가 있어 보완 자료 확보를 권합니다.");
  await expect(page.getByText("첨부됨")).toBeVisible();

  const completeButton = page.getByRole("button", { name: "검수 완료 · 고객 전송" });
  await expect(completeButton).toBeEnabled();

  const patchRequest = page.waitForRequest(
    (req) => req.method() === "PATCH" && /\/reports\/[^/]+$/.test(req.url()),
  );

  await completeButton.click();

  const req = await patchRequest;
  // fetch 레이어가 camel→snake 변환해 전송 → 와이어 바디는 snake_case.
  const body = req.postDataJSON() as {
    status?: string;
    review?: string;
    issues?: { issue_id?: string | null; review_status?: string }[];
  };
  // status는 서버가 파생 — 클라이언트 전송 금지(#130).
  expect(body).not.toHaveProperty("status");
  expect(Array.isArray(body.issues)).toBe(true);
  expect(body.issues?.length).toBe(3);
  expect(body.issues?.[0]).toHaveProperty("issue_id");
  expect(body.issues?.[0]).toHaveProperty("review_status");
  expect(body.review).toContain("후유장해");

  await expect(
    page.getByRole("heading", { name: "검수 리포트를 고객에게 전송했습니다" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "검수 대기 목록으로" })).toBeVisible();
});

test("작성 중 새로고침하면 임시저장된 내용을 이어서 작성할 수 있다", async ({ page }) => {
  await page.goto(DETAIL_PATH);
  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();

  // 쟁점 1 인정 → 진행 1/3
  const board = page.getByRole("listitem").filter({ hasText: "후유장해 등급 재산정" });
  await board.getByRole("radio", { name: "인정" }).click();
  await expect(page.getByText("1/3")).toBeVisible();

  // 자동 저장(500ms debounce) 반영 대기 후 새로고침
  await page.waitForTimeout(800);
  await page.reload();

  // 복원 안내 팝업 → 이어서 작성
  await expect(
    page.getByRole("heading", { name: "임시저장된 검수 내용이 있어요" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "이어서 작성" }).click();

  // 인정 상태(진행 1/3) 복원
  await expect(page.getByText("1/3")).toBeVisible();
});

test("검토·의견 없이 전송하면 확인 안내가 뜨고 전송되지 않는다", async ({ page }) => {
  await page.goto(DETAIL_PATH);
  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();

  // 아무것도 안 한 상태에서 바로 전송
  await page.getByRole("button", { name: "검수 완료 · 고객 전송" }).click();

  await expect(page.getByText(/전송 전 확인/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "검수 리포트를 고객에게 전송했습니다" }),
  ).toHaveCount(0);
});

test("초안으로 되돌리기는 확인 후에만 작성 내용을 비운다", async ({ page }) => {
  await page.goto(DETAIL_PATH);
  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();

  const board = page.getByRole("listitem").filter({ hasText: "후유장해 등급 재산정" });
  await board.getByRole("radio", { name: "인정" }).click();
  await expect(page.getByText("1/3")).toBeVisible();

  // 되돌리기 → 확인 다이얼로그
  await page.getByRole("button", { name: "초안으로 되돌리기" }).click();
  await expect(page.getByRole("heading", { name: "초안으로 되돌릴까요?" })).toBeVisible();

  // 확인 → 진행 0/3로 초기화
  await page.getByRole("button", { name: "되돌리기", exact: true }).click();
  await expect(page.getByText("0/3")).toBeVisible();
});
