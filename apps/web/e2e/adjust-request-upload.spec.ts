import { expect, test, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import {
  ADJUST_REQUEST_PATH as PATH,
  attachDocument,
  attachRequiredDocuments,
  fillToDocumentStep,
} from "./_adjust-request-helpers";

/**
 * 분석 신청 서류 업로드 대기 가드 E2E (이슈 #271).
 * 원칙: 업로드 응답 전에 제출돼 documents가 비는 회귀를 사용자 행동으로 막는다.
 *   ① 업로드 중 "다음"은 안내와 함께 막히고,
 *   ② 업로드를 마치고 제출하면 요청 본문에 서류가 실려 나간다.
 * 업로드 지연은 목 핸들러를 건드리지 않고 스펙 안에서 응답을 늦춰 재현한다.
 */

interface ReportSubmission {
  documents?: Array<{ s3_url?: string }>;
}

/**
 * 제출 본문 기록.
 * MSW가 서비스 워커에서 요청을 가로채 Playwright 쪽 postData가 비므로,
 * 페이지 fetch를 감싸 실제로 나간 body를 모은다.
 */
async function recordReportSubmissions(page: Page) {
  await page.addInitScript(() => {
    const submissions: unknown[] = [];
    (window as unknown as { capturedReportSubmissions: unknown[] }).capturedReportSubmissions = submissions;
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const request = new Request(input as RequestInfo, init);
      if (request.method === "POST" && new URL(request.url).pathname.endsWith("/reports")) {
        submissions.push(await request.clone().json());
      }
      return originalFetch(request);
    };
  });
}

function readReportSubmissions(page: Page): Promise<ReportSubmission[]> {
  return page.evaluate(
    () => (window as unknown as { capturedReportSubmissions: ReportSubmission[] }).capturedReportSubmissions,
  );
}

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("서류 업로드가 끝나기 전에 다음을 누르면 안내와 함께 막힌다", async ({ page }) => {
  // 업로드 응답을 늦춰 "업로드 중" 상태를 만든다.
  await page.route("**/uploads", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });

  await page.goto(PATH);
  await fillToDocumentStep(page);
  await attachDocument(page, "진단서");

  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByText("서류 업로드가 끝난 뒤에 진행할 수 있어요.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "관련 서류를 올려주세요" })).toBeVisible();
});

test("업로드를 마치고 제출하면 요청 본문에 서류가 포함된다", async ({ page }) => {
  await recordReportSubmissions(page);

  await page.goto(PATH);
  await fillToDocumentStep(page);
  await attachRequiredDocuments(page);
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "분석 준비가 끝났어요" })).toBeVisible();
  await page.getByText("민감정보").click();
  await page.getByText("법적 효력이 없음").click();
  await page.getByRole("button", { name: /분석 요청/ }).click();

  await expect(page.getByRole("heading", { name: "분석 요청이 접수됐어요" })).toBeVisible();

  const submitted = await readReportSubmissions(page);
  const documents = submitted[0]?.documents;
  expect(documents).toHaveLength(2);
  for (const document of documents ?? []) {
    expect(document.s3_url).toBeTruthy();
  }
});
