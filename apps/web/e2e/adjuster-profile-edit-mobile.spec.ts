import { expect, test } from "@playwright/test";

/**
 * 손해사정사 프로필 수정 모바일 반응형 E2E (이슈 #75, 커밋 11).
 *
 * 원칙: 핵심 사용자 흐름만 — 모바일 앱바 노출 / PreviewCard 숨김 /
 *       sticky 저장 CTA로 저장 성공 / 전문분야 chip 토글 / 대표 이력 추가·삭제.
 * 응답은 기본 MSW 핸들러(GET·PATCH /adjusters/me/profile)가 제공.
 * 뷰포트는 Figma 기준 402px로 고정(프로젝트 device와 무관하게 <lg 레이아웃 강제).
 * 저가치 엣지(글자수·형식·이탈 경고 등)는 zod·TS 정적 레이어에 위임(미테스트).
 */

const PATH = "/partner/profile/edit";
const HEADLINE_PLACEHOLDER = "예) 후유장해 재산정 전문 · 근거 중심 검토";

test.use({ viewport: { width: 402, height: 874 } });

test("모바일로 진입하면 앱바가 보이고 데스크톱 미리보기·헤더는 숨는다", async ({ page }) => {
  await page.goto(PATH);

  // 모바일 앱바
  await expect(page.getByRole("button", { name: "뒤로 가기" })).toBeVisible();
  await expect(page.getByText("프로필 관리")).toBeVisible();
  await expect(page.getByRole("button", { name: "미리보기" })).toBeVisible();

  // 데스크톱 전용은 숨김: breadcrumb h1 "프로필 수정" 헤딩, "저장하기" 버튼, 우측 PreviewCard
  await expect(page.getByRole("heading", { level: 1, name: "프로필 수정" })).toBeHidden();
  await expect(page.getByRole("button", { name: "저장하기" })).toBeHidden();
  await expect(page.getByText("검색 카드 미리보기")).toBeHidden();

  // 모바일 인증 칩·저장 CTA
  await expect(page.getByText("자격 인증 완료 · 등록번호 제0000호")).toBeVisible();
  await expect(page.getByRole("button", { name: "공개 프로필 저장" })).toBeVisible();
});

test("sticky 저장 CTA로 변경 내용을 저장하면 성공 안내가 보인다", async ({ page }) => {
  await page.goto(PATH);

  const save = page.getByRole("button", { name: "공개 프로필 저장" });
  await expect(save).toBeDisabled(); // 진입 직후 isDirty=false

  await page.getByPlaceholder(HEADLINE_PLACEHOLDER).fill("후유장해 재산정 전문 검토");
  await expect(save).toBeEnabled();

  await expect(async () => {
    await save.click();
    await expect(page.getByText("프로필을 저장했어요.")).toBeVisible();
  }).toPass({ timeout: 10000 });
});

test("전문분야 chip을 눌러 선택·해제한다", async ({ page }) => {
  await page.goto(PATH);

  // 모바일 전용 라벨 노출
  await expect(page.getByText("(중복 선택)")).toBeVisible();

  const chip = page.getByRole("button", { name: "실손 의료비", pressed: false });
  await expect(async () => {
    await chip.click();
    await expect(page.getByRole("button", { name: "실손 의료비", pressed: true })).toBeVisible();
  }).toPass({ timeout: 10000 });

  // 다시 눌러 해제
  await page.getByRole("button", { name: "실손 의료비", pressed: true }).click();
  await expect(page.getByRole("button", { name: "실손 의료비", pressed: false })).toBeVisible();
});

test("대표 이력을 추가했다가 확인 절차로 삭제한다", async ({ page }) => {
  await page.goto(PATH);

  await expect(async () => {
    await page.getByRole("button", { name: "경력 추가" }).click();
    await expect(page.getByRole("textbox", { name: "경력 3 기간" })).toBeVisible();
  }).toPass({ timeout: 10000 });

  await page.getByRole("textbox", { name: "경력 3 기간" }).fill("2024 ~ 현재");
  await page.getByRole("textbox", { name: "경력 3 내용" }).fill("테스트 법인");

  await page.getByRole("button", { name: "경력 3 삭제" }).click();
  const dialog = page.getByRole("dialog", { name: "이 경력을 삭제할까요?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "삭제" }).click();

  await expect(page.getByRole("textbox", { name: "경력 3 기간" })).toHaveCount(0);
});
