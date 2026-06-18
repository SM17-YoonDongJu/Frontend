import { expect, test } from "@playwright/test";

/**
 * 고객 손해사정 요청 퍼널 E2E.
 *
 * 원칙(빅테크/공식 가이드):
 * - 격리: 각 테스트는 fresh navigation으로 독립 실행(Playwright/Google).
 * - 사용자 중심: role·text·placeholder로 접근, 구현 세부 의존 금지(Testing Library).
 * - auto-wait: 고정 sleep 없이 web-first assertion(toBeVisible) 사용 — flaky 회피.
 * - 데이터 통제: 응답은 MSW가 결정적으로 제공(랜덤 실패하는 업로드는 선택 단계라 happy-path에서 생략).
 */

const PATH = "/customer/adjust-request";

/** step1~6을 사용자 행동대로 채워 제출 직전까지 진행. */
async function fillThroughConsent(page: import("@playwright/test").Page) {
  // step1 사고 유형 — 실손 의료비만 활성.
  // 하이드레이션 전 클릭 유실 방지: 선택될 때까지 재시도(toPass).
  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await expect(async () => {
    await medicalCard.click();
    await expect(medicalCard).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: /다음/ }).click();

  // step2 치료 정보
  await expect(page.getByRole("heading", { name: "어떤 치료를 받으셨나요?" })).toBeVisible();
  await page.getByRole("button", { name: "통원", exact: true }).click();
  await page.getByPlaceholder("예) 우측 슬관절 골절").fill("우측 슬관절 골절");
  await page.getByRole("button", { name: "포함", exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step3 사고 일자 — 달력에서 날짜 선택
  await expect(page.getByRole("heading", { name: "언제 있었던 일인가요?" })).toBeVisible();
  await page.getByRole("button", { name: "사고 발생일 선택" }).click();
  await page.getByText("15", { exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step4 보험금 — 미제안 선택(숫자 입력 생략)
  await expect(page.getByRole("heading", { name: "제안받은 보험금이 있나요?" })).toBeVisible();
  await page.getByText("아직 제안받지 않았어요").click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step5 서류 업로드 — 선택 단계, 생략
  await expect(page.getByRole("heading", { name: "관련 서류를 올려주세요" })).toBeVisible();
  await page.getByRole("button", { name: /다음/ }).click();

  // step6 확인
  await expect(page.getByRole("heading", { name: "분석 준비가 끝났어요" })).toBeVisible();
}

test("빈 상태에서 모든 단계를 거쳐 분석 요청을 제출하면 완료 화면이 보인다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "어떤 사고인가요?" })).toBeVisible();

  await fillThroughConsent(page);

  // 동의 2개 체크해야 제출 가능
  await page.getByText("민감정보").click();
  await page.getByText("법적 효력이 없음").click();
  await page.getByRole("button", { name: /분석 요청/ }).click();

  // 제출 성공 → 완료 화면(MSW가 reportId·status 반환)
  await expect(page.getByRole("heading", { name: "분석 요청이 접수됐어요" })).toBeVisible();
  await expect(page.getByText("검수 대기 중")).toBeVisible();
});

test("동의하지 않으면 제출되지 않고 확인 단계에 머문다", async ({ page }) => {
  await page.goto(PATH);
  await fillThroughConsent(page);

  await page.getByRole("button", { name: /분석 요청/ }).click();

  // 완료 화면으로 못 넘어가고 동의 에러 노출
  await expect(page.getByRole("heading", { name: "분석 준비가 끝났어요" })).toBeVisible();
  await expect(page.getByText("민감정보 처리에 동의해 주세요.")).toBeVisible();
});

test("선행 단계 미완 상태로 ?step 직접 진입하면 첫 미완 단계로 돌아간다", async ({ page }) => {
  await page.goto(`${PATH}?step=5`);
  // 가드가 step1로 redirect
  await expect(page.getByRole("heading", { name: "어떤 사고인가요?" })).toBeVisible();
});

test("필수값 미입력 시 다음 단계로 진행되지 않는다", async ({ page }) => {
  await page.goto(PATH);
  // 사고 유형 미선택 상태로 다음 클릭
  await page.getByRole("button", { name: /다음/ }).click();
  // 여전히 step1
  await expect(page.getByRole("heading", { name: "어떤 사고인가요?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "어떤 치료를 받으셨나요?" })).toBeHidden();
});

test("새로고침하면 임시저장된 입력이 복원된다", async ({ page }) => {
  await page.goto(PATH);
  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await expect(async () => {
    await medicalCard.click();
    await expect(medicalCard).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: /다음/ }).click();
  await expect(page.getByRole("heading", { name: "어떤 치료를 받으셨나요?" })).toBeVisible();

  await page.reload();

  // draft 복원 + 가드 통과로 step2 유지
  await expect(page.getByRole("heading", { name: "어떤 치료를 받으셨나요?" })).toBeVisible();
});
