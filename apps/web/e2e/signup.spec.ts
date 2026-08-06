import { expect, test, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools, selectRegion } from "./_region-helpers";

/**
 * 일반 사용자 회원가입 퍼널 E2E (이슈 #43·#173·#256).
 *
 * 원칙: 핵심 사용자 흐름만 — 역할 선택 → 약관 동의 → 본인 확인 → 가입 완료(CUJ),
 *   필수 약관 게이트, 전체 동의 토글, 본인 확인 필수값 게이트, 중복 계정 에러(고가치),
 *   약관 상세 왕복, 손해사정사 분기, 단계 직접 진입 가드.
 * 응답은 기본 MSW 핸들러(POST /auth/register: 성공 201 + 토큰)가 제공.
 *   소셜 컨텍스트(socialToken/email)는 진입 쿼리로 주입(개발·E2E 경로) —
 *   컨텍스트 없이 직접 진입하면 /login으로 가드되므로 mock 폴백 없음.
 * 로그인 가드(#185): 가입자는 비로그인이 정상 흐름 — 기본 MSW /users/me가 로그인 유저를
 *   반환하므로 beforeEach에서 비로그인 시나리오 헤더를 주입한다(로그인 상태 진입 테스트만 예외).
 * DUPLICATE_RESOURCE는 이름 "중복닉네임" 입력으로 MSW 409 분기를 태워 검증(핸들러 override 대체).
 * 필드 형식·범위(이름 1~30자 등) 검증은 zod·MSW 계약에 위임(미테스트).
 * 요청 body는 MSW 서비스워커 경유라 Playwright가 못 읽는다 — 이름은 완료 화면 echo·409 분기로,
 *   지역 전송은 zod 필수 계약(registerBodySchema)으로 담보한다.
 */

const PATH = "/signup?socialToken=e2e-social-token&email=yunseo%40email.com";

// 하이드레이션 전 클릭 유실 방지: 클릭+상태확인을 묶어 재시도.
async function selectRole(page: Page, name: RegExp) {
  const card = page.getByRole("radio", { name });
  await expect(async () => {
    await card.click();
    await expect(card).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
}

async function goThroughToConsent(page: Page, path = PATH) {
  await page.goto(path);
  await selectRole(page, /일반 사용자/);
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.getByRole("heading", { name: "약관에 동의해주세요" })).toBeVisible();
}

async function goThroughToIdentity(page: Page, path = PATH) {
  await goThroughToConsent(page, path);
  await page.getByRole("button", { name: "전체 동의" }).click();
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByRole("heading", { name: "본인 확인을 해주세요" })).toBeVisible();
}

async function fillIdentity(page: Page, name = "윤서") {
  await page.getByLabel("이름").fill(name);
  await page.getByRole("radio", { name: "여성" }).click();
  await page.getByLabel("생년월일").fill("19950615");
  await page.getByLabel("휴대폰 번호").fill("01012345678");
  await selectRegion(page, "서울특별시", "강남구", /거주 지역/);
}

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
});

test("역할·약관 동의·본인 확인을 마치고 가입하면 완료 화면과 대시보드 이동 버튼이 보인다", async ({ page }) => {
  // 가입 완료 후 이동 목적지(/customer/dashboard)는 미들웨어 보호 라우트 — MSW는 실제 쿠키를 못 심으므로 직접 주입.
  await setAuthCookie(page, "USER");
  await goThroughToIdentity(page);

  await fillIdentity(page);
  await page.getByRole("button", { name: "다음" }).click();

  await expect(page.getByRole("heading", { name: "가입이 완료됐어요" })).toBeVisible();
  // 소셜 mock 이메일 + 본인 확인 스텝에 입력한 이름(#256) — 완료 화면 이름은 register 응답 echo.
  await expect(page.getByText("yunseo@email.com")).toBeVisible();
  await expect(page.getByText("윤서", { exact: true })).toBeVisible();

  const startButton = page.getByRole("button", { name: "보상 분석 시작" });
  await expect(startButton).toBeVisible();
  // 가입 성공으로 로그인된 상태를 반영 — 이후 대시보드 진입이 가드에 막히지 않도록 헤더 해제.
  await page.setExtraHTTPHeaders({});
  await expect(async () => {
    await startButton.click();
    await expect(page).toHaveURL(/\/customer\/dashboard/);
  }).toPass({ timeout: 10000 });
});

