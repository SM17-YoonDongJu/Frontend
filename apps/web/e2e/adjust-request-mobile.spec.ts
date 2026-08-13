import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { attachRequiredDocuments } from "./_adjust-request-helpers";

/**
 * 손해사정 요청 퍼널 모바일 뷰포트(375) happy-path E2E (이슈 #55).
 * 원칙: 핵심 사용자 흐름만 — 모바일 폭에서 7단계를 끝까지 채워 제출/완료.
 *   모바일 디자인 적용으로 바뀐 UI 세 지점을 사용자 행동으로 커버한다:
 *   ① 진단명 복수 입력(추가/삭제) → 단일 diagnosis 문자열로 직렬화·복원,
 *   ② 가입 보험·특약 입력이 step2→step4로 이동,
 *   ③ 전할 말(step5) 자유 입력 → 확인 단계 요약 반영(이슈 #121).
 * 응답은 기본 MSW 핸들러가 제공(reportId·status 반환). 필드 형식 검증은 zod·TS에 위임(미테스트).
 */

const PATH = "/customer/adjust-request";

test.use({ viewport: { width: 375, height: 812 } });

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("모바일 폭에서 진단명 여러 개와 가입보험을 입력해 끝까지 제출하면 완료 화면이 보인다", async ({
  page,
}) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "어떤 사고인가요?" })).toBeVisible();

  // 잠긴 유형 탭 → 지원 예정 툴팁(터치 환경 안내, 이슈 #144)
  await page.getByText("교통사고").click({ force: true });
  await expect(page.getByRole("tooltip")).toHaveText("추후에 지원 예정입니다.");

  // step1 사고 유형 — 실손 의료비만 활성(하이드레이션 전 클릭 유실 방지).
  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await expect(async () => {
    await medicalCard.click();
    await expect(medicalCard).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: /다음/ }).click();

  // step2 진단명(복수 입력) + 치료 형태 + 비급여
  await expect(page.getByRole("heading", { name: "어떤 진단을 받으셨나요?" })).toBeVisible();
  const diagnosisInputs = page.getByPlaceholder("예) 우측 슬관절 골절");
  await diagnosisInputs.first().fill("우측 슬관절 골절");
  await page.getByRole("button", { name: "진단명 추가" }).click();
  await diagnosisInputs.nth(1).fill("전방십자인대 파열");
  await page.getByRole("button", { name: "통원", exact: true }).click();
  await page.getByRole("button", { name: "포함", exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step3 사고 일자 — 달력에서 날짜 선택
  await expect(page.getByRole("heading", { name: "언제 있었던 일인가요?" })).toBeVisible();
  await page.getByRole("button", { name: "사고 발생일 선택" }).click();
  await page
    .getByRole("button", { name: /15일|15/ })
    .first()
    .click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step4 보험금 + 가입 보험·특약(step2에서 이동)
  await expect(page.getByRole("heading", { name: "제안받은 보험금이 있나요?" })).toBeVisible();
  await page.getByText("아직 제안받지 않았어요").click();
  await page.getByPlaceholder(/손해보험/).fill("OO손해보험 · 행복드림 종합보험");
  await page.getByRole("button", { name: /다음/ }).click();

  // step5 전할 말 — 선택 입력, 적고 넘어감
  await expect(page.getByRole("heading", { name: "손해사정사에게 전할 말이 있나요?" })).toBeVisible();
  await page
    .getByRole("textbox", { name: "궁금한 점 · 특이사항" })
    .fill("무릎 수술을 두 번 받았는데 두 번 다 보상되는지 궁금해요");
  await page.getByRole("button", { name: /다음/ }).click();

  // step6 서류 업로드 — 필수 서류 첨부 후 진행(이슈 #271)
  await expect(page.getByRole("heading", { name: "관련 서류를 올려주세요" })).toBeVisible();
  await attachRequiredDocuments(page);
  await page.getByRole("button", { name: /다음/ }).click();

  // step7 확인 — 복수 진단명·이동한 가입보험·전할 말이 요약에 반영됨
  await expect(page.getByRole("heading", { name: "분석 준비가 끝났어요" })).toBeVisible();
  await expect(page.getByText("우측 슬관절 골절")).toBeVisible();
  await expect(page.getByText("전방십자인대 파열")).toBeVisible();
  await expect(page.getByText("OO손해보험 · 행복드림 종합보험")).toBeVisible();
  await expect(page.getByText("무릎 수술을 두 번 받았는데 두 번 다 보상되는지 궁금해요")).toBeVisible();

  // 동의 2개 체크 후 제출 → 완료 화면
  await page.getByText("민감정보").click();
  await page.getByText("법적 효력이 없음").click();
  await page.getByRole("button", { name: /분석 요청/ }).click();

  await expect(page.getByRole("heading", { name: "분석 요청이 접수됐어요" })).toBeVisible();
  await expect(page.getByText("검수 대기 중")).toBeVisible();
});
