import { expect, test } from "@playwright/test";

/**
 * 손해사정사 검수 흐름 E2E (happy-path CUJ).
 *
 * 원칙(메모리 fe-e2e-strategy): 핵심 사용자 흐름·통합 happy-path만.
 * 엣지/검증은 RTL+MSW 통합테스트 영역. 응답은 앱 내장 MSW가 제공.
 *
 * 흐름: 검수 대기 목록 → 카드 클릭 상세 진입 → 쟁점 인정/수정/제외(진행·카운트 즉시 갱신)
 *       → 종합의견 입력 → 검수 완료·고객 전송(PATCH status=AWAITING_ADOPTION) → 전송 완료 화면.
 */

const LIST_PATH = "/partner/review";

test("대기 목록에서 카드를 눌러 검수 상세로 진입한다", async ({ page }) => {
  await page.goto(LIST_PATH);

  // 대기 목록 카드 렌더(MSW 4건)
  const firstCard = page.getByRole("link", { name: /교통사고\(후유장해\)/ });
  await expect(firstCard).toBeVisible();

  await firstCard.click();

  // 상세 진입 — 쟁점 보드 렌더
  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "후유장해 등급 재산정" })).toBeVisible();
});

test("쟁점을 인정·수정·제외하면 진행현황과 카운트가 즉시 갱신되고, 검수 완료 시 고객 전송된다", async ({
  page,
}) => {
  // 상세 진입(목록 경유)
  await page.goto(LIST_PATH);
  await page.getByRole("link", { name: /교통사고\(후유장해\)/ }).click();
  await expect(page.getByRole("heading", { name: /쟁점별 검수/ })).toBeVisible();

  const board = page.getByRole("listitem").filter({ hasText: "후유장해 등급 재산정" });
  const board2 = page.getByRole("listitem").filter({ hasText: "입원 일당 미반영분" });
  const board3 = page.getByRole("listitem").filter({ hasText: "외모변형 장해 특약 적용" });

  // 초기 진행현황 0/3
  await expect(page.getByText("0/3")).toBeVisible();

  // 쟁점1 인정
  await board.getByRole("radio", { name: "인정" }).click();
  await expect(page.getByText("1/3")).toBeVisible();

  // 쟁점2 수정 → 수정 폼 노출
  await board2.getByRole("radio", { name: "수정" }).click();
  await expect(page.getByText("2/3")).toBeVisible();

  // 쟁점3 제외 → allReviewed → CTA 활성
  await board3.getByRole("radio", { name: "제외" }).click();
  await expect(page.getByText("3/3")).toBeVisible();

  // 사이드바 카운트(인정 1 / 수정 1 / 제외 1)
  const progressCard = page
    .getByRole("region")
    .filter({ has: page.getByRole("heading", { name: "검수 진행" }) })
    .or(page.locator("section").filter({ hasText: "검수 진행" }));
  await expect(progressCard.getByText("1건").first()).toBeVisible();

  // 종합의견 입력 → 전송요약 "첨부됨"
  await page
    .getByRole("textbox", { name: "손해사정사 종합 의견" })
    .fill("검토 결과 후유장해 등급 재산정 여지가 있어 보완 자료 확보를 권합니다.");
  await expect(page.getByText("첨부됨")).toBeVisible();

  // 검수 완료·고객 전송 → PATCH body 검증
  const completeButton = page.getByRole("button", { name: "검수 완료 · 고객 전송" });
  await expect(completeButton).toBeEnabled();

  const patchRequest = page.waitForRequest(
    (req) => req.method() === "PATCH" && /\/reports\//.test(req.url()),
  );

  await completeButton.click();

  const req = await patchRequest;
  const body = req.postDataJSON() as {
    status?: string;
    review?: string;
    reviewIssues?: unknown[];
  };
  expect(body.status).toBe("AWAITING_ADOPTION");
  expect(Array.isArray(body.reviewIssues)).toBe(true);
  expect(body.review).toContain("후유장해");

  // 전송 완료 화면
  await expect(
    page.getByRole("heading", { name: "검수 리포트를 고객에게 전송했습니다" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "검수 대기 목록으로" })).toBeVisible();
});
