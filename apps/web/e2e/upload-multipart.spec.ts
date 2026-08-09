import { expect, test, type Page, type Request } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/**
 * 업로드 계약 E2E (이슈 #240).
 *
 * 원칙: 업로드 4경로(사정사 지원 서류·파트너 아바타·고객 아바타·리포트 서류)가
 *   POST /uploads multipart 단일 요청으로 끝나고 S3 직접 PUT이 없는지 네트워크로 확인한다.
 *   화면 단위 흐름은 각 화면 스펙이 이미 덮으므로 여기선 요청 형태와 purpose 도달만 본다.
 * purpose는 목이 돌려주는 s3_url의 key prefix로 확인 — 파일 스트림 body는 Playwright가 읽지 못한다.
 * 형식 위반(webp)은 요청이 아예 나가지 않는지로 사전 검증을 확인한다.
 */

test.use({ viewport: { width: 1280, height: 900 } });

const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

function trackUploads(page: Page) {
  const posts: Request[] = [];
  const puts: Request[] = [];
  page.on("request", (req) => {
    if (!req.url().includes("/uploads")) return;
    if (req.method() === "POST") posts.push(req);
    if (req.method() === "PUT") puts.push(req);
  });
  return { posts, puts };
}

/**
 * 요청 헤더로 multipart 여부를, 응답 s3_url의 key prefix로 purpose 도달을 확인한다.
 * (파일 스트림 body는 Playwright가 읽지 못해 파트명 직접 대조는 불가 — 목이 purpose별 prefix를 돌려주는 걸로 대신한다.)
 */
async function assertMultipartUpload(req: Request | undefined, expectedPrefix: string) {
  expect(req).toBeDefined();
  if (!req) return;

  const contentType = req.headers()["content-type"] ?? "";
  expect(contentType).toContain("multipart/form-data");
  expect(contentType).toContain("boundary=");

  const res = await req.response();
  const json = await res!.json();
  expect(json.data.s3_url).toContain(`/${expectedPrefix}/`);
}

test("사정사 지원 서류: multipart 단일 요청 + purpose=license", async ({ page }) => {
  const net = trackUploads(page);
  await hideQueryDevtools(page);
  await page.goto("/signup/verification");

  await page.locator('input[type="file"]').nth(0).setInputFiles({
    name: "license.png",
    mimeType: "image/png",
    buffer: PNG_1PX,
  });
  await expect(page.getByText("업로드됨")).toHaveCount(1);

  expect(net.posts).toHaveLength(1);
  expect(net.puts).toHaveLength(0);
  await assertMultipartUpload(net.posts[0], "licenses");
});

test("파트너 프로필 아바타: multipart 단일 요청 + purpose=avatar", async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
  const net = trackUploads(page);
  await hideQueryDevtools(page);
  await page.goto("/partner/profile/edit");

  await page.locator('input[type="file"]').first().setInputFiles({
    name: "me.png",
    mimeType: "image/png",
    buffer: PNG_1PX,
  });

  await expect(async () => {
    expect(net.posts).toHaveLength(1);
  }).toPass({ timeout: 10000 });
  expect(net.puts).toHaveLength(0);
  await assertMultipartUpload(net.posts[0], "avatars");
  await expect(page.getByAltText("프로필 사진 미리보기")).toBeVisible();
});

test("파트너 프로필 아바타: webp를 고르면 요청 없이 형식 안내가 뜬다", async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
  const net = trackUploads(page);
  await hideQueryDevtools(page);
  await page.goto("/partner/profile/edit");

  await page.locator('input[type="file"]').first().setInputFiles({
    name: "me.webp",
    mimeType: "image/webp",
    buffer: PNG_1PX,
  });

  await expect(page.getByText("JPG·PNG 형식만 올릴 수 있어요.")).toBeVisible();
  expect(net.posts).toHaveLength(0);
});

test("고객 마이페이지 아바타: multipart 단일 요청 + webp는 요청 없이 안내", async ({ page }) => {
  await setAuthCookie(page, "USER");
  const net = trackUploads(page);
  await hideQueryDevtools(page);
  await page.goto("/customer/mypage");
  await page.getByRole("button", { name: "프로필 수정" }).click();

  const input = page.locator('input[type="file"]').first();
  await input.setInputFiles({ name: "me.webp", mimeType: "image/webp", buffer: PNG_1PX });
  await expect(page.getByText("JPG·PNG 형식만 올릴 수 있어요.")).toBeVisible();
  expect(net.posts).toHaveLength(0);

  await input.setInputFiles({ name: "me.png", mimeType: "image/png", buffer: PNG_1PX });
  await expect(async () => {
    expect(net.posts).toHaveLength(1);
  }).toPass({ timeout: 10000 });
  expect(net.puts).toHaveLength(0);
  await assertMultipartUpload(net.posts[0], "avatars");
});

test("리포트 서류 슬롯: multipart 단일 요청 + purpose=report_document", async ({ page }) => {
  await setAuthCookie(page, "USER");
  const net = trackUploads(page);
  await hideQueryDevtools(page);
  await page.goto("/customer/adjust-request");

  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await expect(async () => {
    await medicalCard.click();
    await expect(medicalCard).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "어떤 진단을 받으셨나요?" })).toBeVisible();
  await page.getByRole("button", { name: "통원", exact: true }).click();
  await page.getByPlaceholder("예) 우측 슬관절 골절").fill("우측 슬관절 골절");
  await page.getByRole("button", { name: "포함", exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "언제 있었던 일인가요?" })).toBeVisible();
  await page.getByRole("button", { name: "사고 발생일 선택" }).click();
  await page.getByRole("button", { name: /15일|15/ }).first().click();
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "제안받은 보험금이 있나요?" })).toBeVisible();
  await page.getByText("아직 제안받지 않았어요").click();
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "손해사정사에게 전할 말이 있나요?" })).toBeVisible();
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "관련 서류를 올려주세요" })).toBeVisible();
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "diagnosis.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 test"),
  });

  await expect(async () => {
    expect(net.posts).toHaveLength(1);
  }).toPass({ timeout: 10000 });
  expect(net.puts).toHaveLength(0);
  await assertMultipartUpload(net.posts[0], "report-documents");
});
