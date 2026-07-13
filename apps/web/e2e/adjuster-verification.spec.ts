import { expect, test, type Page } from "@playwright/test";

/**
 * 손해사정사 자격 인증 신청·심사 현황 E2E (이슈 #44).
 *
 * 원칙: 핵심 사용자 흐름만 — 폼 제출→심사 현황 진입(CUJ), 미입력 제출 차단(리더 확정: 버튼 활성+클릭 시 인라인 에러),
 *   자격증 번호/사본 배타 검증, 상태 분기(PENDING/REJECTED/APPROVED/404), 반려→재제출 프리필, 반응형(퍼널/단일폼), 나중에 하기.
 * 응답은 앱 내장 MSW 기본 핸들러가 제공(POST /users/adjuster-applications 201, POST /uploads { url }).
 *   상태 분기는 GET /users/adjuster-applications/me 의 x-mock-scenario 헤더(setExtraHTTPHeaders)로 override.
 * 레이아웃 분기(useIsDesktop, md 48rem)는 project로 가름 — 데스크톱=chromium, 퍼널=mobile-chrome. beforeEach에서 skip.
 * 파일 형식·크기(20MB/pdf·image) 검증은 use-document-upload zod/TS에 위임(미테스트).
 * 정적 위임(미테스트): 서버 status enum 파싱은 zod·TS 계약.
 * 409(DUPLICATE_RESOURCE)는 POST 핸들러의 x-mock-scenario=application-duplicate 강제 override로 재현(재검 반영).
 */

const FORM_PATH = "/signup/verification";
const STATUS_PATH = "/signup/verification/status";

const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

function file(name: string) {
  return { name, mimeType: "image/png", buffer: PNG_1PX };
}

async function uploadAllDocuments(page: Page) {
  const inputs = page.locator('input[type="file"]'); // 파일 인풋은 sr-only — type 셀렉터 예외(2개: 자격증/등록증 순)
  await inputs.nth(0).setInputFiles(file("license.png"));
  await inputs.nth(1).setInputFiles(file("registration.png"));
  await expect(page.getByText("업로드됨")).toHaveCount(2);
}

// 연락처는 모바일 STEP1에만 노출(데스크톱 폼엔 없음) → 있을 때만 채운다.
async function fillBasic(page: Page) {
  await page.getByLabel("이름").fill("김상정");
  if ((await page.getByLabel("연락처").count()) > 0) {
    await page.getByLabel("연락처").fill("010-1234-5678");
  }
}

async function fillExpertise(page: Page) {
  await page.getByRole("radio", { name: "종합손해사정사 (신체 포함)" }).click();
  await page.getByRole("radio", { name: "독립 (개업)" }).click();
  await page.getByLabel("활동 지역").fill("서울 송파");
}

