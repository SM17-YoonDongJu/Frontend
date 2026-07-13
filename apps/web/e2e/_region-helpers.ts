import type { Page } from "@playwright/test";

/**
 * 지역 선택 드롭다운 조작 헬퍼. 활동 지역·마이페이지 지역 스펙이 함께 쓴다.
 *
 * dev 서버에는 React Query devtools와 Next 개발 인디케이터가 화면 하단에 떠 있어
 * 시트 푸터 버튼("적용")을 가린다. production 빌드(CI)에는 없지만 로컬 실행을 위해 숨긴다.
 */
export async function hideQueryDevtools(page: Page) {
  await page.addInitScript(() => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        const style = document.createElement("style");
        style.textContent =
          ".tsqd-parent-container, nextjs-portal { display: none !important; }";
        document.head.append(style);
      },
      { once: true },
    );
  });
}

function dropdown(page: Page) {
  return page.getByRole("dialog", { name: "지역 선택" });
}

async function openRegionSelect(page: Page, trigger: string | RegExp = "지역") {
  await page
    .getByRole("button", { name: trigger, exact: typeof trigger === "string" })
    .click();
  return dropdown(page);
}

/**
 * 다중 모드: 시·군·구 여러 곳을 고르고 "적용"을 누른다.
 * reset=true면 기존 선택을 비우고 시작한다(선택 개수가 이미 있는 폼용).
 */
export async function selectRegions(
  page: Page,
  regions: [string, string][],
  { reset = false, trigger = "지역" }: { reset?: boolean; trigger?: string | RegExp } = {},
) {
  const panel = await openRegionSelect(page, trigger);
  if (reset) await panel.getByRole("button", { name: "초기화" }).click();

  for (const [sido, district] of regions) {
    await panel.getByRole("button", { name: sido }).click();
    await panel.getByText(district, { exact: true }).click();
    await panel.getByRole("button", { name: sido }).click();
  }

  await panel.getByRole("button", { name: /^적용 \(\d+\)$/ }).click();
}

/** 단일 모드: 시·군·구 한 곳을 고른다(고르는 즉시 닫힌다). */
export async function selectRegion(
  page: Page,
  sido: string,
  district: string,
  trigger: string | RegExp = "지역",
) {
  const panel = await openRegionSelect(page, trigger);
  await panel.getByRole("button", { name: sido }).click();
  await panel.getByText(district, { exact: true }).click();
}
