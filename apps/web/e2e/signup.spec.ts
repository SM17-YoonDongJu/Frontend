import { expect, test, type Page } from "@playwright/test";

/**
 * 일반 사용자 회원가입 퍼널 E2E (이슈 #43).
 *
 * 원칙: 핵심 사용자 흐름만 — 역할 선택 → 약관 동의 → 가입 완료(CUJ),
 *   필수 약관 게이트, 전체 동의 토글, 중복 계정 에러(고가치), 약관 상세 왕복, 손해사정사 분기.
 * 응답은 기본 MSW 핸들러(POST /auth/register: 성공 201 + 토큰)가 제공.
 *   소셜 컨텍스트(socialToken/nickname/email)는 진입 쿼리로 주입(개발·E2E 경로) —
 *   컨텍스트 없이 직접 진입하면 /login으로 가드되므로 mock 폴백 없음.
 * DUPLICATE_RESOURCE는 nickname "중복닉네임" 진입 쿼리로 MSW 409 분기를 태워 검증(핸들러 override 대체).
 * 필드 형식·범위(닉네임 2~20자 등) 검증은 zod·MSW 계약에 위임(미테스트).
 */

const PATH = "/signup?socialToken=e2e-social-token&nickname=%EC%9C%A4%EC%84%9C&email=yunseo%40email.com";
const DUPLICATE_PATH = "/signup?socialToken=dup&nickname=%EC%A4%91%EB%B3%B5%EB%8B%89%EB%84%A4%EC%9E%84";

// 하이드레이션 전 클릭 유실 방지: 클릭+상태확인을 묶어 재시도.
async function selectRole(page: Page, name: RegExp) {
  const card = page.getByRole("radio", { name });
  await expect(async () => {
    await card.click();
    await expect(card).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
}

async function goThroughToConsent(page: Page) {
  await page.goto(PATH);
  await selectRole(page, /일반 사용자/);
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.getByRole("heading", { name: "약관에 동의해주세요" })).toBeVisible();
}

test("일반 사용자로 역할·약관 동의 후 가입하면 완료 화면과 대시보드 이동 버튼이 보인다", async ({ page }) => {
  await goThroughToConsent(page);

  await page.getByRole("button", { name: "전체 동의" }).click();
  await page.getByRole("button", { name: "동의하고 가입" }).click();

  await expect(page.getByRole("heading", { name: "가입이 완료됐어요" })).toBeVisible();
  // 소셜 mock 이메일·닉네임(=이름) 노출
  await expect(page.getByText("yunseo@email.com")).toBeVisible();
  await expect(page.getByText("윤서", { exact: true })).toBeVisible();

  const startButton = page.getByRole("button", { name: "보상 분석 시작" });
  await expect(startButton).toBeVisible();
  await expect(async () => {
    await startButton.click();
    await expect(page).toHaveURL(/\/customer\/dashboard/);
  }).toPass({ timeout: 10000 });
});

test("필수 약관에 동의하기 전에는 가입 버튼이 비활성이고, 필수 2개만 체크하면 활성된다", async ({ page }) => {
  await goThroughToConsent(page);

  const submit = page.getByRole("button", { name: "동의하고 가입" });
  await expect(submit).toBeDisabled();

  await page.getByText("(필수) 서비스 이용약관 동의").click();
  await page.getByText("(필수) 개인정보 처리방침 동의").click();

  // 마케팅(선택) 미동의여도 활성
  await expect(submit).toBeEnabled();
});

test("전체 동의를 누르면 마케팅을 포함한 세 항목이 모두 체크된다", async ({ page }) => {
  await goThroughToConsent(page);

  await page.getByRole("button", { name: "전체 동의" }).click();

  await expect(page.getByRole("checkbox", { name: /서비스 이용약관/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /개인정보 처리방침/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /마케팅 정보 수신/ })).toBeChecked();
});

test("이미 가입된 계정이면 가입 시 중복 안내가 노출된다", async ({ page }) => {
  await page.goto(DUPLICATE_PATH);
  await selectRole(page, /일반 사용자/);
  await page.getByRole("button", { name: "시작하기" }).click();

  await page.getByRole("button", { name: "전체 동의" }).click();
  await page.getByRole("button", { name: "동의하고 가입" }).click();

  await expect(page.getByText("이미 가입된 계정이에요. 로그인으로 진행해 주세요.")).toBeVisible();
  // 에러 후에도 완료로 넘어가지 않고 약관 화면 유지(재시도 가능)
  await expect(page.getByRole("button", { name: "동의하고 가입" })).toBeVisible();
});

test("약관 상세보기로 이동했다가 돌아와도 선택한 동의 상태가 유지된다", async ({ page }) => {
  await goThroughToConsent(page);

  await page.getByText("(필수) 서비스 이용약관 동의").click();
  await expect(page.getByRole("checkbox", { name: /서비스 이용약관/ })).toBeChecked();

  await expect(async () => {
    await page.getByRole("link", { name: /서비스 이용약관 상세보기/ }).click();
    await expect(page).toHaveURL(/\/signup\/terms\/service/);
  }).toPass({ timeout: 10000 });
  await expect(page.getByRole("heading", { name: "서비스 이용약관" })).toBeVisible();

  await page.goBack();

  await expect(page.getByRole("heading", { name: "약관에 동의해주세요" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /서비스 이용약관/ })).toBeChecked();
});

test("소셜 인증 컨텍스트 없이 직접 진입하면 로그인으로 되돌아간다", async ({ page }) => {
  await page.goto("/signup");

  await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
});

test("손해사정사를 선택하고 시작하면 자격 인증 안내가 노출된다", async ({ page }) => {
  await page.goto(PATH);
  await selectRole(page, /손해사정사/);
  await page.getByRole("button", { name: "시작하기" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "자격 인증이 필요해요" })).toBeVisible();
});