test("본인 확인 필수값을 채우지 않으면 검증 메시지가 보이고 다음으로 넘어가지 않는다", async ({ page }) => {
  await goThroughToIdentity(page);

  await page.getByRole("button", { name: "다음" }).click();

  await expect(page.getByText("이름을 입력해 주세요.")).toBeVisible();
  await expect(page.getByText("성별을 선택해 주세요.")).toBeVisible();
  await expect(page.getByText("생년월일을 입력해 주세요.")).toBeVisible();
  await expect(page.getByText("휴대폰 번호를 입력해 주세요.")).toBeVisible();
  await expect(page.getByText("지역을 선택해 주세요.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "본인 확인을 해주세요" })).toBeVisible();
});

test("필수 약관에 동의하기 전에는 다음 버튼이 비활성이고, 필수 2개만 체크하면 활성된다", async ({ page }) => {
  await goThroughToConsent(page);

  const next = page.getByRole("button", { name: "다음" });
  await expect(next).toBeDisabled();

  await page.getByText("(필수) 서비스 이용약관 동의").click();
  await page.getByText("(필수) 개인정보 처리방침 동의").click();

  // 마케팅(선택) 미동의여도 활성
  await expect(next).toBeEnabled();
});

test("전체 동의를 누르면 마케팅을 포함한 세 항목이 모두 체크된다", async ({ page }) => {
  await goThroughToConsent(page);

  await page.getByRole("button", { name: "전체 동의" }).click();

  await expect(page.getByRole("checkbox", { name: /서비스 이용약관/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /개인정보 처리방침/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /마케팅 정보 수신/ })).toBeChecked();
});

test("이미 가입된 계정이면 가입 시 중복 안내가 노출된다", async ({ page }) => {
  await goThroughToIdentity(page);

  await fillIdentity(page, "중복닉네임");
  await page.getByRole("button", { name: "다음" }).click();

  await expect(page.getByText("이미 가입된 계정이에요. 로그인으로 진행해 주세요.")).toBeVisible();
  // 에러 후에도 완료로 넘어가지 않고 본인 확인 화면 유지(재시도 가능)
  await expect(page.getByRole("heading", { name: "본인 확인을 해주세요" })).toBeVisible();
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

test("약관 동의 없이 본인 확인 단계로 직접 진입하면 첫 단계로 되돌아간다", async ({ page }) => {
  await page.goto(`${PATH}&step=identity`);

  await expect(page.getByRole("heading", { name: "어떤 역할로 시작하시겠어요?" })).toBeVisible();
});

test("소셜 인증 컨텍스트 없이 직접 진입하면 로그인으로 되돌아간다", async ({ page }) => {
  await page.goto("/signup");

  await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "바른보상 시작하기" })).toBeVisible();
});

test("로그인 상태로 진입하면 역할별 홈으로 이동한다", async ({ page }) => {
  // 기본 MSW /users/me = 로그인 유저(윤서, insured_person) — 비로그인 헤더 해제로 복원.
  await page.setExtraHTTPHeaders({});
  // 도착지(/customer/dashboard)는 미들웨어 보호 라우트 — MSW는 실제 쿠키를 못 심으므로 직접 주입.
  await setAuthCookie(page, "USER");
  await page.goto("/signup");

  await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });
});

test("손해사정사를 선택하고 시작하면 자격 인증 안내가 노출된다", async ({ page }) => {
  await page.goto(PATH);
  await selectRole(page, /손해사정사/);
  await page.getByRole("button", { name: "시작하기" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "자격 인증이 필요해요" })).toBeVisible();
});
