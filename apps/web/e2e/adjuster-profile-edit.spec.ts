import { expect, test } from "@playwright/test";

/**
 * 손해사정사 프로필 수정 E2E (happy-path, 이슈 #31).
 *
 * 원칙: 핵심 사용자 흐름만 — 초기값 로드 / 미리보기 실시간 반영 /
 *       전문분야 MAX 가드 / 경력 추가·삭제 / 저장 성공.
 * 응답은 기본 MSW 핸들러(GET·PATCH /adjusters/me/profile)가 제공.
 * 검증·엣지(글자수·형식·이탈 경고 등)는 RTL+MSW 통합테스트 백로그.
 */

const PATH = "/partner/profile/edit";

// 데스크톱(≥lg) 레이아웃 전용 스펙. 프로젝트 device(Pixel 7·iPhone 14)와 무관하게
// 뷰포트를 데스크톱으로 고정한다 — #75 반응형 도입으로 breadcrumb·저장하기·섹션 헤딩·카운터가
// lg 미만에서 hidden 처리되므로, 뷰포트를 고정하지 않으면 모바일 프로젝트에서 오검출된다.
test.use({ viewport: { width: 1280, height: 900 } });

// MSW ADJUSTER_PROFILE 고정값
const HEADLINE_PLACEHOLDER = "예) 후유장해 재산정 전문 · 근거 중심 검토";
const DEFAULT_SPECIALTIES = ["후유장해", "교통사고"]; // 초기 선택 2개

test("진입하면 프로필 초기값이 모두 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { level: 1, name: "프로필 수정" })).toBeVisible();

  // 섹션 헤딩
  for (const section of ["기본 정보", "전문 분야", "주요 경력"]) {
    await expect(page.getByRole("heading", { name: section })).toBeVisible();
  }

  // 활동명(읽기전용) + headline 초기값 — 헤더의 "김상정 사정사" 버튼과 겹치지 않게 본문 문구로
  await expect(page.getByText("김상정 손해사정사")).toBeVisible();
  await expect(page.getByPlaceholder(HEADLINE_PLACEHOLDER)).toHaveValue(
    "후유장해 전문 12년, 거절 사건을 다시 봅니다",
  );

  // 전문분야 칩 초기 선택(aria-pressed)
  for (const label of DEFAULT_SPECIALTIES) {
    await expect(page.getByRole("button", { name: label, pressed: true })).toBeVisible();
  }

  // 주요 경력 초기 항목(기간 입력값)
  await expect(page.getByRole("textbox", { name: "경력 1 기간" })).toHaveValue(
    "2014.03 ~ 2019.02",
  );
});

test("headline을 바꾸면 우측 미리보기 카드에 실시간 반영된다", async ({ page }) => {
  await page.goto(PATH);

  const headline = page.getByPlaceholder(HEADLINE_PLACEHOLDER);
  await headline.fill("교통사고 후유장해 재산정 집중");

  // 미리보기 카드 영역에 입력값이 그대로 노출
  const preview = page
    .getByText("검색 카드 미리보기")
    .locator("xpath=ancestor::div[1]");
  await expect(preview.getByText("교통사고 후유장해 재산정 집중")).toBeVisible();
});

test("전문분야는 최대 3개까지만 선택된다(4번째 차단)", async ({ page }) => {
  await page.goto(PATH);

  // 초기 2개(후유장해·교통사고) → 1개 더 선택해 MAX(3) 도달
  await page.getByRole("button", { name: "실손 의료비", pressed: false }).click();
  await expect(page.getByText("3/3 · 검색 노출에 사용돼요")).toBeVisible();

  // 4번째 미선택 칩은 비활성(pointer-events 차단) → 클릭해도 선택 안 됨
  const fourth = page.getByRole("button", { name: "암", pressed: false });
  await fourth.click({ force: true }).catch(() => {});
  await expect(page.getByRole("button", { name: "암", pressed: false })).toBeVisible();
  await expect(page.getByText("3/3 · 검색 노출에 사용돼요")).toBeVisible();
});

test("경력을 추가했다가 확인 절차로 삭제한다", async ({ page }) => {
  await page.goto(PATH);

  // 추가(append) → 신규 행 입력
  await page.getByRole("button", { name: "경력 추가" }).click();
  const newPeriod = page.getByRole("textbox", { name: "경력 3 기간" });
  await expect(newPeriod).toBeVisible();
  await newPeriod.fill("2024 ~ 현재");
  await page.getByRole("textbox", { name: "경력 3 내용" }).fill("테스트 법인");

  // 삭제 → ConfirmDialog 확인
  await page.getByRole("button", { name: "경력 3 삭제" }).click();
  const dialog = page.getByRole("dialog", { name: "이 경력을 삭제할까요?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "삭제" }).click();

  // 행 제거됨
  await expect(page.getByRole("textbox", { name: "경력 3 기간" })).toHaveCount(0);
});

test("변경 후 저장하면 성공 안내가 보인다", async ({ page }) => {
  await page.goto(PATH);

  // 진입 직후 저장 버튼은 비활성(isDirty=false)
  const save = page.getByRole("button", { name: "저장하기" });
  await expect(save).toBeDisabled();

  // 변경 발생 → 활성화
  await page.getByPlaceholder(HEADLINE_PLACEHOLDER).fill("후유장해 재산정 전문 검토");
  await expect(save).toBeEnabled();

  await save.click();
  await expect(page.getByText("프로필을 저장했어요.")).toBeVisible();
});
