"use client";

import { useLogout } from "@/shared/api/use-logout";

/** 로그아웃 — 세션 종료 후 로그인 화면으로 이동(#155). */
export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={isPending}
      className="w-full rounded-button px-3 py-2.5 text-left text-[0.875rem] font-medium text-ink-3 transition hover:bg-paper hover:text-ink-2 disabled:opacity-50"
    >
      로그아웃
    </button>
  );
}
