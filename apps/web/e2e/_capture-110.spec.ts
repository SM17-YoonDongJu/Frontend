import { test } from "@playwright/test";

/** PR 스크린샷 캡처 헬퍼(#110). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-110";
const PATH = "/customer/adjusters";

async function openDropdown(page: import("@playwright/test").Page) {
  await page.goto(PATH);
  await page.getByRole("article").first().waitFor();
  await page.getByRole("button", { name: "지역", exact: true }).click();
  return page.getByRole("dialog", { name: "지역 선택" });
}

test.use({ viewport: { width: 1280, height: 900 } });

test("01 시·도 선택", async ({ page }) => {
  await openDropdown(page);
  await page.screenshot({ path: `${DIR}/01-region-sido.png` });
});

test("02 시·군·구 선택", async ({ page }) => {
  const dropdown = await openDropdown(page);
  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await page.screenshot({ path: `${DIR}/02-region-district.png` });
});

test("03 지역명 검색", async ({ page }) => {
  const dropdown = await openDropdown(page);
  await dropdown.getByLabel("지역 검색").fill("강남");
  await page.screenshot({ path: `${DIR}/03-region-search.png` });
});

test("04 두 곳 선택 후 적용", async ({ page }) => {
  const dropdown = await openDropdown(page);
  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await dropdown.getByText("강남구", { exact: true }).click();
  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await dropdown.getByRole("button", { name: "경기도" }).click();
  await dropdown.getByText("수원시", { exact: true }).click();
  await page.screenshot({ path: `${DIR}/04-region-multi.png` });
});

test("05 적용 결과 목록", async ({ page }) => {
  const dropdown = await openDropdown(page);
  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await dropdown.getByText("강남구", { exact: true }).click();
  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await dropdown.getByRole("button", { name: "경기도" }).click();
  await dropdown.getByText("수원시", { exact: true }).click();
  await dropdown.getByRole("button", { name: "적용 (2)" }).click();
  await page.getByRole("button", { name: /서울 강남구 외 1곳/ }).waitFor();
  await page.screenshot({ path: `${DIR}/05-region-applied.png` });
});

test("06 모바일 하단 시트", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dropdown = await openDropdown(page);
  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await page.screenshot({ path: `${DIR}/06-region-mobile.png` });
});