// ───────────────────────── 데스크톱(단일 폼) ─────────────────────────
test.describe("데스크톱 단일 폼", () => {
  // oxlint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "데스크톱(chromium) 전용 레이아웃");
  });

  test("전 필드를 입력하고 서류를 올려 신청하면 심사 현황(진행 중)으로 이동한다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await expect(page.getByRole("heading", { name: "자격 정보를 인증해주세요" })).toBeVisible();

    await fillBasic(page);
    await fillExpertise(page);
    await uploadAllDocuments(page);

    await expect(async () => {
      await page.getByRole("button", { name: "인증 신청하기" }).click();
      await expect(page).toHaveURL(new RegExp(`${STATUS_PATH}$`));
    }).toPass({ timeout: 15000 });

    await expect(page.getByRole("heading", { name: "자격 인증을 심사하고 있어요" })).toBeVisible();
    await expect(page.getByText("심사 진행 중")).toBeVisible();
  });

  test("아무것도 입력하지 않고 신청 버튼을 누르면 인라인 에러가 뜨고 이동하지 않는다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await page.getByRole("button", { name: "인증 신청하기" }).click();

    // 데스크톱 폼은 이름·자격구분·소속·활동지역만 검증(연락처 미노출).
    await expect(page.getByText("이름을 입력해 주세요.")).toBeVisible();
    await expect(page.getByText("자격 구분을 선택해 주세요.")).toBeVisible();
    await expect(page.getByText("소속을 선택해 주세요.")).toBeVisible();
    await expect(page.getByText("활동 지역을 입력해 주세요.")).toBeVisible();
    // 제출은 차단(이동 없음).
    await expect(page).toHaveURL(new RegExp(`${FORM_PATH}$`));
  });

  // B1 수정(DocumentFields resolveFieldState) 검증: 서류 미업로드 시 각 필드 인라인 에러 표면화.
  test("등록증을 올리지 않고 신청하면 서류 필드에 인라인 에러가 뜬다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await fillBasic(page);
    await fillExpertise(page);
    await page.getByRole("button", { name: "인증 신청하기" }).click();
    await expect(page.getByText("등록증을 올려 주세요.")).toBeVisible();
    await expect(page.getByText("자격증 번호 또는 사본 중 하나는 필수예요.")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${FORM_PATH}$`));
  });

  test("자격증 번호·사본이 모두 없으면 에러가 뜨고, 번호를 채우면 통과해 심사 현황으로 이동한다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await fillBasic(page);
    await fillExpertise(page);

    // 등록증만 업로드(자격증 파일 미제출), 자격증 번호도 비움
    const inputs = page.locator('input[type="file"]');
    await inputs.nth(1).setInputFiles(file("registration.png"));
    await expect(page.getByText("업로드됨")).toHaveCount(1);

    await page.getByRole("button", { name: "인증 신청하기" }).click();
    await expect(page.getByText("자격증 번호 또는 사본 중 하나는 필수예요.")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${FORM_PATH}$`));

    // 자격증 번호를 채우면 배타 조건 충족 → 제출 통과
    await page.getByLabel("손해사정사 등록번호").fill("제2014-0087호");
    await expect(async () => {
      await page.getByRole("button", { name: "인증 신청하기" }).click();
      await expect(page).toHaveURL(new RegExp(`${STATUS_PATH}$`));
    }).toPass({ timeout: 15000 });
  });

  test("나중에 하기를 누르면 고객 대시보드로 이동한다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await expect(async () => {
      await page.getByRole("button", { name: "나중에 하기" }).click();
      await expect(page).toHaveURL(/\/customer\/dashboard/);
    }).toPass({ timeout: 10000 });
  });

  test("반려 화면에서 다시 제출을 누르면 폼으로 돌아가 이전 입력이 프리필된다", async ({ page }) => {
    // 1) 폼을 채워 로컬 draft(sessionStorage) 저장 — 제출은 하지 않음(clearDraft 회피)
    await page.goto(FORM_PATH);
    await fillBasic(page);

    // 2) 반려 상태 override 후 심사 현황 진입
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-rejected" });
    await page.goto(STATUS_PATH);
    await expect(page.getByRole("heading", { name: "서류를 다시 확인해주세요" })).toBeVisible();

    // 3) 서류 다시 제출 → 폼 복귀 + 프리필
    await page.setExtraHTTPHeaders({});
    await expect(async () => {
      await page.getByRole("button", { name: "서류 다시 제출하기" }).click();
      await expect(page).toHaveURL(new RegExp(`${FORM_PATH}$`));
    }).toPass({ timeout: 10000 });
    await expect(page.getByLabel("이름")).toHaveValue("김상정");
  });

  // 409 강제 override(x-mock-scenario=application-duplicate) 검증 — 재검 반영으로 활성화.
  test("이미 신청한 상태로 신청하면 409 안내가 뜨고 심사 현황으로 유도된다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await fillBasic(page);
    await fillExpertise(page);
    await uploadAllDocuments(page);

    // 제출 시점에만 409 강제(업로드는 정상 완료 후).
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-duplicate" });
    await page.getByRole("button", { name: "인증 신청하기" }).click();
    await expect(page.getByText("이미 자격 인증을 신청하셨어요.", { exact: false })).toBeVisible();

    // 심사 현황 보기 → /status(GET은 pending으로 정착시켜 리다이렉트 바운스 방지).
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-pending" });
    await expect(async () => {
      await page.getByRole("button", { name: "심사 현황 보기" }).click();
      await expect(page).toHaveURL(new RegExp(`${STATUS_PATH}$`));
    }).toPass({ timeout: 10000 });
  });
});

