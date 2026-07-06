"use client";

/** 로그아웃 — auth 미구현으로 UI만 제공(후속 이슈에서 POST /auth/logout 연결). */
export function LogoutButton() {
  return (
    <button
      type="button"
      className="mx-auto block px-4 py-2 text-[0.875rem] text-ink-3 transition hover:text-ink-2 md:hidden"
    >
      로그아웃
    </button>
  );
}
