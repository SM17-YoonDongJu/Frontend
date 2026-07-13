import type { Page } from "@playwright/test";

/**
 * 지역 선택 드롭다운 조작 헬퍼. 활동 지역·마이페이지 지역 스펙이 함께 쓴다.
 *
 * dev 서버에는 React Query devtools 플로팅 버튼이 화면 하단에 떠 있어 모바일 시트의
 * 푸터 버튼("적용")을 가린다. production 빌드(CI)에는 없지만 로컬 실행을 위해 숨긴다.
 */
export async function hideQueryDevtools(page: Page) {
  await page.addInitScript(() => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        const style = document.createElement("style");
        style.textContent = ".tsqd-parent-container { display: none !important; }";
        document.head.append(style);
      },
      { once: true },
    );
  });
}

function dropdown(page: Page) {
  return page.getByRole("dialog", { name: "지역 선택" });
}

async function openRegionSelect(page: Page) {
  await page.getByRole("button", { name: "지역", exact: true }).click();
  return dropdown(page);
}

/** 다중 모드: 시·군·구 여러 곳을 고르고 "적용"을 누른다. */
export async function selectRegions(page: Page, regions: [string, string][]) {
  const panel = await openRegionSelect(page);

  for (const [sido, district] of regions) {
    await panel.getByRole("button", { name: sido }).click();
    await panel.getByText(district, { exact: true }).click();
    await panel.getByRole("button", { name: sido }).click();
  }

  await panel.getByRole("button", { name: `적용 (${regions.length})` }).click();
}

/** 단일 모드: 시·군·구 한 곳을 고른다(고르는 즉시 닫힌다). */
export async function selectRegion(page: Page, sido: string, district: string) {
  const panel = await openRegionSelect(page);
  await panel.getByRole("button", { name: sido }).click();
  await panel.getByText(district, { exact: true }).click();
}