// ───────────────────────── 상태 분기(override, 반응형 공용) ─────────────────────────
test.describe("심사 현황 상태 분기", () => {
  test("미신청(404)이면 신청 폼으로 리다이렉트된다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-not-applied" });
    await page.goto(STATUS_PATH);
    await expect(page).toHaveURL(new RegExp(`${FORM_PATH}$`));
  });

  test("심사 중(PENDING)이면 진행 타임라인이 보인다", async ({ page }, testInfo) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-pending" });
    await page.goto(STATUS_PATH);
    // ReviewTimeline은 md 경계로 레이아웃 분기(모바일=가로 스테퍼, 데스크톱=세로 카드).
    if (testInfo.project.name === "chromium") {
      await expect(page.getByRole("heading", { name: "자격 인증을 심사하고 있어요" })).toBeVisible();
      await expect(page.getByText("서류 제출 완료")).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: "자격 심사가 진행 중이에요" })).toBeVisible();
      await expect(page.getByText("제출 완료", { exact: true })).toBeVisible();
    }
  });

  test("반려(REJECTED)면 반려 사유와 서류별 결과가 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-rejected" });
    await page.goto(STATUS_PATH);
    await expect(page.getByRole("heading", { name: "서류를 다시 확인해주세요" })).toBeVisible();
    await expect(page.getByText("재제출 필요")).toBeVisible();
    await expect(page.getByRole("button", { name: "서류 다시 제출하기" })).toBeVisible();
  });

  test("승인(APPROVED)이면 배지 발급 안내와 파트너 진입 버튼이 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-approved" });
    await page.goto(STATUS_PATH);
    await expect(page.getByRole("heading", { name: "자격 인증이 완료되었어요" })).toBeVisible();
    await expect(page.getByRole("button", { name: "파트너 영역 진입하기" })).toBeVisible();
  });

  test("401(로그인 필요)이면 로그인 유도가 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-failure": "application-unauthorized" });
    await page.goto(STATUS_PATH);
    await expect(page.getByText("로그인이 필요해요. 다시 로그인한 뒤 확인해 주세요.")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인하기" })).toBeVisible();
  });
});

// ───────────────────────── 모바일(3스텝 퍼널) ─────────────────────────
test.describe("모바일 3스텝 퍼널", () => {
  // oxlint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chrome", "모바일(mobile-chrome) 전용 레이아웃");
  });

  test("STEP을 순서대로 진행해 신청하면 심사 현황으로 이동하고, 뒤로가기로 이전 STEP에 돌아간다", async ({
    page,
  }) => {
    await page.goto(FORM_PATH);

    // STEP1 기본 정보
    await expect(page.getByRole("heading", { name: "기본 정보" })).toBeVisible();
    await fillBasic(page);
    await page.getByRole("button", { name: "다음" }).click();

    // STEP2 전문성
    await expect(page).toHaveURL(/step=expertise/);
    await fillExpertise(page);

    // 뒤로가기 → STEP1 복귀 후 다시 진행(내비 유실 가드)
    await page.getByRole("button", { name: "이전 단계로" }).click();
    await expect(page.getByRole("heading", { name: "기본 정보" })).toBeVisible();
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page).toHaveURL(/step=expertise/);
    await page.getByRole("button", { name: "다음" }).click();

    // STEP3 자격 증빙
    await expect(page).toHaveURL(/step=documents/);
    await uploadAllDocuments(page);

    await expect(async () => {
      await page.getByRole("button", { name: "등록 신청하기" }).click();
      await expect(page).toHaveURL(new RegExp(`${STATUS_PATH}$`));
    }).toPass({ timeout: 15000 });
    // 모바일 레이아웃의 심사 현황 헤딩(가로 스테퍼).
    await expect(page.getByRole("heading", { name: "자격 심사가 진행 중이에요" })).toBeVisible();
  });

  test("STEP1에서 미입력으로 다음을 누르면 인라인 에러가 뜨고 진행되지 않는다", async ({ page }) => {
    await page.goto(FORM_PATH);
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.getByText("이름을 입력해 주세요.")).toBeVisible();
    await expect(page).not.toHaveURL(/step=expertise/);
  });
});
