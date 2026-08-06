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
      className="mx-auto block px-4 py-2 text-[0.875rem] text-ink-3 transition hover:text-ink-2 disabled:opacity-50 md:mx-0 md:w-full md:rounded-button md:px-3 md:py-2.5 md:text-left md:font-medium md:hover:bg-paper"
    >
      로그아웃
    </button>
  );
}
