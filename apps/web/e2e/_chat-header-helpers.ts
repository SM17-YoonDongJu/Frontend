import { expect, type Page } from "@playwright/test";

/**
 * 채팅 스레드 헤더 보조 액션은 전부 "더보기" 패널 안에 있다(데스크톱·모바일 동일).
 * 하이드레이션 전 클릭은 유실되므로 패널이 열릴 때까지 재시도한다.
 */
export async function openChatHeaderMenu(page: Page) {
  const trigger = page.getByRole("button", { name: "더보기" });
  const menu = page.getByRole("menu");

  await expect(async () => {
    if ((await trigger.getAttribute("aria-expanded")) !== "true") {
      await trigger.click();
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  }).toPass({ timeout: 15000 });
  await expect(menu).toBeVisible();

  return menu;
}

/** 더보기를 열고 해당 항목을 누른다. */
export async function clickChatHeaderAction(page: Page, name: string) {
  const menu = await openChatHeaderMenu(page);
  await menu.getByRole("menuitem", { name, exact: true }).click();
}
