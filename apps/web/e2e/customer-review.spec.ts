import { expect, test } from "@playwright/test";

/**
 * 고객 → 손해사정사 리뷰 등록 E2E (happy-path CUJ, 이슈 #76).
 *
 * 원칙(메모리 fe-e2e-strategy): 핵심 사용자 흐름·통합 happy-path만. 응답은 앱 내장 MSW가 제공.
 * 데이터: DASHBOARD_PROPOSABLE_REPORT_ID(안정 uuid) = 종결(CLOSED) 샘플 — 상세 응답이 같은 uuid를
 *   그대로 echo하므로 상세 CTA(report.reportId 링크)→작성 클릭스루가 목에서 성립. /users/me nickname="윤서"(→ "윤*").
 * 정적 위임(미테스트): DUPLICATE_RESOURCE 409 인라인 alert는 MSW가 adjusterId(매 조회 랜덤 uuid)별로 키잉해
 *   UI로 중복을 강제할 수 없음 → 핸들러 409 분기 + resolveErrorMessage + 인라인 role=alert는 1차 데이터
 *   경계검증 + 정적 레이어에 위임.
 */

const CLOSED_REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DETAIL_PATH = `/customer/report/${CLOSED_REPORT_ID}`;

test.use({ viewport: { width: 1280, height: 900 } });

test("종결(CLOSED) 리포트 상세에서 리뷰 남기기로 진입해 별점·후기를 등록하면 완료 화면이 뜬다", async ({
  page,
}) => {
  await page.goto(DETAIL_PATH);

  // 상세 CLOSED 게이트 → CTA 노출 → 클릭스루로 작성 화면 진입
  const enterCta = page.getByRole("link", { name: "리뷰 남기기" });
  await expect(enterCta).toBeVisible();
  await expect(async () => {
    await enterCta.click();
    await expect(page).toHaveURL(/\/review$/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByRole("heading", { name: "사건이 잘 마무리되었나요?" })).toBeVisible();

  // 별점 선택 전 → 등록 비활성
  const submit = page.getByRole("button", { name: "리뷰 등록" });
  await expect(submit).toBeDisabled();
  await expect(page.getByText("선택 전")).toBeVisible();

  // 별점 5점 선택 → 활성
  await page.getByRole("radio", { name: "5점 중 5점" }).click();
  await expect(page.getByText("5점")).toBeVisible();

  // 후기 입력
  await page
    .getByRole("textbox", { name: "자세한 후기" })
    .fill("근거를 약관·판례로 짚어주셔서 믿음이 갔습니다. 진행 상황도 매번 설명해 주셨어요.");

  await expect(submit).toBeEnabled();
  await expect(async () => {
    await submit.click();
    await expect(page).toHaveURL(/\/review\/done$/);
  }).toPass({ timeout: 10000 });

  // 완료 화면: 마스킹 닉네임 + 후기 미리보기 + 이동 링크
  await expect(page.getByRole("heading", { name: "리뷰가 등록되었어요" })).toBeVisible();
  await expect(page.getByText("윤* 님")).toBeVisible();
  await expect(page.getByText("근거를 약관·판례로 짚어주셔서")).toBeVisible();
  await expect(page.getByRole("link", { name: "내 리포트로" })).toBeVisible();
  await expect(page.getByRole("link", { name: "홈으로" })).toBeVisible();
});
